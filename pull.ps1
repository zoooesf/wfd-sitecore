#!/usr/bin/env pwsh

# Sitecore Serialization Pull Script
# Interactive script to pull serialized items from the dev environment

Write-Host "=== Tidal Serialization Pull Script ===" -ForegroundColor Cyan
Write-Host ""

# Formats JSON in a nicer format than the built-in ConvertTo-Json does.
function Format-Json([Parameter(Mandatory, ValueFromPipeline)][String] $json) {
    $indent = 0;
    ($json -Split "`n" | ForEach-Object {
        if ($_ -match '[\}\]]\s*,?\s*$') {
            # This line ends with ] or }, decrement the indentation level
            $indent--
        }
        $line = ('  ' * $indent) + $($_.TrimStart() -replace '":  (["{[])', '": $1' -replace ':  ', ': ')
        if ($_ -match '[\{\[]\s*$') {
            # This line ends with [ or {, increment the indentation level
            $indent++
        }
        $line
    }) -Join "`n"
}

function Test-Authentication {
    param($CommandOutput)
    return ($CommandOutput -like "*Command could not processed due to an unauthenticated state.*" -or
            $CommandOutput -like "*Your refresh token was corrupted or expired. Please re-login to your environment.*")
}

function Invoke-Login {
    Write-Host "Authentication required. Running login command..." -ForegroundColor Yellow
    $process = Start-Process -FilePath "dotnet" -ArgumentList "sitecore cloud login" -NoNewWindow -Wait -PassThru
    if ($process.ExitCode -ne 0) {
        Write-Host "Login failed. Please check your credentials and try again." -ForegroundColor Red
        exit 1
    }
    Write-Host "Login successful!" -ForegroundColor Green
}

function Test-DevEnvironment {
    Write-Host "Checking dev environment configuration..." -ForegroundColor Yellow

    do {
        $envInfo = dotnet sitecore env info -n dev 2>&1
        $envInfoString = $envInfo -join "`n"

        if (Test-Authentication $envInfoString) {
            Invoke-Login

            # Retry the command after login
            Write-Host "Retrying the command..." -ForegroundColor Yellow
            continue
        }
        break
    } while ($true)

    if ($envInfoString -like "*Environment dev was not defined. Use the login command to define it.*") {
        Write-Host "Dev environment is not configured!" -ForegroundColor Red
        return $false
    }

    Write-Host "Dev environment is properly configured!" -ForegroundColor Green
    return $true
}

function Connect-DevEnvironment {
    Write-Host "You need to connect to the dev environment first." -ForegroundColor Yellow
    Write-Host "Please provide your dev environment ID from XM Cloud Deploy App or Tidal Notion page:" -ForegroundColor Yellow
    $envId = Read-Host "Environment ID"

    if (-not $envId) {
        Write-Host "No environment ID provided. Exiting..." -ForegroundColor Red
        exit 1
    }

    Write-Host "Connecting to dev environment..." -ForegroundColor Yellow

    do {
        $connectResult = dotnet sitecore cloud environment connect -id $envId 2>&1
        $connectResultString = $connectResult -join "`n"

        if (Test-Authentication $connectResultString) {
            Invoke-Login

            # Retry the command after login
            Write-Host "Retrying the command..." -ForegroundColor Yellow
            continue
        }
        break
    } while ($true)

    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to connect to dev environment. Please check the ID and try again." -ForegroundColor Red
        exit 1
    }
    Write-Host "Successfully connected to dev environment!" -ForegroundColor Green
}

function Set-WritePermissions {
    Write-Host "Checking write permissions configuration..." -ForegroundColor Yellow

    $userJsonPath = ".sitecore\user.json"
    if (-not (Test-Path $userJsonPath)) {
        Write-Host "user.json file not found at $userJsonPath" -ForegroundColor Red
        exit 1
    }

    $userConfig = Get-Content $userJsonPath -Raw | ConvertFrom-Json
    if (-not $userConfig.endpoints.dev.allowWrite) {
        Write-Host "Write permissions are not enabled for dev environment. Enabling..." -ForegroundColor Yellow
        $userConfig.endpoints.dev.allowWrite = $true

        # Convert back to JSON with proper formatting
        $jsonContent = $userConfig | ConvertTo-Json -Depth 10 | Format-Json
        Set-Content -Path $userJsonPath -Value $jsonContent

        Write-Host "Write permissions have been enabled for dev environment." -ForegroundColor Green
    } else {
        Write-Host "Write permissions are already enabled for dev environment." -ForegroundColor Green
    }
}

