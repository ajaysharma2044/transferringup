# Content Studio — writing & editing articles

Your blog is powered by **Decap CMS** (a free, git-based editor). Articles are
plain markdown files in `content/blog/`. The editor just gives you a friendly
form for them, and every field maps to the post's on-page SEO.

There are two ways to use it.

---

## 1. Write locally (works right now, no accounts)

Use this to draft and edit on your own machine.

```bash
npm run dev          # terminal 1 — starts the site
npx decap-server     # terminal 2 — connects the editor to your files
```

Then open **http://localhost:5181/admin/index.html**

> Locally, use the full `/admin/index.html` — the dev server intercepts the bare
> `/admin/`. On the live site, plain `https://yourdomain.com/admin/` works.

- Click **Articles → New Article**.
- Fill in the title, body, and the **SEO fields** (meta description, focus
  keyword, social image, etc.).
- Leave **Draft** on while you work — drafts are visible at `/blog/<slug>` in
  local dev but are **hidden from the live site**.
- Saving writes a real `.md` file into `content/blog/`. Turn **Draft** off when
  it's ready to publish.

Images you upload go to `public/images/blog/`.

---

## 2. Edit the live site from anywhere (one-time setup)

This gives you a login at `https://yourdomain.com/admin/` so you can publish
without touching code. It needs the project on GitHub + Netlify (Netlify is
already configured to build this repo).

1. **Put the project on GitHub**
   ```bash
   git init && git add -A && git commit -m "TransferringUP site"
   # create an empty repo on github.com, then:
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```
   > If your default branch isn't `main`, change `branch:` in
   > `public/admin/config.yml` to match.

2. **Connect Netlify to that repo** — in the Netlify dashboard:
   *Add new site → Import an existing project → pick the GitHub repo.*
   (Build command `npm run build`, publish dir `dist` — already in `netlify.toml`.)

3. **Turn on Identity + Git Gateway** — in your Netlify site:
   - *Identity → Enable Identity*
   - *Identity → Registration → Invite only* (so only you can log in)
   - *Identity → Services → Enable Git Gateway*
   - *Identity → Invite users →* invite your own email, then accept the email
     invite and set a password.

4. **Log in** at `https://yourdomain.com/admin/`. Publishing now commits to the
   repo and Netlify rebuilds the site automatically (~1–2 min).

---

## What each SEO field does

| Field | Where it shows |
|---|---|
| **Title** | The `<h1>` and the browser tab / Google headline. |
| **Meta description** | The grey snippet under your link in Google + social shares. |
| **SEO title override** | Replaces the `<title>` only (rarely needed). |
| **Focus keyword** | For your reference — put it in the title, intro, and a heading. |
| **Canonical URL** | Only if the same content lives primarily on another URL. |
| **Social share image** | The image shown when the article is shared (defaults to the hero image). |
| **Tags** | Drives the "related articles" section. |

The sitemap, RSS feed, and JSON-LD article schema update automatically on each
build — no manual SEO plumbing needed.
