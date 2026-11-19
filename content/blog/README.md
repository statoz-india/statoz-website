# Writing a blog post

Each post is one file: `content/blog/<slug>.mdx`. The file name becomes the URL
(`ipl-2027-trade-window-every-transfer.mdx` → `/blog/ipl-2027-trade-window-every-transfer`),
so use lowercase words joined by hyphens and don't rename a file once it is live.

Adding the file is all it takes. The blog index, sitemap, RSS feed, llms.txt,
llms-full.txt, BlogPosting and FAQ schema and the share image all pick it up on
the next build. If a field is missing or wrong, `npm run build` fails and names
the file and the field.

Copy an existing post as a starting point.

## Front matter

Everything between the two `---` lines at the top. Quote every text value.

| Field | What it is |
| --- | --- |
| `title` | Full title, used for the browser tab, search results and schema |
| `titleLead`, `titleGrad` | The title split in two for the page heading; the second part gets the gradient |
| `eyebrow` | Small label above the heading, e.g. `"IPL 2027 · Trade Window"` |
| `summary` | One or two sentences under the heading, on the blog card and in share previews |
| `description` | Meta description: answer the question first, under ~160 characters |
| `keywords` | List of search phrases the post targets |
| `published`, `updated` | Dates as `"YYYY-MM-DD"`. Bump `updated` whenever you change the facts |
| `visual` | Blog card art: `top`, `main` (big text), `badge`, and `variant` (`"season"` or `"quiz"`) |
| `linkText` | Link label on the blog card, e.g. `"Read the journey"` |
| `cta` | Label of the download button at the end of the post |
| `stats` | List of `{ label, value }` shown in the sidebar panel |
| `statsPanel` | Sidebar `label`, `heading` and an optional `note` |
| `faq` | List of `q` / `a` pairs shown at the end with FAQ schema. Only use facts stated in the post |

Lines starting with `#` inside the front matter are comments: use them for
sources or reminders that shouldn't appear on the page.

## Body

Plain Markdown, plus GitHub-style tables:

- The **first paragraph** is styled as the intro. Make it a direct, complete
  answer to what the post is about; search engines and AI assistants quote it.
- Use `##` for sections and `###` for sub-sections. Don't use `#`: the page
  title is already the one top-level heading.
- `> text` makes a pull quote.
- `[label](/predictions/ipl)` links within the site; full `https://` links open
  in a new tab.
- `**bold**`, lists and tables work as usual. Wide tables scroll sideways on phones.
- Write `{` and `<` only inside code; MDX reads them as code otherwise.

The body also goes into llms-full.txt as-is, so keep it to plain Markdown.
Custom components (registered in `src/components/MdxContent.tsx`) work, but
show up there as raw tags.
