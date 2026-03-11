<#
.SYNOPSIS
    Renames the Sitecore site from "main" to a new name across all serialized items and configuration files.

.DESCRIPTION
    This script updates all references to the site name in:
    - SCS module JSON files (namespace, paths, include names)
    - Folder names
    - YML file names
    - YML file contents (Path fields, Name fields, SiteName fields)

    After running this script, commit the changes to apply them in Sitecore.
    The YML files will be packaged in the IAR file and deployed to Sitecore.

.PARAMETER NewSiteName
    The new name for the site. Must follow Sitecore naming conventions:
    - Alphanumeric characters only (A-Z, a-z, 0-9)
    - Hyphens (-) and underscores (_) are allowed
    - Cannot start with a number
    - Cannot contain spaces or special characters

.PARAMETER WhatIf
    Shows what changes would be made without actually making them.

.EXAMPLE
    .\Rename-Site.ps1 -NewSiteName "ClientSite"

.EXAMPLE
    .\Rename-Site.ps1 -NewSiteName "ClientSite" -WhatIf
#>

[CmdletBinding(SupportsShouldProcess)]
param(
    [Parameter(Mandatory = $false)]
    [string]$NewSiteName
)

# Configuration
$OldSiteName = "main"
$ScriptRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot = Split-Path -Parent $ScriptRoot
$AuthoringPath = Join-Path $RepoRoot "authoring"
$ItemsPath = Join-Path $AuthoringPath "items\demo"
$SitesPath = Join-Path $ItemsPath "`$Sites"

# Colors for output
function Write-Log {
    param(
        [string]$Message,
        [string]$Type = "Info"
    )

    switch ($Type) {
        "Success" { Write-Host "[OK] $Message" -ForegroundColor Green }
        "Warning" { Write-Host "[WARN] $Message" -ForegroundColor Yellow }
        "Error" { Write-Host "[ERROR] $Message" -ForegroundColor Red }
        "Info" { Write-Host "[INFO] $Message" -ForegroundColor Cyan }
        "Action" { Write-Host "[ACTION] $Message" -ForegroundColor Magenta }
        default { Write-Host $Message }
    }
}

function Test-SitecoreName {
    param([string]$Name)

    $errors = @()

    # Check if empty
    if ([string]::IsNullOrWhiteSpace($Name)) {
        $errors += "Name cannot be empty"
        return $errors
    }

    # Check length (Sitecore recommends max 100 chars for item names)
    if ($Name.Length -gt 100) {
        $errors += "Name cannot exceed 100 characters"
    }

    # Check for invalid characters (only alphanumeric, hyphen, underscore allowed)
    if ($Name -notmatch '^[a-zA-Z][a-zA-Z0-9_-]*$') {
        if ($Name -match '^[0-9]') {
            $errors += "Name cannot start with a number"
        }
        if ($Name -match '[^a-zA-Z0-9_-]') {
            $errors += "Name can only contain letters, numbers, hyphens (-), and underscores (_)"
        }
        if ($Name -match '^[_-]') {
            $errors += "Name must start with a letter"
        }
    }

    # Check for reserved names
    $reservedNames = @("CON", "PRN", "AUX", "NUL", "COM1", "COM2", "COM3", "COM4", "COM5", 
        "COM6", "COM7", "COM8", "COM9", "LPT1", "LPT2", "LPT3", "LPT4", 
        "LPT5", "LPT6", "LPT7", "LPT8", "LPT9")
    if ($reservedNames -contains $Name.ToUpper()) {
        $errors += "'$Name' is a reserved system name"
    }

    return $errors
}

function Rename-FolderSafely {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [string]$OldPath,
        [string]$NewPath
    )

    if (Test-Path $OldPath) {
        if ($PSCmdlet.ShouldProcess($OldPath, "Rename to $NewPath")) {
            Rename-Item -Path $OldPath -NewName (Split-Path $NewPath -Leaf)
            Write-Log "Renamed folder: $(Split-Path $OldPath -Leaf) -> $(Split-Path $NewPath -Leaf)" "Success"
        }
        else {
            Write-Log "Would rename folder: $(Split-Path $OldPath -Leaf) -> $(Split-Path $NewPath -Leaf)" "Action"
        }
        return $true
    }
    else {
        Write-Log "Folder not found: $OldPath" "Warning"
        return $false
    }
}

