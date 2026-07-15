# Project Instructions

After completing any task in this project, run this cleanup command from the repository root:

```bash
find . -name '._*' -type f -delete
```

This rule applies to both Codex and Claude when working in this repository.

When working with i18n or page content in this repo, do not prop-drill translated strings from route-level pages into section components.
Fetch translations in the component that owns the UI section, or use the project's i18n library directly there.
