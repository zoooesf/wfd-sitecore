<#
.SYNOPSIS
    Cleans up the TIDAL serialized items to start a new client project.

.DESCRIPTION
    This script removes demo content, cleans up media library items, and trims
    renderings from partial design YML files to transform the project into a
    clean starter template for a new client project.

.PARAMETER WhatIf
    Shows what would be deleted/modified without actually making changes.

.EXAMPLE
    .\Clean-SitecoreProject.ps1
    Runs the cleanup script.

.EXAMPLE
    .\Clean-SitecoreProject.ps1 -WhatIf
    Shows what would be changed without making actual modifications.

.NOTES
    Run this script from the 'project cleanup' folder within the repository.
    The script targets the /authoring folder in the parent directory.
#>

[CmdletBinding(SupportsShouldProcess)]
param()

# ╔════════════════════════════════════════════════════════════════════════════╗
# ║                                                                            ║
# ║                        CONFIGURATION SECTION                               ║
# ║                                                                            ║
# ║  Edit the lists below to customize what gets kept or removed.              ║
# ║  The script logic below should not need modifications.                     ║
# ║                                                                            ║
# ╚════════════════════════════════════════════════════════════════════════════╝

# ============================================================================
# HOME CONTENT - Items to KEEP in the Home folder
# ============================================================================
# These are the pages/folders under /authoring/items/demo/$Sites/$main/$Content/main/Home
# that will NOT be deleted. Everything else in the Home folder will be removed.
# Include both the .yml file AND the folder name for items with children.
$HomeKeepItems = @(
    "_404.yml",      # 404 error page YML file
    "_404",          # 404 error page folder (contains child items)
    "_500.yml",      # 500 error page YML file
    "_500",          # 500 error page folder (contains child items)
    "Data.yml",      # Data page YML file
    "Data",          # Data folder (contains site data items)
    "Search.yml",    # Search page YML file
    "Search"         # Search folder (contains search-related items)
)

# ============================================================================
# COMPONENT SETTINGS - Folders to KEEP
# ============================================================================
# These folders under /Settings/Component Settings will NOT be deleted.
# All .yml files in Component Settings are always kept (only folders are removed).
# Add folder names here to preserve additional component setting categories.
$ComponentSettingsKeepFolders = @(
    "Alert Banner Categories",  # Alert banner category definitions
    "Icons",                    # Icon definitions for the site
    "Social Media"              # Social media link configurations
)

# ============================================================================
# MEDIA LIBRARY - Items to KEEP in the main media folder
# ============================================================================
# These items under /$MediaLibrary/main will NOT be deleted.
# Include both .yml files AND folder names for items you want to preserve.
# Note: System.yml is kept but the System folder is deleted separately.
$MediaLibraryKeepItems = @(
    "Banners.yml",       # Banners folder definition
    "Banners",           # Banner images folder
    "Logos.yml",         # Logos folder definition
    "Logos",             # Logo images folder
    "Placeholders.yml",  # Placeholders folder definition
    "Placeholders",      # Placeholder images folder
    "Sitemaps.yml",      # Sitemaps folder definition
    "Sitemaps",          # Sitemap files folder
    "System.yml"         # System folder definition (folder itself is deleted below)
)

# ============================================================================
# LOGOS - Items to KEEP in the Logos folder
# ============================================================================
# These files under /$MediaLibrary/main/Logos will NOT be deleted.
# All other logo images (TIDAL vertical headers, etc.) will be removed.
$LogosKeepItems = @(
    "Tidal-Main-Black.yml",   # Main TIDAL logo (black version)
    "placeholder-logo.yml"    # Generic placeholder logo for development
)

