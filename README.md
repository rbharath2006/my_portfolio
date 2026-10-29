# Bharath — Developer Portfolio

A responsive, dark-first developer portfolio built with HTML, CSS, JavaScript, Vite, and Three.js. Includes a live 3D hero scene, theme toggle, mobile navigation, scroll reveals, interactive project details, and project cards.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually `http://localhost:5173`).

## Production build

```bash
npm run build
npm run preview
```

The production site is generated in `dist/`.

## Deploy

### Vercel
1. Push this folder to a GitHub repository.
2. Import the repository in Vercel.
3. Framework preset: Vite.
4. Build command: `npm run build`.
5. Output directory: `dist`.

### GitHub Pages
For a project repository, configure the correct Vite `base` path in `vite.config.js` before deploying. Vercel is the easiest first deployment for this project.

## Before publishing

- Verify all personal details, event names, dates, and claims.
- The current resume PDF is included at `public/resume.pdf`; replace it when you update your resume.
- Add confirmed live demo and repository URLs for both projects.
- Check the page on mobile, keyboard navigation, reduced-motion settings, and browsers without WebGL.
- Do not publish any API keys, credentials, or private data.

## Project highlights

- Three.js 3D object with pointer response and particle field.
- Responsive mobile navigation and persisted dark/light theme.
- Accessible project detail modal with Escape-to-close.
- Reduced-motion handling and intersection-based reveal behavior.
- No backend or database required.


## Phase 2 portfolio updates

- Added Open Graph metadata and refined the page description for sharing/search previews.
- Added spoken-language chips based on the resume.
- Included the additional Coursera Sustainability, Responsibility & Ethics course in the certification list.
- Improved project modal descriptions and added a verified GitHub profile link (not a fabricated project repository URL).

## Before publishing

1. Confirm all contact details and public profile URLs are correct.
2. Add direct repository/demo URLs only after those URLs exist and are public.
3. Run `npm install`, `npm run build`, then `npm run preview` to check the production build.
4. Deploy the generated `dist` directory using a static host such as GitHub Pages, Netlify, or Vercel.
