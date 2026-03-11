# Analyze Dictionary Usage Script
# This script finds unused dictionary items and missing dictionary references in code

param(
    [string]$DictionaryPath = "..\authoring\items\demo\`$Sites\`$main\`$Content\main\Dictionary",
    [string]$CodePath = "..\headapps\nextjs-starter\src",
    [switch]$Debug
)

# Function to extract dictionary keys from YAML files
function Get-DictionaryKeys {
    param([string]$DictionaryPath)

    Write-Host "Scanning dictionary items..." -ForegroundColor Cyan

    $dictionaryItems = @{}

    if (-not (Test-Path $DictionaryPath)) {
        Write-Error "Dictionary path not found: $DictionaryPath"
        return $dictionaryItems
    }

    # Get all dictionary item files (exclude the main A.yml to Z.yml folder files)
    $dictionaryFiles = Get-ChildItem -Path $DictionaryPath -Recurse -Filter "*.yml" |
        Where-Object { $_.Directory.Name -match '^[A-Z]$' -and $_.Name -ne "$($_.Directory.Name).yml" }

    Write-Host "Found $($dictionaryFiles.Count) dictionary item files"

    foreach ($file in $dictionaryFiles) {
        if ($Debug) {
            $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart('\')
            Write-Host "  Parsing: $relativePath" -ForegroundColor Gray
        }

        try {
            $content = Get-Content -LiteralPath $file.FullName -Raw
            $lines = $content -split "`n"

            $key = $null
            $inSharedFields = $false

            for ($i = 0; $i -lt $lines.Count; $i++) {
                $line = $lines[$i].TrimEnd()

                # Check for SharedFields section
                if ($line -eq "SharedFields:") {
                    $inSharedFields = $true
                    continue
                }

                # Check for end of SharedFields
                if ($inSharedFields -and $line -match '^[A-Za-z].*:$') {
                    $inSharedFields = $false
                }

                # If we're in SharedFields, look for Key field (ID: 580c75a8-c01a-4580-83cb-987776ceb3af)
                if ($inSharedFields) {
                    if ($line -match '^\s*- ID: "580c75a8-c01a-4580-83cb-987776ceb3af"') {
                        # Next line should be Hint: Key, then Value: [key value]
                        if ($i + 2 -lt $lines.Count) {
                            $valueLine = $lines[$i + 2].TrimEnd()
                            if ($valueLine -match '^\s*Value:\s*(.+)$') {
                                $key = $matches[1].Trim()
                                # Remove surrounding quotes if present
                                if ($key.StartsWith('"') -and $key.EndsWith('"')) {
                                    $key = $key.Substring(1, $key.Length - 2)
                                }
                                break
                            }
                        }
                    }
                }
            }

            if ($key) {
                $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart('\')
                $dictionaryItems[$key] = @{
                    FilePath = $relativePath
                    FileName = $file.Name
                }

                if ($Debug) {
                    Write-Host "    Found key: '$key'" -ForegroundColor Green
                }
            }
        }
        catch {
            Write-Warning "Error parsing file '$($file.FullName)': $($_.Exception.Message)"
        }
    }

    Write-Host "Extracted $($dictionaryItems.Count) dictionary keys`n"
    return $dictionaryItems
}

# Function to find all t('...') usages in code
function Get-CodeUsages {
    param([string]$CodePath)

    Write-Host "Scanning code for dictionary usage..." -ForegroundColor Cyan

    $codeUsages = @{}

    if (-not (Test-Path $CodePath)) {
        Write-Error "Code path not found: $CodePath"
        return $codeUsages
    }

    # Get all TypeScript/JavaScript files
    $codeFiles = Get-ChildItem -Path $CodePath -Recurse -Include "*.ts", "*.tsx", "*.js", "*.jsx"

    Write-Host "Found $($codeFiles.Count) code files to scan"

    # Regex patterns to match t('key'), t("key"), t(`key`) with various whitespace
    # Use word boundary \b to ensure 't' is not part of another word (like 'split')
    $patterns = @(
        "\bt\(\s*'([^']+)'\s*\)",     # t('key')
        '\bt\(\s*"([^"]+)"\s*\)',     # t("key")
        '\bt\(\s*`([^`]+)`\s*\)'      # t(`key`)
    )

    foreach ($file in $codeFiles) {
        if ($Debug) {
            $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart('\')
            Write-Host "  Scanning: $relativePath" -ForegroundColor Gray
        }

        try {
            $content = Get-Content -LiteralPath $file.FullName -Raw
            $lines = Get-Content -LiteralPath $file.FullName

            foreach ($pattern in $patterns) {
                $regexMatches = [regex]::Matches($content, $pattern, [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

                foreach ($match in $regexMatches) {
                    $key = $match.Groups[1].Value

                    # Find line number
                    $lineNumber = 1
                    $position = $match.Index
                    $textBeforeMatch = $content.Substring(0, $position)
                    $lineNumber = ($textBeforeMatch -split "`n").Count

                    $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart('\')

                    if (-not $codeUsages.ContainsKey($key)) {
                        $codeUsages[$key] = @()
                    }

                    $codeUsages[$key] += @{
                        File = $relativePath
                        Line = $lineNumber
                        Context = $lines[$lineNumber - 1].Trim()
                    }

                    if ($Debug) {
                        Write-Host "    Found usage: '$key' at line $lineNumber" -ForegroundColor Green
                    }
                }
            }
        }
        catch {
            Write-Warning "Error scanning file '$($file.FullName)': $($_.Exception.Message)"
        }
    }

    $totalUsages = ($codeUsages.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum
    Write-Host "Found $totalUsages dictionary usages across $($codeUsages.Count) unique keys`n"
    return $codeUsages
}

# Function to analyze and report findings
function Invoke-DictionaryAnalysis {
    param(
        [hashtable]$DictionaryItems,
        [hashtable]$CodeUsages
    )

    Write-Host "DICTIONARY USAGE ANALYSIS" -ForegroundColor Cyan
    Write-Host "========================`n"

    # Find unused dictionary items (in dictionary but not in code)
    $unusedItems = @()
    foreach ($key in $DictionaryItems.Keys) {
        if (-not $CodeUsages.ContainsKey($key)) {
            $unusedItems += [PSCustomObject]@{
                Key = $key
                FilePath = $DictionaryItems[$key].FilePath
            }
        }
    }

    # Find missing dictionary items (in code but not in dictionary)
    $missingItems = @()
    foreach ($key in $CodeUsages.Keys) {
        if (-not $DictionaryItems.ContainsKey($key)) {
            $usageInfo = $CodeUsages[$key] | ForEach-Object { "$($_.File):$($_.Line)" }
            $missingItems += [PSCustomObject]@{
                Key = $key
                UsageCount = $CodeUsages[$key].Count
                Usages = $usageInfo -join ", "
            }
        }
    }

    # Summary
    Write-Host "SUMMARY:" -ForegroundColor Yellow
    Write-Host "  Total dictionary items: $($DictionaryItems.Count)"
    Write-Host "  Used dictionary items: $(($DictionaryItems.Keys | Where-Object { $CodeUsages.ContainsKey($_) }).Count)"
    Write-Host "  Unused dictionary items: $($unusedItems.Count)"
    Write-Host "  Missing dictionary items: $($missingItems.Count)"
    Write-Host "  Total code usages: $(($CodeUsages.Values | ForEach-Object { $_.Count } | Measure-Object -Sum).Sum)`n"

    # Report unused items
    if ($unusedItems.Count -gt 0) {
        Write-Host "UNUSED DICTIONARY ITEMS ($($unusedItems.Count)):" -ForegroundColor Red
        Write-Host "These dictionary items exist but are not used in the code:`n"

        $unusedItems | Sort-Object Key | ForEach-Object {
            Write-Host "  '$($_.Key)'" -ForegroundColor Red
            Write-Host "    File: $($_.FilePath)" -ForegroundColor Gray
            Write-Host ""
        }
    } else {
        Write-Host "UNUSED DICTIONARY ITEMS: None found! All dictionary items are being used." -ForegroundColor Green
        Write-Host ""
    }

    # Report missing items
    if ($missingItems.Count -gt 0) {
        Write-Host "MISSING DICTIONARY ITEMS ($($missingItems.Count)):" -ForegroundColor Red
        Write-Host "These keys are used in code but don't exist as dictionary items:`n"

        $missingItems | Sort-Object Key | ForEach-Object {
            Write-Host "  '$($_.Key)' ($($_.UsageCount) usage$(if($_.UsageCount -ne 1){'s'}))" -ForegroundColor Red

            # Show individual usages
            foreach ($usage in $CodeUsages[$_.Key]) {
                Write-Host "    $($usage.File):$($usage.Line)" -ForegroundColor Gray
                Write-Host "      $($usage.Context)" -ForegroundColor DarkGray
            }
            Write-Host ""
        }
    } else {
        Write-Host "MISSING DICTIONARY ITEMS: None found! All code references have corresponding dictionary items." -ForegroundColor Green
        Write-Host ""
    }

    # Show usage statistics for used items (optional detailed view)
    if ($Debug) {
        $usedItems = $DictionaryItems.Keys | Where-Object { $CodeUsages.ContainsKey($_) }
        if ($usedItems.Count -gt 0) {
            Write-Host "USED DICTIONARY ITEMS ($($usedItems.Count)):" -ForegroundColor Green

            $usedItems | Sort-Object | ForEach-Object {
                $key = $_
                $usageCount = $CodeUsages[$key].Count
                Write-Host "  '$key' ($usageCount usage$(if($usageCount -ne 1){'s'}))" -ForegroundColor Green

                foreach ($usage in $CodeUsages[$key]) {
                    Write-Host "    $($usage.File):$($usage.Line)" -ForegroundColor Gray
                }
                Write-Host ""
            }
        }
    }
}

# Main script execution
Write-Host "DICTIONARY USAGE ANALYZER" -ForegroundColor Magenta
Write-Host "=========================`n"

Write-Host "Dictionary Path: $DictionaryPath"
Write-Host "Code Path: $CodePath`n"

# Extract dictionary keys
$dictionaryItems = Get-DictionaryKeys -DictionaryPath $DictionaryPath

if ($dictionaryItems.Count -eq 0) {
    Write-Error "No dictionary items found. Please check the dictionary path."
    exit 1
}

# Find code usages
$codeUsages = Get-CodeUsages -CodePath $CodePath

# Perform analysis and generate report
Invoke-DictionaryAnalysis -DictionaryItems $dictionaryItems -CodeUsages $codeUsages

Write-Host "Analysis complete!" -ForegroundColor Magenta