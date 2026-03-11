# Project Cleanup Script

This folder contains PowerShell scripts for setting up a new project from the TIDAL SitecoreAI repository.

| Script | Purpose | Documentation |
| ------ | ------- | ------------- |
| `Clean-SitecoreProject.ps1` | Removes demo content and sample data | This file |
| `Rename-Site.ps1` | Renames the site from "main" to your custom name | [README-Rename-Site.md](README-Rename-Site.md) |

## Quick Start

This document assumes you already have your own project with the TIDAL repository "dev" branch files. If not, follow the [Notion documentation](https://www.notion.so/getfishtank/TIDAL-Base-Project-Setup-2b6b4ffdd71e806ab8a9e8e2a7a9a65f)

### Run the Cleanup Script

Open PowerShell and navigate to the `project cleanup` folder:

```powershell
cd "path\to\your-project\project cleanup"
```

#### Preview changes first (recommended)

```powershell
.\Clean-SitecoreProject.ps1 -WhatIf
```

This shows what would be deleted/modified without making any changes. Ensure everything is ok and there are no errors.

#### Run the cleanup

```powershell
.\Clean-SitecoreProject.ps1
```

## What the Script Does

The script cleans up the `authoring` folder by removing demo/sample content while preserving the core structure needed for a new project.

### Content Removed

#### Pages

- All pages deleted except: `Home`, `_404`, `_500`, and `Search` and their `Data` folders.

#### Component Settings

- All subfolders deleted except: `Alert Banner Categories`, `Icons`, `Social Media`
- All `.yml` definition files are preserved

#### Media Library

- Everything deleted except: `Banners`, `Logos`, `Placeholders`, `Sitemaps`, and `System.yml`
- Inside Logos: only `Tidal-Main-Black.yml` and `placeholder-logo.yml` are kept

#### Site Data (Data folder)

- All component data subfolders deleted except: `Alert Banners`, `Article Bodies`, `Article Footers`, `Article Headers`, `Buttons`, `Event Bodies`, `Event Headers`, `Footer Legals`, `Footer Mains`, `Footer Menus`, `Headers`, `Tertiary Navs`
- All `.yml` definition files are preserved
- Headers: only `Header.yml` kept
- Tertiary Navs: only `TertiaryNav.yml` kept
- Footer Legals: only `FooterLegal.yml` and `FooterLegal` folder kept
- Footer Mains: only `FooterMain.yml` kept
- Footer Menus: only `FooterMenu.yml` kept

### YML Files Modified

The script trims renderings from partial design files to remove demo navigation items:

| File | Renderings Kept |
| ---- | --------------- |
| `Header.yml` | First 3 |
| `Home Header.yml` | First 3 |
| `Footer.yml` | First 8 |
| `Error Header.yml` | First 2 |

### Settings.yml Field Cleanup

The script clears the following field values in `Settings.yml` to remove references to demo pages:

| Field | Action |
| ----- | ------ |
| `accountPageLink` | Value cleared (link removed) |
| `peoplePage` | Value cleared (link removed) |

### _Demo Template Cleanup

The script removes the `_Demo` navigation template and cleans up inheritance references:

#### Files/Folders Deleted

- `authoring/items/common/$FoundationTemplates/Common/Navigation/_Demo.yml`
- `authoring/items/common/$FoundationTemplates/Common/Navigation/_Demo/` (folder and all contents)

#### Templates Modified (inheritance removed)

The `_Demo` template ID (`{5908F5EB-7EE7-4AE4-9898-4563F1640B12}`) is removed from the `__Base template` field in:

- `FooterMain/FooterMain.yml`
- `FooterMenu/FooterMenu.yml`
- `Header/Header.yml`
- `TertiaryNav/TertiaryNav.yml`

### What's Preserved

- All Sitecore templates and field definitions
- Core site structure and configuration
- Base component definitions (`.yml` files)
- Essential media assets (logos, placeholders, sitemaps)
- Dictionary items
- Presentation layer structure

## Customizing the Script

The script is organized into two sections:

1. **Configuration Section** (top of file) - All exclusion lists that control what gets kept
2. **Script Logic Section** (bottom of file) - The execution code that shouldn't need modification

To customize what gets kept or removed, open `Clean-SitecoreProject.ps1` and edit the appropriate list in the **Configuration Section** at the top.

### Script Structure Overview

```plaintext
┌─────────────────────────────────────────────────┐
│          CONFIGURATION SECTION                  │  ← Edit these lists
│  (Lines ~29-189)                                │
├─────────────────────────────────────────────────┤
│  $HomeKeepItems           - Home page items     │
│  $ComponentSettingsKeepFolders                  │
│  $MediaLibraryKeepItems                         │
│  $LogosKeepItems                                │
│  $DataKeepFolders                               │
│  $HeadersKeepItems                              │
│  $TertiaryNavsKeepItems                         │
│  $FooterLegalsKeepItems                         │
│  $FooterMainsKeepItems                          │
│  $FooterMenusKeepItems                          │
│  $RenderingConfig         - Rendering counts    │
│  $SettingsFieldsToClear   - Settings.yml fields │
│  $DemoTemplateId          - _Demo template ID   │
│  $TemplatesWithDemoInheritance - Templates list │
├─────────────────────────────────────────────────┤
│          SCRIPT LOGIC SECTION                   │  ← Don't modify
│  (Lines ~191+)                                  │
└─────────────────────────────────────────────────┘
```

### Configuration Variables

Each configuration variable has detailed comments explaining its purpose. Here's a quick reference:

| Variable | Purpose | Example Modification |
| -------- | ------- | -------------------- |
| `$HomeKeepItems` | Pages to keep in Home folder | Add `"MyPage.yml", "MyPage"` |
| `$ComponentSettingsKeepFolders` | Component setting folders to keep | Add `"My Category"` |
| `$MediaLibraryKeepItems` | Media items to keep | Add `"MyMedia.yml", "MyMedia"` |
| `$LogosKeepItems` | Logo files to keep | Add `"MyClientLogo.yml"` |
| `$DataKeepFolders` | Data folders to keep | Add `"My Data Folder"` |
| `$HeadersKeepItems` | Items in Headers folder to keep | Add `"Header-Alt.yml"` |
| `$TertiaryNavsKeepItems` | Items in Tertiary Navs to keep | Add `"TertiaryNav-Alt.yml"` |
| `$FooterLegalsKeepItems` | Items in Footer Legals to keep | Add `"FooterLegal-Alt.yml"` |
| `$FooterMainsKeepItems` | Items in Footer Mains to keep | Add `"FooterMain-Alt.yml"` |
| `$FooterMenusKeepItems` | Items in Footer Menus to keep | Add `"FooterMenu-Alt.yml"` |
| `$RenderingConfig` | Number of renderings to keep per file | Change value: `"Header.yml" = 5` |
| `$SettingsFieldsToClear` | Field IDs in Settings.yml to clear | Remove a line to skip that field |
| `$DemoTemplateId` | ID of _Demo template to remove from inheritance | Change if using different template |
| `$TemplatesWithDemoInheritance` | Templates with _Demo inheritance | Add/remove template paths as needed |

### Example: Keeping Additional Home Pages

Find `$HomeKeepItems` near the top of the script:

```powershell
$HomeKeepItems = @(
    "_404.yml",      # 404 error page YML file
    "_404",          # 404 error page folder
    "_500.yml",      # 500 error page YML file
    "_500",          # 500 error page folder
    "Data.yml",      # Data page YML file
    "Data",          # Data folder
    "Search.yml",    # Search page YML file
    "Search"         # Search folder
)
```

To keep an additional page called "About", add both the `.yml` file and folder:

```powershell
$HomeKeepItems = @(
    "_404.yml",
    "_404",
    "_500.yml",
    "_500",
    "Data.yml",
    "Data",
    "Search.yml",
    "Search",
    "About.yml",     # Keep About page
    "About"          # Keep About page children
)
```

### Example: Changing Rendering Counts

Find `$RenderingConfig`:

```powershell
$RenderingConfig = @{
    "Header.yml"       = 3   # Keep first 3 renderings
    "Home Header.yml"  = 3   # Keep first 3 renderings
    "Footer.yml"       = 8   # Keep first 8 renderings
    "Error Header.yml" = 2   # Keep first 2 renderings
}
```

To keep more renderings in the Header:

```powershell
$RenderingConfig = @{
    "Header.yml"       = 5   # Changed from 3 to 5
    "Home Header.yml"  = 3
    "Footer.yml"       = 8
    "Error Header.yml" = 2
}
```

To skip trimming a file entirely, remove its line from the hashtable.

### Example: Skipping a Settings.yml Field

Find `$SettingsFieldsToClear`:

```powershell
$SettingsFieldsToClear = @{
    "7e7eab6a-3e30-4651-97b0-eb948a121a4b" = "accountPageLink"
    "c27afd30-49bb-4390-a230-7205eb60d826" = "peoplePage"
}
```

To skip clearing `accountPageLink`, remove that line:

```powershell
$SettingsFieldsToClear = @{
    "c27afd30-49bb-4390-a230-7205eb60d826" = "peoplePage"
}
```

### Tips for Customization

1. **Always test with `-WhatIf` first** after making changes to verify the expected behavior
2. **Item names are case-sensitive** - make sure names match exactly as they appear in the file system
3. **Include both `.yml` and folder** when keeping Sitecore items (the `.yml` is the item, the folder contains children)
4. **Read the comments** - each configuration variable has detailed comments explaining its purpose

## After Running

Once the cleanup script completes, you'll have a clean SitecoreAI project ready for customization.

**Next step:** Continue the process from the [Notion documentation](https://www.notion.so/getfishtank/How-to-Start-a-New-Client-Project-using-TIDAL-2b6b4ffdd71e806ab8a9e8e2a7a9a65f).