# ============================================================================
# SITE DATA - Folders to KEEP in the Data folder
# ============================================================================
# These folders under /$Content/main/Data will NOT be deleted.
# All .yml files in the Data folder are always kept (only folders are removed).
# These typically contain component data source items.
$DataKeepFolders = @(
    "Alert Banners",    # Alert banner data items
    "Article Bodies",   # Article body component data
    "Article Footers",  # Article footer component data
    "Article Headers",  # Article header component data
    "Buttons",          # Button component data
    "Event Bodies",     # Event body component data
    "Event Headers",    # Event header component data
    "Footer Legals",    # Footer legal section data
    "Footer Mains",     # Footer main section data
    "Footer Menus",     # Footer menu section data
    "Headers",          # Header component data
    "Tertiary Navs"     # Tertiary navigation data
)

# ============================================================================
# SITE DATA SUBFOLDERS - Items to KEEP within each data folder
# ============================================================================
# These control what gets kept INSIDE each of the data folders above.
# Items not in these lists will be deleted from their respective folders.

# Headers folder - items to keep (everything else deleted)
$HeadersKeepItems = @(
    "Header.yml"  # Base header data item (Header folder is removed)
)

# Tertiary Navs folder - items to keep (everything else deleted)
$TertiaryNavsKeepItems = @(
    "TertiaryNav.yml"  # Base tertiary nav data item (TertiaryNav folder is removed)
)

# Footer Legals folder - items to keep (everything else deleted)
$FooterLegalsKeepItems = @(
    "FooterLegal.yml",  # Base footer legal data item
    "FooterLegal"       # Footer Legal folder with child items
)

# Footer Mains folder - items to keep (everything else deleted)
$FooterMainsKeepItems = @(
    "FooterMain.yml"  # Base footer main data item (FooterMain folder is removed)
)

# Footer Menus folder - items to keep (everything else deleted)
$FooterMenusKeepItems = @(
    "FooterMenu.yml"  # Base footer menu data item (FooterMenu folder is removed)
)

# ============================================================================
# PARTIAL DESIGN RENDERINGS - Number of renderings to KEEP
# ============================================================================
# These YML files are in /Presentation/Partial Designs/Navigation/
# The script will keep only the FIRST N renderings and remove the rest.
# Renderings are the <r /> elements within the __Renderings field.
$RenderingConfig = @{
    "Header.yml"       = 3   # Keep first 3 renderings (logo, nav, search)
    "Home Header.yml"  = 3   # Keep first 3 renderings (same as Header)
    "Footer.yml"       = 8   # Keep first 8 renderings (core footer elements)
    "Error Header.yml" = 2   # Keep first 2 renderings (minimal error page header)
}

# ============================================================================
# SETTINGS.YML FIELD CLEANUP - Field IDs to clear
# ============================================================================
# These field IDs in Settings.yml will have their values cleared.
# The fields remain but their <link .../> values are removed.
# Format: @{ "FieldID" = "FieldHint (for logging)" }
$SettingsFieldsToClear = @{
    "7e7eab6a-3e30-4651-97b0-eb948a121a4b" = "accountPageLink"  # Link to account page
    "c27afd30-49bb-4390-a230-7205eb60d826" = "peoplePage"       # Link to people/team page
}

# ============================================================================
# _DEMO TEMPLATE CLEANUP - Remove demo navigation template and its inheritance
# ============================================================================
# This removes the _Demo template and cleans up inheritance references to it.
# The _Demo template ID will be removed from the __Base template field in
# the templates listed below.

# The ID of the _Demo template to remove from inheritance
$DemoTemplateId = "5908F5EB-7EE7-4AE4-9898-4563F1640B12"

# Template YML files that inherit from _Demo (relative to authoring/items/common)
# The script will remove the _Demo ID from the __Base template Value field
$TemplatesWithDemoInheritance = @(
    "`$Components/`$Footer/`$FooterMain/`$Templates/FooterMain/FooterMain.yml",
    "`$Components/`$Footer/`$FooterMenu/`$Templates/FooterMenu/FooterMenu.yml",
    "`$Components/`$Navigation/`$Header/`$Templates/Header/Header.yml",
    "`$Components/`$Navigation/`$TertiaryNav/`$Templates/TertiaryNav/TertiaryNav.yml"
)

