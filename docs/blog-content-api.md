# Blog content API

The blog reads posts through `client/src/services/blog`. Today `blogApi` returns
mock data from `services/blog/mock/` (one `.html` file per post, named after the
slug). When the CMS exists, only `blog.api.ts` changes.

## Endpoints the frontend expects

| Call | Returns |
|---|---|
| `GET /blog/posts` | `PostSummary[]`, newest first, without `content` |
| `GET /blog/posts/:slug` | `Post` (summary + `content`), 404 → `BLOG-404` |

Shapes live in `services/blog/blog.types.ts`. `readingMinutes` is expected to be
precomputed by the backend (words ÷ 200, minimum 1).

## `content` HTML

- Stored as an HTML fragment (no `<html>`, `<head>` or `<body>`).
- Sanitized with DOMPurify on render; `<style>`, `<form>`, `<input>`, `<button>`
  and scripts are stripped.
- Every `<h2>` becomes an entry in the "On this page" sidebar.
- Plain tags are styled: `h2 h3 h4 p ul ol blockquote pre code table details hr`.

### Component classes

Defined in `client/src/components/nexa/post-body.css` (markup examples in the
comments there, real usage in `services/blog/mock/content/*.html`).

| Class | Use |
|---|---|
| `p.lead` | Opening paragraph |
| `.tldr` | Summary box, first child `<strong>` is the label |
| `aside.callout[data-tone=tip\|warn]` | Side note |
| `.cards[data-cols=3]` › `.card` | Grid of short cards, optional `.kicker-num` |
| `.do-dont` › `.do` / `.dont` | Two-column do and don't |
| `dl.anatomy` | Label / explanation rows |
| `ol.steps` | Numbered steps |
| `ul.checklist` | Checklist, optional `<small>` note per item |
| `.stats` | Big numbers with labels |
| `.formula` | Centered maths line |
| `.table-wrap` › `table`, `td.num`, `.dot[data-tone]` | Tables with status dots |
| `.chat` › `.msg.them / .me / .typing`, `[data-delay]` | Chat transcript |
| `.url-anatomy` › `span[data-label][data-key][data-above]` | Labeled URL parts |
| `figure.diagram` + `figcaption` | Auto-numbered "Fig. n" diagram |

Diagram bodies inside `figure.diagram`: `ol.flow`, `ol.layers` (with
`.chips`), `div.compare` (`.before` / `.after`), `ol.timeline`,
`ol.storyboard`, `div.phones` › `.phone[data-title]` › `.ctl[data-at]`.
Add `class="accent"` to a node to highlight it.