function Rename-FileSafely {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [string]$OldPath,
        [string]$NewName
    )

    if (Test-Path $OldPath) {
        if ($PSCmdlet.ShouldProcess($OldPath, "Rename to $NewName")) {
            Rename-Item -Path $OldPath -NewName $NewName
            Write-Log "Renamed file: $(Split-Path $OldPath -Leaf) -> $NewName" "Success"
        }
        else {
            Write-Log "Would rename file: $(Split-Path $OldPath -Leaf) -> $NewName" "Action"
        }
        return $true
    }
    else {
        Write-Log "File not found: $OldPath" "Warning"
        return $false
    }
}

# ============================================================================
# MAIN SCRIPT
# ============================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sitecore Site Rename Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Prompt for site name if not provided
if ([string]::IsNullOrWhiteSpace($NewSiteName)) {
    Write-Host "This script will rename the site from '$OldSiteName' to a new name." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Sitecore Naming Rules:" -ForegroundColor Cyan
    Write-Host "  - Must start with a letter"
    Write-Host "  - Can contain letters, numbers, hyphens (-), and underscores (_)"
    Write-Host "  - No spaces or special characters"
    Write-Host "  - Maximum 100 characters"
    Write-Host ""

    $NewSiteName = Read-Host "Enter the new site name"
}

# Validate the name
Write-Host ""
Write-Log "Validating site name: '$NewSiteName'" "Info"

$validationErrors = Test-SitecoreName -Name $NewSiteName
if ($validationErrors.Count -gt 0) {
    Write-Log "Invalid site name!" "Error"
    foreach ($err in $validationErrors) {
        Write-Host "  - $err" -ForegroundColor Red
    }
    Write-Host ""
    exit 1
}

Write-Log "Site name is valid" "Success"
Write-Host ""

# Check if it's the same as the old name
if ($NewSiteName -eq $OldSiteName) {
    Write-Log "New site name is the same as the current name. No changes needed." "Warning"
    exit 0
}

# Confirm the change
Write-Host "This will rename the site:" -ForegroundColor Yellow
Write-Host "  From: $OldSiteName" -ForegroundColor Red
Write-Host "  To:   $NewSiteName" -ForegroundColor Green
Write-Host ""