# ╔════════════════════════════════════════════════════════════════════════════╗
# ║                                                                            ║
# ║                         SCRIPT LOGIC BELOW                                 ║
# ║                                                                            ║
# ║  The code below executes the cleanup based on the configuration above.     ║
# ║  You should not need to modify anything below this line.                   ║
# ║                                                                            ║
# ╚════════════════════════════════════════════════════════════════════════════╝

# ============================================================================
# Path Configuration (derived from script location)
# ============================================================================

$ScriptRoot = $PSScriptRoot
if (-not $ScriptRoot) { $ScriptRoot = Get-Location }

# Navigate up one level from 'project cleanup' folder to repo root
$RepoRoot = Split-Path $ScriptRoot -Parent
$AuthoringPath = Join-Path $RepoRoot "authoring"
$SitesPath = Join-Path $AuthoringPath "items\demo\`$Sites\`$main"
$ContentPath = Join-Path $SitesPath "`$Content\main"
$MediaLibraryPath = Join-Path $SitesPath "`$MediaLibrary\main"

# ============================================================================
# Helper Functions
# ============================================================================

function Write-Log {
    param(
        [string]$Message,
        [ValidateSet("Info", "Success", "Warning", "Error")]
        [string]$Level = "Info"
    )

    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $color = switch ($Level) {
        "Info"    { "Cyan" }
        "Success" { "Green" }
        "Warning" { "Yellow" }
        "Error"   { "Red" }
    }

    Write-Host "[$timestamp] " -NoNewline -ForegroundColor Gray
    Write-Host "[$Level] " -NoNewline -ForegroundColor $color
    Write-Host $Message
}

function Remove-ItemSafely {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [string]$Path,
        [string]$Description
    )

    if (Test-Path $Path) {
        if ($PSCmdlet.ShouldProcess($Path, "Delete $Description")) {
            Remove-Item -Path $Path -Recurse -Force
            Write-Log "Deleted: $Path" -Level "Success"
        } else {
            Write-Log "Would delete: $Path" -Level "Info"
        }
    } else {
        Write-Log "Not found (skipping): $Path" -Level "Warning"
    }
}

function Remove-ItemsExcept {
    param(
        [string]$FolderPath,
        [string[]]$ExcludeNames,
        [switch]$FilesOnly,
        [switch]$FoldersOnly
    )

    if (-not (Test-Path $FolderPath)) {
        Write-Log "Folder not found: $FolderPath" -Level "Warning"
        return
    }

    $items = Get-ChildItem -Path $FolderPath

    if ($FilesOnly) {
        $items = $items | Where-Object { -not $_.PSIsContainer }
    }
    if ($FoldersOnly) {
        $items = $items | Where-Object { $_.PSIsContainer }
    }

    foreach ($item in $items) {
        if ($item.Name -notin $ExcludeNames) {
            Remove-ItemSafely -Path $item.FullName -Description $item.Name
        } else {
            Write-Log "Keeping: $($item.FullName)" -Level "Info"
        }
    }
}

function Remove-TemplateInheritance {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [string]$FilePath,
        [string]$TemplateIdToRemove
    )

    if (-not (Test-Path $FilePath)) {
        Write-Log "Template file not found: $FilePath" -Level "Warning"
        return
    }

    $content = Get-Content -Path $FilePath -Raw

    # Pattern to match the line containing the template ID (with or without braces)
    # The ID can appear as {GUID} on its own line within the __Base template Value block
    $escapedId = [regex]::Escape($TemplateIdToRemove)
    $pattern = "(?m)^\s*\{$escapedId\}\s*\r?\n"

    if ($content -match $pattern) {
        $newContent = $content -replace $pattern, ""

        if ($PSCmdlet.ShouldProcess($FilePath, "Remove _Demo template inheritance")) {
            Set-Content -Path $FilePath -Value $newContent -NoNewline
            Write-Log "Removed _Demo inheritance from: $FilePath" -Level "Success"
        } else {
            Write-Log "Would remove _Demo inheritance from: $FilePath" -Level "Info"
        }
    } else {
        Write-Log "_Demo inheritance not found in: $FilePath" -Level "Info"
    }
}