function Get-ModuleNamespaces {
    $moduleFiles = Get-ChildItem -Path "authoring\items" -Filter "*.module.json" -Recurse
    $namespaces = @()

    foreach ($file in $moduleFiles) {
        try {
            $content = Get-Content $file.FullName -Raw | ConvertFrom-Json
            if ($content.namespace) {
                $namespaces += $content.namespace
            }
        }
        catch {
            Write-Warning "Failed to parse $($file.FullName): $($_.Exception.Message)"
        }
    }

    return $namespaces | Sort-Object
}

function New-NamespaceTree {
    param($Namespaces)

    $tree = @{}

    # First build the complete tree
    foreach ($namespace in $Namespaces) {
        $parts = $namespace.Split('-')
        $current = $tree

        for ($i = 0; $i -lt $parts.Length; $i++) {
            $part = $parts[$i]

            if (-not $current.ContainsKey($part)) {
                $current[$part] = @{
                    "children" = @{}
                    "fullPath" = ($parts[0..$i] -join '-')
                    "isLeaf" = ($i -eq ($parts.Length - 1))
                }
            }
            else {
                # Update isLeaf status - if we're at the last part, it's a leaf
                if ($i -eq ($parts.Length - 1)) {
                    $current[$part]["isLeaf"] = $true
                }
            }

            $current = $current[$part]["children"]
        }
    }

    # Then merge nodes that have single children
    function Merge-SingleChildNodes {
        param($node)

        # Create a copy of the keys to avoid modification during enumeration
        $keys = @($node.Keys)

        foreach ($key in $keys) {
            $child = $node[$key]

            # If this node has exactly one child and is not a leaf
            if ($child.children.Count -eq 1 -and -not $child.isLeaf) {
                $childKey = $child.children.Keys[0]
                $grandChild = $child.children[$childKey]

                # Create new merged key
                $mergedKey = "$key-$childKey"

                # Create new merged node
                $node[$mergedKey] = @{
                    "children" = $grandChild.children
                    "fullPath" = $grandChild.fullPath
                    "isLeaf" = $grandChild.isLeaf
                }

                # Remove the original node
                $node.Remove($key)

                # Process the merged node's children first
                Merge-SingleChildNodes -node $node[$mergedKey].children

                # Check if we need to merge again with the merged node
                if ($node[$mergedKey].children.Count -eq 1 -and -not $node[$mergedKey].isLeaf) {
                    $nextChildKey = $node[$mergedKey].children.Keys[0]
                    $nextChild = $node[$mergedKey].children[$nextChildKey]

                    # Create new merged key
                    $nextMergedKey = "$mergedKey-$nextChildKey"

                    # Create new merged node
                    $node[$nextMergedKey] = @{
                        "children" = $nextChild.children
                        "fullPath" = $nextChild.fullPath
                        "isLeaf" = $nextChild.isLeaf
                    }

                    # Remove the intermediate node
                    $node.Remove($mergedKey)
                }
            }
            else {
                # Recursively process this node's children
                Merge-SingleChildNodes -node $child.children
            }
        }
    }

    # Start merging from the root
    Merge-SingleChildNodes -node $tree

    return $tree
}

