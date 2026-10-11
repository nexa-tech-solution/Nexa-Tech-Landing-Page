# Cross-posting blog posts (dev.to, Medium)

Our blog is the original. Every copy elsewhere must point its canonical URL back to
`https://<site>/blog/<slug>` so search engines credit our page, not the copy.

## dev.to
Add to the post's front matter:

```yaml
---
title: <same title>
canonical_url: https://<site>/blog/<slug>
---
```

Or in the editor: ⚙️ Post options → **Canonical URL**.

## Medium
Use **Import a story** (profile menu → Stories → Import a story) and paste the blog URL.
Medium sets the canonical automatically. If you paste content manually instead:
story ⋯ menu → **More settings → Advanced settings → Customize canonical link**.

## Checklist
- Publish on our blog first; wait until it is indexed (Search Console → URL inspection).
- Keep the title the same; add a first line: "Originally published on the Nexa Tech blog" with a link.
- Link back to the related `/work/<slug>` page where relevant.
- View page source of the copy and confirm `<link rel="canonical" href="https://<site>/blog/<slug>">`.
