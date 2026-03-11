# Validate Dictionary Items Script
# This script checks if dictionary items' "Key" values match their English "Phrase" values.
# It also checks if all the dictionary items have a version in all languages.

param(
    [string]$DictionaryPath = "..\authoring\items\demo\`$Sites\`$main\`$Content\main\Dictionary",
    [switch]$Debug
)

# Supported languages to check for versions
$SupportedLanguages = @('en', 'fr-CA')

# Function to parse YAML and extract Key and Phrase values
function Get-DictionaryValues {
    param([string]$FilePath)

    try {
        $content = Get-Content -Path $FilePath -Raw
        $lines = $content -split "`n"

        $key = $null
        $phrase = $null
        $inSharedFields = $false
        $inLanguages = $false
        $inEnglishLanguage = $false
        $inEnglishFields = $false

        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i].TrimEnd()

            # Check for SharedFields section
            if ($line -eq "SharedFields:") {
                $inSharedFields = $true
                continue
            }

            # Check for Languages section
            if ($line -eq "Languages:") {
                $inSharedFields = $false
                $inLanguages = $true
                continue
            }

            # If we're in SharedFields, look for Key
            if ($inSharedFields) {
                if ($line -match '^\s*- ID: "580c75a8-c01a-4580-83cb-987776ceb3af"') {
                    # Next line should be Hint: Key, then Value: [key value]
                    if ($i + 2 -lt $lines.Count) {
                        $valueLine = $lines[$i + 2].TrimEnd()
                        if ($valueLine -match '^\s*Value:\s*(.+)$') {
                            $key = $matches[1].Trim()
                        }
                    }
                }
            }

            # If we're in Languages, look for English language
            if ($inLanguages) {
                if ($line -match '^\s*- Language: en\s*$') {
                    $inEnglishLanguage = $true
                    continue
                }

                # Check if we've moved to another language or section
                if ($line -match '^\s*- Language: ' -and $line -notmatch 'Language: en\s*$') {
                    $inEnglishLanguage = $false
                    $inEnglishFields = $false
                }

                # Look for Fields section within English language
                if ($inEnglishLanguage -and $line -match '^\s*Fields:\s*$') {
                    $inEnglishFields = $true
                    continue
                }

                # If we're in English Fields, look for Phrase
                if ($inEnglishFields) {
                    if ($line -match '^\s*- ID: "2ba3454a-9a9c-4cdf-a9f8-107fd484eb6e"') {
                        # Next line should be Hint: Phrase, then Value: [phrase value]
                        if ($i + 2 -lt $lines.Count) {
                            $valueLine = $lines[$i + 2].TrimEnd()
                            if ($valueLine -match '^\s*Value:\s*(.+)$') {
                                $phrase = $matches[1].Trim()
                            }
                        }
                    }
                }
            }
        }

        return @{
            Key = $key
            Phrase = $phrase
        }
    }
    catch {
        Write-Warning "Error parsing file '$FilePath': $($_.Exception.Message)"
        return @{
            Key = $null
            Phrase = $null
        }
    }
}

# Function to check if item has versions in all supported languages
function Test-LanguageVersions {
    param([string]$FilePath)

    try {
        $content = Get-Content -Path $FilePath -Raw
        $lines = $content -split "`n"

        $foundLanguages = @()
        $inLanguages = $false
        $currentLanguage = $null
        $inVersions = $false

        for ($i = 0; $i -lt $lines.Count; $i++) {
            $line = $lines[$i].TrimEnd()

            # Check for Languages section
            if ($line -eq "Languages:") {
                $inLanguages = $true
                continue
            }

            # If we're in Languages section, look for language entries
            if ($inLanguages) {
                # Check for language entry
                if ($line -match '^\s*- Language:\s*"?(.+)"?$') {
                    $currentLanguage = $matches[1].Trim('"')
                    $inVersions = $false
                    continue
                }

                # Check for Versions section within current language
                if ($currentLanguage -and $line -match '^\s*Versions:\s*$') {
                    $inVersions = $true
                    continue
                }

                # Check for version entry
                if ($currentLanguage -and $inVersions -and $line -match '^\s*- Version:\s*\d+') {
                    if ($SupportedLanguages -contains $currentLanguage) {
                        $foundLanguages += $currentLanguage
                    }
                    $currentLanguage = $null
                    $inVersions = $false
                    continue
                }

                # If we encounter another language entry, reset current language
                if ($line -match '^\s*- Language:\s*(.+)$') {
                    $currentLanguage = $matches[1].Trim('"')
                    $inVersions = $false
                    continue
                }
            }
        }

        # Check if all supported languages are found
        $missingLanguages = $SupportedLanguages | Where-Object { $_ -notin $foundLanguages }
        
        return @{
            HasAllLanguages = ($missingLanguages.Count -eq 0)
            FoundLanguages = $foundLanguages
            MissingLanguages = $missingLanguages
        }
    }
    catch {
        Write-Warning "Error checking language versions in file '$FilePath': $($_.Exception.Message)"
        return @{
            HasAllLanguages = $false
            FoundLanguages = @()
            MissingLanguages = $SupportedLanguages
        }
    }
}