function Show-MenuLevel {
    param(
        $Tree,
        $CurrentPath = @(),
        $Level = 0
    )

    $isRootLevel = $CurrentPath.Length -eq 0
    $pathDescription = if ($isRootLevel) { "root" } else { ($CurrentPath -join ' > ') }

    Write-Host ""
    Write-Host "Selection at $pathDescription level:" -ForegroundColor Cyan
    Write-Host "0. All" -ForegroundColor White

    $options = @()
    $counter = 1

    $sortedKeys = $Tree.Keys | Sort-Object
    foreach ($key in $sortedKeys) {
        $options += @{
            "key" = $key
            "data" = $Tree[$key]
        }
        Write-Host "$counter. $key" -ForegroundColor White
        $counter++
    }

    Write-Host ""

    do {
        $choice = Read-Host "Please enter your choice (0 for All, or 1-$($options.Count))"

        if ($choice -eq "0") {
            # All option selected
            if ($isRootLevel) {
                Write-Host "Selected: All items" -ForegroundColor Green
                return ""  # No filter, just the base command
            }
            else {
                $filter = ($CurrentPath -join '-') + "-*"
                Write-Host "Selected: All items under $($CurrentPath -join '-')" -ForegroundColor Green
                return " -i $filter"
            }
        }
        elseif ($choice -match '^\d+$' -and [int]$choice -ge 1 -and [int]$choice -le $options.Count) {
            $selectedIndex = [int]$choice - 1
            $selectedOption = $options[$selectedIndex]
            $newPath = $CurrentPath + $selectedOption.key

            # Check if this is a leaf node or if it has children
            if ($selectedOption.data.children.Count -eq 0 -or $selectedOption.data.isLeaf) {
                # This is a leaf node - use exact namespace
                $filter = $newPath -join '-'
                Write-Host "Selected: Exact namespace $filter" -ForegroundColor Green
                return " -i $filter"
            }
            else {
                # This has children - continue to next level
                return Show-MenuLevel -Tree $selectedOption.data.children -CurrentPath $newPath -Level ($Level + 1)
            }
        }
        else {
            Write-Host "Invalid choice. Please enter a number between 0 and $($options.Count)." -ForegroundColor Red
        }
    } while ($true)
}

function Get-UserChoice {
    Write-Host ""
    Write-Host "Loading serialization modules..." -ForegroundColor Yellow

    $namespaces = Get-ModuleNamespaces

    if ($namespaces.Count -eq 0) {
        Write-Host "No module namespaces found in authoring\items folder!" -ForegroundColor Red
        exit 1
    }

    $tree = New-NamespaceTree -Namespaces $namespaces

    Write-Host ""
    Write-Host "Which items would you like to pull?" -ForegroundColor Cyan

    return Show-MenuLevel -Tree $tree
}

function Confirm-Execution {
    param($Command)

    Write-Host ""
    Write-Host "Command to be executed:" -ForegroundColor Cyan
    Write-Host "  $Command" -ForegroundColor White
    Write-Host ""

    do {
        $confirmation = Read-Host "Do you want to proceed? (y/n)"
        switch ($confirmation.ToLower()) {
            "y" { return $true }
            "yes" { return $true }
            "n" { return $false }
            "no" { return $false }
            default {
                Write-Host "Please enter 'y' for yes or 'n' for no." -ForegroundColor Red
            }
        }
    } while ($true)
}

function Invoke-PullCommand {
    param($Command)

    Write-Host ""
    Write-Host "Executing command..." -ForegroundColor Yellow
    Write-Host "Command: $Command" -ForegroundColor Gray
    Write-Host ""

    do {
        $output = & cmd /c "$Command 2>&1"
        $outputString = $output -join "`n"

        # Check for authentication issues
        if (Test-Authentication $outputString) {
            Invoke-Login

            # Retry the command after login
            Write-Host "Retrying the command..." -ForegroundColor Yellow
            continue
        }

        break
    } while ($true)

    # Display the output
    Write-Host $outputString

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "Pull completed successfully!" -ForegroundColor Green
    } else {
        Write-Host ""
        Write-Host "Pull failed with exit code: $LASTEXITCODE" -ForegroundColor Red
        exit $LASTEXITCODE
    }
}

# Main script execution
try {
    # Step 1: Check dev environment configuration
    if (-not (Test-DevEnvironment)) {
        Connect-DevEnvironment
    }
    Set-WritePermissions

    # Step 2: Get user choice for items to pull
    $itemsFilter = Get-UserChoice

    # Step 3: Build the final command
    $baseCommand = "dotnet sitecore ser pull -n dev"
    $fullCommand = $baseCommand + $itemsFilter

    # Step 4: Confirm execution
    if (Confirm-Execution $fullCommand) {
        # Step 5: Execute the command
        Invoke-PullCommand $fullCommand
    } else {
        Write-Host ""
        Write-Host "Operation cancelled by user." -ForegroundColor Yellow
        exit 0
    }
}
catch {
    Write-Host ""
    Write-Host "An error occurred: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Script completed." -ForegroundColor Cyan