function Edit-YmlRenderings {
    [CmdletBinding(SupportsShouldProcess)]
    param(
        [string]$FilePath,
        [int]$KeepCount
    )

    if (-not (Test-Path $FilePath)) {
        Write-Log "YML file not found: $FilePath" -Level "Warning"
        return
    }

    $content = Get-Content -Path $FilePath -Raw

    # Find the __Renderings field value section
    # The renderings are XML-like content within Value: |
    if ($content -match '(?s)(Hint: __Renderings\s+Value: \|\s+<r xmlns:p="p" xmlns:s="s"\s+p:p="1">\s+<d\s+id="\{FE5D7FDF-89C0-4D99-9AA3-B5FBD009C9F3\}">\s+)((?:<r\s+[\s\S]*?/>[\s\S]*?)+?)(\s+</d>\s+</r>)') {
        $prefix = $Matches[1]
        $renderingsBlock = $Matches[2]
        $suffix = $Matches[3]

        # Extract individual <r ... /> elements
        $renderingMatches = [regex]::Matches($renderingsBlock, '<r\s+[\s\S]*?/>')

        if ($renderingMatches.Count -le $KeepCount) {
            Write-Log "File already has $($renderingMatches.Count) renderings (keeping $KeepCount): $FilePath" -Level "Info"
            return
        }

        # Keep only the first N renderings
        $keptRenderings = @()
        for ($i = 0; $i -lt [Math]::Min($KeepCount, $renderingMatches.Count); $i++) {
            $keptRenderings += $renderingMatches[$i].Value
        }

        # Fix the last rendering's p:after to be the end marker
        if ($keptRenderings.Count -gt 0) {
            $lastRendering = $keptRenderings[-1]
            # Replace the p:after attribute to point to end
            $lastRendering = $lastRendering -replace 'p:after="r\[@uid=''\{[^}]+\}''\]"', 'p:after="*[1=2]"'
            $keptRenderings[-1] = $lastRendering
        }

        # Build new renderings block with proper formatting
        $newRenderingsBlock = ($keptRenderings -join "`n        ")

        # Reconstruct the content
        $newContent = $content -replace [regex]::Escape($Matches[0]), ($prefix + $newRenderingsBlock + $suffix)

        if ($PSCmdlet.ShouldProcess($FilePath, "Trim renderings from $($renderingMatches.Count) to $KeepCount")) {
            Set-Content -Path $FilePath -Value $newContent -NoNewline
            Write-Log "Trimmed renderings from $($renderingMatches.Count) to $KeepCount in: $FilePath" -Level "Success"
        } else {
            Write-Log "Would trim renderings from $($renderingMatches.Count) to $KeepCount in: $FilePath" -Level "Info"
        }
    } else {
        Write-Log "Could not parse __Renderings in: $FilePath" -Level "Warning"
    }
}

# ============================================================================
# Main Script Execution
# ============================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Sitecore Project Cleanup Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verify paths exist
if (-not (Test-Path $AuthoringPath)) {
    Write-Log "Authoring folder not found at: $AuthoringPath" -Level "Error"
    Write-Log "Please run this script from the 'project cleanup' folder." -Level "Error"
    exit 1
}

Write-Log "Starting cleanup process..." -Level "Info"
Write-Log "Repository root: $RepoRoot" -Level "Info"
Write-Log "Authoring path: $AuthoringPath" -Level "Info"

if ($WhatIfPreference) {
    Write-Host ""
    Write-Host "*** RUNNING IN WHATIF MODE - NO CHANGES WILL BE MADE ***" -ForegroundColor Yellow
    Write-Host ""
}

# ============================================================================
# PART 1: Delete Operations
# ============================================================================

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "  PART 1: Delete Operations" -ForegroundColor White
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# ----------------------------------------------------------------------------
# 1. Clean Home Content
# ----------------------------------------------------------------------------
Write-Log "=== Cleaning Home Content ===" -Level "Info"