# Main script execution
Write-Host "Validating dictionary items in: $DictionaryPath" -ForegroundColor Cyan
Write-Host "Checking for versions in languages: $($SupportedLanguages -join ', ')" -ForegroundColor Cyan

if (-not (Test-Path $DictionaryPath)) {
    Write-Error "Dictionary path not found: $DictionaryPath"
    exit 1
}

$mismatches = @()
$languageIssues = @()
$totalItems = 0
$validItems = 0

# Get all dictionary item files (exclude the main A.yml to Z.yml folder files)
$dictionaryFiles = Get-ChildItem -Path $DictionaryPath -Recurse -Filter "*.yml" |
    Where-Object { $_.Directory.Name -match '^[A-Z]$' -and $_.Name -ne "$($_.Directory.Name).yml" }

Write-Host "Found $($dictionaryFiles.Count) dictionary item files to validate`n"

foreach ($file in $dictionaryFiles) {
    $totalItems++
    $relativePath = $file.FullName.Replace((Get-Location).Path, "").TrimStart('\')
    $hasIssues = $false

    if ($Debug) {
        Write-Host "Checking: $relativePath" -ForegroundColor Gray
    }

    # Check Key and Phrase values
    $values = Get-DictionaryValues -FilePath $file.FullName

    if ($null -eq $values.Key -or $null -eq $values.Phrase) {
        $mismatches += [PSCustomObject]@{
            File = $relativePath
            Key = $values.Key
            Phrase = $values.Phrase
            Issue = "Missing Key or Phrase value"
        }
        $hasIssues = $true
        if ($Debug) {
            Write-Host "  Missing Key or Phrase value" -ForegroundColor Red
        }
    }
    elseif ($values.Key -ne $values.Phrase) {
        $mismatches += [PSCustomObject]@{
            File = $relativePath
            Key = $values.Key
            Phrase = $values.Phrase
            Issue = "Key and Phrase do not match"
        }
        $hasIssues = $true
        if ($Debug) {
            Write-Host "  Mismatch - Key: '$($values.Key)' | Phrase: '$($values.Phrase)'" -ForegroundColor Red
        }
    }

    # Check language versions
    $languageCheck = Test-LanguageVersions -FilePath $file.FullName
    
    if (-not $languageCheck.HasAllLanguages) {
        $languageIssues += [PSCustomObject]@{
            File = $relativePath
            FoundLanguages = ($languageCheck.FoundLanguages -join ', ')
            MissingLanguages = ($languageCheck.MissingLanguages -join ', ')
            Issue = "Missing versions in required languages"
        }
        $hasIssues = $true
        if ($Debug) {
            Write-Host "  Missing versions in languages: $($languageCheck.MissingLanguages -join ', ')" -ForegroundColor Red
        }
    }

    if (-not $hasIssues) {
        $validItems++
        if ($Debug) {
            Write-Host "  Valid - '$($values.Key)' with versions in all languages" -ForegroundColor Green
        }
    }
}

# Summary
Write-Host "`nVALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "Total items checked: $totalItems"
Write-Host "Valid items: $validItems" -ForegroundColor Green
Write-Host "Items with Key/Phrase issues: $($mismatches.Count)" -ForegroundColor $(if ($mismatches.Count -eq 0) { "Green" } else { "Red" })
Write-Host "Items with language version issues: $($languageIssues.Count)" -ForegroundColor $(if ($languageIssues.Count -eq 0) { "Green" } else { "Red" })

$totalIssues = $mismatches.Count + $languageIssues.Count
Write-Host "Total items with issues: $totalIssues" -ForegroundColor $(if ($totalIssues -eq 0) { "Green" } else { "Red" })

if ($mismatches.Count -gt 0) {
    Write-Host "`nITEMS WITH KEY/PHRASE ISSUES:" -ForegroundColor Red
    $mismatches | Format-Table -Property File, Key, Phrase, Issue -Wrap -AutoSize
}

if ($languageIssues.Count -gt 0) {
    Write-Host "`nITEMS WITH LANGUAGE VERSION ISSUES:" -ForegroundColor Red
    $languageIssues | Format-Table -Property File, FoundLanguages, MissingLanguages, Issue -Wrap -AutoSize
}

if ($totalIssues -eq 0) {
    Write-Host "`nAll dictionary items are valid! Key and Phrase values match, and all items have versions in required languages." -ForegroundColor Green
}