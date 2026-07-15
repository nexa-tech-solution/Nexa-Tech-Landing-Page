# CLAUDE.md

## Post-Task Cleanup

After completing any task in this project, run this cleanup command from the repository root:

```bash
find . -name '._*' -type f -delete
```

This removes macOS resource fork files that should not be committed.