$homePath = Join-Path $ContentPath "Home"
Remove-ItemsExcept -FolderPath $homePath -ExcludeNames $HomeKeepItems

# ----------------------------------------------------------------------------
# 2. Clean Component Settings
# ----------------------------------------------------------------------------
Write-Log "=== Cleaning Component Settings ===" -Level "Info"

$componentSettingsPath = Join-Path $ContentPath "Settings\Component Settings"
Remove-ItemsExcept -FolderPath $componentSettingsPath -ExcludeNames $ComponentSettingsKeepFolders -FoldersOnly

# ----------------------------------------------------------------------------
# 3. Clean Media Library
# ----------------------------------------------------------------------------
Write-Log "=== Cleaning Media Library ===" -Level "Info"

Remove-ItemsExcept -FolderPath $MediaLibraryPath -ExcludeNames $MediaLibraryKeepItems

# Delete System folder (but System.yml was kept above)
$systemFolderPath = Join-Path $MediaLibraryPath "System"
Remove-ItemSafely -Path $systemFolderPath -Description "System folder"

# Clean up Logos folder
$logosPath = Join-Path $MediaLibraryPath "Logos"
if (Test-Path $logosPath) {
    Write-Log "Cleaning Logos folder" -Level "Info"
    Remove-ItemsExcept -FolderPath $logosPath -ExcludeNames $LogosKeepItems
}

# ----------------------------------------------------------------------------
# 4. Clean Site Data - Remove unlisted folders
# ----------------------------------------------------------------------------
Write-Log "=== Cleaning Site Data Folder ===" -Level "Info"

$dataPath = Join-Path $ContentPath "Data"
Remove-ItemsExcept -FolderPath $dataPath -ExcludeNames $DataKeepFolders -FoldersOnly

# ----------------------------------------------------------------------------
# 5. Clean Site Data - Headers
# ----------------------------------------------------------------------------
Write-Log "=== Cleaning Site Data - Headers ===" -Level "Info"

$headersPath = Join-Path $ContentPath "Data\Headers"
Remove-ItemsExcept -FolderPath $headersPath -ExcludeNames $HeadersKeepItems

# ----------------------------------------------------------------------------
# 6. Clean Site Data - Tertiary Navs
# ----------------------------------------------------------------------------
Write-Log "=== Cleaning Site Data - Tertiary Navs ===" -Level "Info"

$tertiaryNavsPath = Join-Path $ContentPath "Data\Tertiary Navs"
Remove-ItemsExcept -FolderPath $tertiaryNavsPath -ExcludeNames $TertiaryNavsKeepItems

# ----------------------------------------------------------------------------
# 7. Clean Site Data - Footer Legals
# ----------------------------------------------------------------------------
Write-Log "=== Cleaning Site Data - Footer Legals ===" -Level "Info"

$footerLegalsPath = Join-Path $ContentPath "Data\Footer Legals"
Remove-ItemsExcept -FolderPath $footerLegalsPath -ExcludeNames $FooterLegalsKeepItems

# ----------------------------------------------------------------------------
# 8. Clean Site Data - Footer Mains
# ----------------------------------------------------------------------------
Write-Log "=== Cleaning Site Data - Footer Mains ===" -Level "Info"

$footerMainsPath = Join-Path $ContentPath "Data\Footer Mains"
Remove-ItemsExcept -FolderPath $footerMainsPath -ExcludeNames $FooterMainsKeepItems

# ----------------------------------------------------------------------------
# 9. Clean Site Data - Footer Menus
# ----------------------------------------------------------------------------
Write-Log "=== Cleaning Site Data - Footer Menus ===" -Level "Info"

$footerMenusPath = Join-Path $ContentPath "Data\Footer Menus"
Remove-ItemsExcept -FolderPath $footerMenusPath -ExcludeNames $FooterMenusKeepItems

# ============================================================================
# PART 2: YML Rendering Modifications
# ============================================================================

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "  PART 2: YML Rendering Modifications" -ForegroundColor White
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

