# Site Rename Script

Renames the Sitecore site from "main" to your custom name across all serialized items and configuration files.

## How It Works

The script updates all file names, folder names, and YML content to reference your new site name.

## Quick Start

This document assumes you already have your own project with the TIDAL repository "dev" branch files and you ran the cleanup script first. If not, follow the [Notion documentation](https://www.notion.so/getfishtank/TIDAL-Base-Project-Setup-2b6b4ffdd71e806ab8a9e8e2a7a9a65f)

### Run the Script

```powershell
cd "path\to\your-project\project cleanup"
.\Rename-Site.ps1
```

The script will prompt you for the new site name.

**Or specify the name directly:**

```powershell
.\Rename-Site.ps1 -NewSiteName "ClientSite"
```

**Preview changes first (recommended):**

```powershell
.\Rename-Site.ps1 -NewSiteName "ClientSite" -WhatIf
```

Shows all changes that would be made without modifying any files.

## Sitecore Naming Rules

The script validates your site name against Sitecore conventions:

| Rule | Valid | Invalid |
| ---- | ----- | ------- |
| Must start with a letter | `ClientSite` | `1Client` |
| Letters, numbers, hyphens, underscores only | `Client-Site_1` | `Client Site!` |
| No spaces | `ClientSite` | `Client Site` |
| Maximum 100 characters | — | — |
| No reserved names | `MyClient` | `CON`, `NUL`, `COM1` |

---

## What Gets Renamed

### Module Configuration

| Before | After |
| ------ | ----- |
| `demo.site.main.module.json` | `demo.site.{YourName}.module.json` |
| `namespace: "demo-sites-main"` | `namespace: "demo-sites-{YourName}"` |
| `"$Sites/$main/$Content"` | `"$Sites/${YourName}/$Content"` |
| `"/sitecore/content/Sites/main"` | `"/sitecore/content/Sites/{YourName}"` |
| `"$Sites/$main/$MediaLibrary"` | `"$Sites/${YourName}/$MediaLibrary"` |
| `"/sitecore/media library/Project/Sites/main"` | `"/sitecore/media library/Project/Sites/{YourName}"` |

### Folder Structure

```plaintext
Before:                              After:
$Sites/                              $Sites/
└── $main/                           └── $YourName/
    ├── $Content/                        ├── $Content/
    │   ├── main.yml                     │   ├── YourName.yml
    │   └── main/                        │   └── YourName/
    │       └── Settings/                │       └── Settings/
    │           └── Site Grouping/       │           └── Site Grouping/
    │               └── main.yml         │               └── YourName.yml
    └── $MediaLibrary/                   └── $MediaLibrary/
        ├── main.yml                         ├── YourName.yml
        └── main/                            └── YourName/
            └── Sitemaps/                        └── Sitemaps/
                ├── main.yml                         ├── YourName.yml
                └── main/                            └── YourName/
```

### YML File Contents

All `.yml` files are updated:

| Field | Before | After |
| ----- | ------ | ----- |
| `Path:` | `/sitecore/content/Sites/main/...` | `/sitecore/content/Sites/{YourName}/...` |
| `Path:` | `/sitecore/media library/Project/Sites/main/...` | `/sitecore/media library/Project/Sites/{YourName}/...` |
| `Name:` (site root) | `main` | `{YourName}` |
| `SiteName:` (site grouping) | `main` | `{YourName}` |

---

## Troubleshooting

### "Module JSON file not found"

Make sure you're running the script from the `project cleanup` folder and the repository structure is intact.

### Items not moving in Sitecore

1. Verify the YML files have the correct `Path:` values
2. Check that item IDs match between your files and Sitecore
3. After commiting the changes, ensure the SitecoreAI deployment is successful. Check its logs.

### Validation errors

The script will display specific validation errors:

```plaintext
[ERROR] Invalid site name!
  - Name cannot start with a number
  - Name can only contain letters, numbers, hyphens (-), and underscores (_)
```

Fix the name and try again.

---

## Script Parameters

| Parameter | Type | Required | Description |
| --------- | ---- | -------- | ----------- |
| `-NewSiteName` | String | No* | The new name for the site. If not provided, script will prompt. |
| `-WhatIf` | Switch | No | Preview changes without making them |

*Required if running non-interactively

---

## Technical Details

The script performs these operations in order:

1. **Validates** the new site name against Sitecore naming rules
2. **Updates** the module JSON file (namespace, paths, include names)
3. **Renames** the `$main` folder to `$YourName`
4. **Renames** content and media library subfolders
5. **Renames** `.yml` files that match the old site name
6. **Updates** all `.yml` file contents (Path fields, Name fields, SiteName fields)

All operations support `-WhatIf` for safe previewing.

---

## After Running

**Next step:** Continue the process from the [Notion documentation](https://www.notion.so/getfishtank/How-to-Start-a-New-Client-Project-using-TIDAL-2b6b4ffdd71e806ab8a9e8e2a7a9a65f).
