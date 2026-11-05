# housamkak.com

The hub site: who Housam is, the work index, case studies, writing (pulled from blog.housamkak.com) and the CV. Astro 5, static output, no backend.

## Run

    npm install
    npm run dev        # http://localhost:4321
    npm run build      # static site in dist/

## Where things live

| What | File |
| --- | --- |
| Name, tagline, bio, links | `src/data/site.ts` (one place, used everywhere) |
| Projects | `src/content/work/<slug>.md` (schema in `src/content.config.ts`; `tier` 1 flagship, 2 case study, 3 lab; `draft: true` hides a page) |
| Project media | `public/media/<slug>/` plus `src/data/media.json` (hero, gallery, video, og). Missing files are skipped automatically. |
| CV | `src/content/cv/cv.md` and `public/cv/Housam-Kak-CV.pdf` |
| Writing | fetched from the blog RSS at build time, with a fallback list in `src/lib/writing.ts` |
| 3D mode | `src/pages/3d.astro` (three.js, BlockForge GLB at `public/img/train.glb`) |
| H circuit map | `src/components/Circuit.astro` (rendered on the H page) |

`openQuestions` in each project's frontmatter is never rendered. It is the review list for Housam.

## Publishing (not done yet, needs approval)

The live site is the old version on `HousamKak/housamkak-website` (GitHub Pages behind Cloudflare). To replace it:

1. Push this repo to that GitHub repo as a new `main` (keep the old main as a `legacy` branch), or to a new repo.
2. In the repo settings, set Pages source to "GitHub Actions". `.github/workflows/deploy.yml` builds and deploys.
3. `public/CNAME` keeps `www.housamkak.com`. DNS does not change.