$partialDesignsPath = Join-Path $ContentPath "Presentation\Partial Designs\Navigation"

foreach ($file in $RenderingConfig.Keys) {
    Write-Log "=== Processing $file ===" -Level "Info"
    Edit-YmlRenderings -FilePath (Join-Path $partialDesignsPath $file) -KeepCount $RenderingConfig[$file]
}

# ============================================================================
# PART 3: Settings.yml Field Cleanup
# ============================================================================

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "  PART 3: Settings.yml Field Cleanup" -ForegroundColor White
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

$settingsYmlPath = Join-Path $ContentPath "Settings.yml"

if (Test-Path $settingsYmlPath) {
    Write-Log "=== Clearing Settings.yml field values ===" -Level "Info"

    $settingsContent = Get-Content -Path $settingsYmlPath -Raw
    $modified = $false

    foreach ($fieldId in $SettingsFieldsToClear.Keys) {
        $fieldHint = $SettingsFieldsToClear[$fieldId]

        # Clear field value - matches the field block and removes the link value
        $pattern = "(?s)(- ID: `"$fieldId`"\s+Hint: $fieldHint\s+Value: \|)\s+<link[^>]+/>"

        if ($settingsContent -match $pattern) {
            $settingsContent = $settingsContent -replace $pattern, '$1'
            $modified = $true
            Write-Log "Cleared $fieldHint field value" -Level "Success"
        } else {
            Write-Log "$fieldHint field already empty or not found" -Level "Info"
        }
    }

    if ($modified) {
        if ($PSCmdlet.ShouldProcess($settingsYmlPath, "Clear field values in Settings.yml")) {
            Set-Content -Path $settingsYmlPath -Value $settingsContent -NoNewline
            Write-Log "Settings.yml updated successfully" -Level "Success"
        } else {
            Write-Log "Would clear field values in Settings.yml" -Level "Info"
        }
    }
} else {
    Write-Log "Settings.yml not found at: $settingsYmlPath" -Level "Warning"
}

# ============================================================================
# PART 4: _Demo Template Cleanup
# ============================================================================

Write-Host ""
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host "  PART 4: _Demo Template Cleanup" -ForegroundColor White
Write-Host "----------------------------------------" -ForegroundColor Gray
Write-Host ""

# Define the _Demo template paths
$commonItemsPath = Join-Path $AuthoringPath "items\common"
$demoTemplatePath = Join-Path $commonItemsPath "`$FoundationTemplates\Common\Navigation\_Demo.yml"
$demoTemplateFolderPath = Join-Path $commonItemsPath "`$FoundationTemplates\Common\Navigation\_Demo"

# ----------------------------------------------------------------------------
# 1. Delete _Demo template file and folder
# ----------------------------------------------------------------------------
Write-Log "=== Deleting _Demo Template ===" -Level "Info"

Remove-ItemSafely -Path $demoTemplatePath -Description "_Demo.yml template file"
Remove-ItemSafely -Path $demoTemplateFolderPath -Description "_Demo template folder"

# ----------------------------------------------------------------------------
# 2. Remove _Demo inheritance from templates
# ----------------------------------------------------------------------------
Write-Log "=== Removing _Demo Template Inheritance ===" -Level "Info"

foreach ($templatePath in $TemplatesWithDemoInheritance) {
    $fullPath = Join-Path $commonItemsPath $templatePath
    Remove-TemplateInheritance -FilePath $fullPath -TemplateIdToRemove $DemoTemplateId
}

# ============================================================================
# Summary
# ============================================================================

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Cleanup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($WhatIfPreference) {
    Write-Host "This was a dry run. No changes were made." -ForegroundColor Yellow
    Write-Host "Run without -WhatIf to apply changes." -ForegroundColor Yellow
} else {
    Write-Host "All cleanup operations have been completed." -ForegroundColor Green
    Write-Host "The project is now a clean starter template." -ForegroundColor Green
}

Write-Host ""