if (-not $WhatIfPreference) {
    $confirm = Read-Host "Do you want to proceed? (Y/N)"
    if ($confirm -notmatch '^[Yy]') {
        Write-Log "Operation cancelled by user" "Warning"
        exit 0
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Starting Rename Process" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ============================================================================
# STEP 1: Update Module JSON File
# ============================================================================

Write-Log "STEP 1: Updating module JSON file..." "Info"

$oldModuleFile = Join-Path $ItemsPath "demo.site.$OldSiteName.module.json"

if (Test-Path $oldModuleFile) {
    # Read and update the content
    $moduleContent = Get-Content $oldModuleFile -Raw

    # Update namespace
    $moduleContent = $moduleContent -replace "demo-sites-$OldSiteName", "demo-sites-$NewSiteName"

    # Update include names (e.g., $Sites/$main/$Content -> $Sites/$NewSiteName/$Content)
    $moduleContent = $moduleContent -replace "\`$Sites/\`$$OldSiteName/", "`$Sites/`$$NewSiteName/"

    # Update Sitecore paths
    $moduleContent = $moduleContent -replace "/sitecore/content/Sites/$OldSiteName", "/sitecore/content/Sites/$NewSiteName"
    $moduleContent = $moduleContent -replace "/sitecore/media library/Project/Sites/$OldSiteName", "/sitecore/media library/Project/Sites/$NewSiteName"

    if ($PSCmdlet.ShouldProcess($oldModuleFile, "Update and rename module JSON")) {
        # Write updated content
        Set-Content -Path $oldModuleFile -Value $moduleContent -NoNewline

        # Rename the file
        Rename-Item -Path $oldModuleFile -NewName "demo.site.$NewSiteName.module.json"
        Write-Log "Updated and renamed module JSON file" "Success"
    }
    else {
        Write-Log "Would update and rename module JSON: demo.site.$OldSiteName.module.json -> demo.site.$NewSiteName.module.json" "Action"
    }
}
else {
    Write-Log "Module JSON file not found: $oldModuleFile" "Error"
    exit 1
}

# ============================================================================
# STEP 2: Rename Folder Structure
# ============================================================================

Write-Host ""
Write-Log "STEP 2: Renaming folder structure..." "Info"

# Define the folder renames in order (parent folders first)
$oldSiteFolder = Join-Path $SitesPath "`$$OldSiteName"
$newSiteFolder = Join-Path $SitesPath "`$$NewSiteName"

# Pre-flight check: Verify source exists and target doesn't
if (-not (Test-Path $oldSiteFolder)) {
    Write-Log "Source folder not found: $oldSiteFolder" "Error"
    Write-Log "The site '$OldSiteName' may have already been renamed or doesn't exist." "Error"
    Write-Host ""
    Write-Host "If you previously ran this script, restore the authoring folder to its original state first." -ForegroundColor Yellow
    exit 1
}

if (Test-Path $newSiteFolder) {
    Write-Log "Target folder already exists: $newSiteFolder" "Error"
    Write-Log "A site named '$NewSiteName' already exists. This could mean:" "Error"
    Write-Host "  - The script was previously run and not fully reverted" -ForegroundColor Yellow
    Write-Host "  - A site with this name already exists" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please restore the authoring folder to its original state or choose a different name." -ForegroundColor Yellow
    exit 1
}

# Rename $main -> $NewSiteName
Rename-FolderSafely -OldPath $oldSiteFolder -NewPath $newSiteFolder

# After renaming, update paths for subsequent operations
# In WhatIf mode, folders aren't actually renamed, so use old paths for checks
if ($WhatIfPreference) {
    $workingSiteFolder = $oldSiteFolder
}
else {
    $workingSiteFolder = $newSiteFolder
}

$contentFolder = Join-Path $workingSiteFolder "`$Content"
$mediaFolder = Join-Path $workingSiteFolder "`$MediaLibrary"

# Rename $Content/main -> $Content/NewSiteName
$oldContentSite = Join-Path $contentFolder $OldSiteName
$newContentSite = Join-Path $contentFolder $NewSiteName
Rename-FolderSafely -OldPath $oldContentSite -NewPath $newContentSite

# Update working path for content site
if ($WhatIfPreference) {
    $workingContentSite = $oldContentSite
}
else {
    $workingContentSite = $newContentSite
}

# Rename $MediaLibrary/main -> $MediaLibrary/NewSiteName
$oldMediaSite = Join-Path $mediaFolder $OldSiteName
$newMediaSite = Join-Path $mediaFolder $NewSiteName
Rename-FolderSafely -OldPath $oldMediaSite -NewPath $newMediaSite

# Update working path for media site
if ($WhatIfPreference) {
    $workingMediaSite = $oldMediaSite
}
else {
    $workingMediaSite = $newMediaSite
}

# Rename Sitemaps/main -> Sitemaps/NewSiteName
$sitemapsFolder = Join-Path $workingMediaSite "Sitemaps"
if (Test-Path $sitemapsFolder) {
    $oldSitemapSite = Join-Path $sitemapsFolder $OldSiteName
    $newSitemapSite = Join-Path $sitemapsFolder $NewSiteName
    Rename-FolderSafely -OldPath $oldSitemapSite -NewPath $newSitemapSite
}

# ============================================================================
# STEP 3: Rename YML Files
# ============================================================================

Write-Host ""
Write-Log "STEP 3: Renaming YML files..." "Info"

# Rename main.yml files to NewSiteName.yml
# Use working paths which account for WhatIf mode
$ymlRenames = @(
    @{ Path = Join-Path $contentFolder "$OldSiteName.yml"; NewName = "$NewSiteName.yml" },
    @{ Path = Join-Path $mediaFolder "$OldSiteName.yml"; NewName = "$NewSiteName.yml" },
    @{ Path = Join-Path $workingContentSite "Settings\Site Grouping\$OldSiteName.yml"; NewName = "$NewSiteName.yml" }
)

# Add sitemap rename only if the folder exists
if (Test-Path $sitemapsFolder) {
    $sitemapYmlPath = Join-Path $sitemapsFolder "$OldSiteName.yml"
    if (Test-Path $sitemapYmlPath) {
        $ymlRenames += @{ Path = $sitemapYmlPath; NewName = "$NewSiteName.yml" }
    }
}

foreach ($rename in $ymlRenames) {
    Rename-FileSafely -OldPath $rename.Path -NewName $rename.NewName
}

# ============================================================================
# STEP 4: Update YML File Contents
# ============================================================================

Write-Host ""
Write-Log "STEP 4: Updating YML file contents..." "Info"

# Get all YML files in the site folder
# Use working path which accounts for WhatIf mode
$ymlFiles = Get-ChildItem -Path $workingSiteFolder -Recurse -Filter "*.yml" -File

$fileCount = 0
$totalFiles = $ymlFiles.Count

foreach ($file in $ymlFiles) {
    $fileCount++
    $content = Get-Content $file.FullName -Raw
    $originalContent = $content

    # Update Sitecore content paths (handles both quoted and unquoted paths)
    # Replace /sitecore/content/Sites/main with /sitecore/content/Sites/renamed
    # Matches: /Sites/main/ (continues), /Sites/main" (quoted end), /Sites/main followed by newline
    $content = $content -replace "/sitecore/content/Sites/$OldSiteName(/|`"|`r?`n)", "/sitecore/content/Sites/$NewSiteName`$1"

    # Update Sitecore media library paths (site root)
    $content = $content -replace "/sitecore/media library/Project/Sites/$OldSiteName(/|`"|`r?`n)", "/sitecore/media library/Project/Sites/$NewSiteName`$1"

    # Update Sitemaps subfolder path (there's a folder named after the site inside Sitemaps)
    $content = $content -replace "/Sitemaps/$OldSiteName(/|`"|`r?`n)", "/Sitemaps/$NewSiteName`$1"

    # Update Site Grouping item path (the item itself is named after the site)
    # This handles paths ending with the site name
    $content = $content -replace "/Site Grouping/$OldSiteName(`"|`r?`n|`$)", "/Site Grouping/$NewSiteName`$1"

    # Update Name field value (only exact matches for the site name in specific contexts)
    # This targets the Name field in site root and Site Grouping items
    # Using flexible whitespace matching to handle different line endings
    $namePattern = "(?m)(Hint: Name\r?\n\s+Value: )$OldSiteName(\r?$)"
    $content = $content -replace $namePattern, "`${1}$NewSiteName`${2}"

    # Update SiteName field value
    $siteNamePattern = "(?m)(Hint: SiteName\r?\n\s+Value: )$OldSiteName(\r?$)"
    $content = $content -replace $siteNamePattern, "`${1}$NewSiteName`${2}"

    # Only write if content changed
    if ($content -ne $originalContent) {
        if ($PSCmdlet.ShouldProcess($file.FullName, "Update YML content")) {
            Set-Content -Path $file.FullName -Value $content -NoNewline
        }
    }

    # Progress indicator (every 50 files)
    if ($fileCount % 50 -eq 0) {
        Write-Host "  Processed $fileCount of $totalFiles files..." -ForegroundColor Gray
    }
}

if ($PSCmdlet.ShouldProcess("YML files", "Update content")) {
    Write-Log "Updated $totalFiles YML files" "Success"
}
else {
    Write-Log "Would update $totalFiles YML files" "Action"
}

# ============================================================================
# COMPLETE
# ============================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  Rename Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

if ($WhatIfPreference) {
    Write-Host "This was a dry run. No changes were made." -ForegroundColor Yellow
    Write-Host "Run without -WhatIf to apply changes." -ForegroundColor Yellow
}
else {
    Write-Host "Site renamed from '$OldSiteName' to '$NewSiteName'" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "  1. Review the changes in your IDE/git" -ForegroundColor White
    Write-Host "  2. Commit the changes" -ForegroundColor White
    Write-Host "     This will package the YML files and deploy them to Sitecore" -ForegroundColor Gray
    Write-Host "  3. Ensure the SitecoreAI deployment is successful." -ForegroundColor White
    Write-Host "  4. Publish the site in Sitecore" -ForegroundColor White
    Write-Host ""
}
