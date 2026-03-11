# Description

<!-- If needed, provide a brief description of your changes -->

---

## Pre-submission Checklist

### I certify that my work

- [ ] Matches the work item description
- [ ] Matches the work item acceptance criteria

### I have tested my work

- [ ] In Storybook
- [ ] On my local rendering host connected to the shared DEV environment
  - [ ] With all 3 component themes
  - [ ] In all languages
  - [ ] In all possible breakpoints
  - [ ] On multiple sites, if applicable
- [ ] In XM Cloud Pages while it uses my local rendering host
  - [ ] With all 3 component themes
  - [ ] In all languages
  - [ ] In all possible breakpoints
  - [ ] On multiple sites, if applicable

### For items, I have

- [ ] Serialized all the required items
- [ ] Not serialized items not related to my work
- [ ] Reverted all modifications to serialized items on my laptop and ran `dotnet sitecore ser pull` without errors (to catch new orphaned items)
- [ ] Ensured that any French string on new items have a proper translation

### If I have touched page items, I have

- [ ] Ensured I edited the shared rendering, not the final rendering

### If I have touched dictionary items, I have

- [ ] Ensured every dictionary item has a French version
- [ ] Run the `tools/validate-dictionary-items.ps1` and fixed the items
- [ ] Run the `tools/analyze-dictionary-usage.ps1` and fixed the items/code

### If I have new templates, I have

- [ ] Ensured all new datasource and page templates have a `__Standard Values` item with "Item fallback" enabled

### If I have new folder templates, I have

- [ ] Ensured their insert options are the right ones

### If I have new template section items, I have

- [ ] Ensured sections are logically ordered for a content author on items of that template

### If I have new template field items, I have

- [ ] Ensured fields have a Title field value with a nice title for content authors
- [ ] Ensured fields have a short help text if their name is not informative enough for content authors
- [ ] Ensured fields are logically ordered for a content author on items of that template

### For code, I have

- [ ] Ensured the code is consistent with other similar code
- [ ] Ensured I did not modify any file/code by accident, that all changes in the PR are required
- [ ] Placed all code in the folder where it belongs: global CONSTS, hooks, helpers, GraphQL fragments and queries, HOCs, types, etc.
- [ ] Regenerated the GraphQL file by running codegen
- [ ] Identified and reduced as much as possible duplicated code
- [ ] Identified and moved to properly named CONSTS, all magic strings and numbers
- [ ] Identified and reduced as much as possible the use of conditions in component return statements for better code readability
- [ ] Removed all debugging console.something statements
- [ ] Ensured there are no useless comments that only describes what we are doing
- [ ] Ensured that added comments are only for function documentation, explaining why we are doing something a specific way, todos for later, or information that would help to understand complex code better like example inputs and expected output
- [ ] Ensured nothing is exported, but not used by any other file
- [ ] Ensured I do not export members that are not being used outside of the file they are declared in
- [ ] Ensured that existing code now being unused due to my changes is deleted
- [ ] Ensured that I have not added any hardcoded English text visible to visitors, in meta elements, or in API route responses
- [ ] Added all new helper files, consts files, and similar files to their folder `index.ts` file, and imported their members from the index instead of the specific file
- [ ] Ensured all new environment variables are added to the `.env.local.template` file and in the Notion complete `.env.local` file copy
- [ ] Ensured that I used `mainLanguage` from `i18n-config` instead of hardcoding `'en'`

---

## Instructions

To check a box, replace `[ ]` with `[x]` in the markdown source. You can also click the checkboxes in the GitHub UI after creating the pull request.
