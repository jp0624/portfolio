# John Parker — Portfolio

A responsive portfolio built with **React 19, TypeScript, Tailwind CSS 4 and Vite**, showcasing software engineering, technical leadership, interactive development and design.

## Run locally

Requires Node.js 22.22.2+, 24.15+, or 26+ (the jsdom test runtime requires a recent patch version).

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

## Features

- Search project titles, descriptions, technologies, languages and skills. Multiple words narrow the results.
- Combine category and language filters; sort featured, alphabetical or by category.
- Open project detail dialogs with languages, relevant skills, repository and demo links.
- Browse every live showcase with a real website snapshot, followed by compact, image-free cards grouped by category for other projects.
- Explore branding, logo, website and business-card originals in Google Drive, Ventus in Figma, and the 2014 design archive.
- Responsive layouts, semantic landmarks, labelled controls, keyboard focus styles, native modal focus handling, Escape-to-close, reduced-motion support and lazy-loaded images.
- No runtime GitHub API calls, credentials, backend or environment variables required.

## Content and editing

`src/projects.json` is the editable project catalogue. Each entry contains a category, description, stack/skills, language labels, status, source evidence, image and optional live URL. Images live in `public/screenshots/`. Design links are in `src/App.tsx`.

`REPOSITORY_REVIEW.md` records review coverage and limitations. All 38 accessible repositories were inventoried. Private repository source is excluded from public content; user-authorized public demos may be represented. Empty repositories are not presented as finished projects. Starter projects are explicitly labelled. Language labels are inferred from first-party file extensions rather than GitHub Linguist percentages. Stacks for supplied client work come from John; skills describe the work involved rather than a certification or proficiency score.

## Screenshots


## Deployment

Import this repository into Vercel or Netlify using the **Vite** preset:

- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`

This app uses anchor navigation, so no SPA route rewrite is needed. `base: './'` also supports static subdirectory hosting. Publish the `dist` folder to any static host. GitHub Actions runs tests and the production build on pushes and pull requests. The repository push does not itself configure a hosting provider.

## Validation

`npm run build` performs strict TypeScript checking and builds the production assets. `npm test` checks catalogue integrity, snapshot availability, combined searching/filtering and non-mutating sorting. These are automated checks; a full browser accessibility and responsive review is still recommended before launch. External demos, Firebase availability, old archives, Drive and Figma permissions can change independently of this portfolio.

Google Fonts are optional enhancements; system fonts provide fallbacks. No analytics or tracking is included.

## Profile and visual refresh

The profile, career timeline, education, selected client experience and skills now use John's supplied resume and cover letter. The catalogue contains 33 projects, including user-authorized public websites for eVivids, DAYT and Availability. All supplied deployment links are retained; project dialogs document demo-specific requirements.

Tailwind CSS 4 is integrated with `@tailwindcss/vite` and imported in `src/styles.css`. Literal utility classes in `src/Profile.tsx` and `src/App.tsx` handle grids, spacing, responsive breakpoints, typography, borders and new component layouts; custom CSS handles editorial styling and motion. This is not an unused Tailwind installation.

`src/Motion.tsx` implements requestAnimationFrame-throttled scroll parallax for the portrait and technical artwork, viewport reveal transitions and a reading-progress line. It uses passive listeners, bounds transforms, cleans up observers/listeners, and responds to reduced-motion preference changes. Light/dark theme selection persists locally. All 18 projects with both a live link and a real screenshot are visible immediately. The remaining 15 appear below in compact category groups. Search/category/language controls apply to both sections. The hero’s accented Explore all projects link jumps to the complete index.

The AI-assisted portrait and technical artwork are optimized local WebP files. See `ASSETS.md` for prompts and provenance. The original photo and private uploaded documents are not published.

### Refresh validation

Ten automated tests pass: six catalogue/filter checks plus four React interaction tests for complete showcase rendering, categorized compact cards, image-free details, deployment notes, modal close/focus restoration, combined filters/reset, theme persistence and reduced-motion rendering. Native dialog methods and media/observer APIs are shimmed in jsdom; this is not browser visual QA. Strict TypeScript and the Vite production build also pass.


## Vercel app repair

Project cards link directly to running applications. Package manifest covers have been replaced by live captures or typographic technical covers. JP Chess, ShowScenes, JS Helpers and Lesson Factory have repaired production builds and runtime loading. The LiDAR viewer and Sportsbooks have dedicated Vercel deployments. Lesson Factory uses clearly labelled sample text because original media and training services are absent. JP Chess Extreme is disabled while its engine assets are missing. The LiDAR scene requires WebGL 2. Source-only projects are not represented as deployed applications.

## Design and client experience

The design cards show the supplied Le-Chat artwork and the Ventus brand sheet. Client and brand experience is grouped by industry using the resume. The layout uses the version before the motion ribbon, with the modal-centering fix retained.


## Full-width editorial sections

The hero, technical scene, About and Contact backgrounds span the viewport, while their content stays aligned within a 1440px grid. Hero, About and Contact share optimized silver/glass/cobalt artwork, with different crops and theme-aware overlays. The existing technical sculpture remains in its own section. Browser checks cover both themes, catalogue interactions, and full-width bounds without horizontal overflow at 320, 390, 768, 1440 and 1920px.

Stage-one refinements: dark is the default for new visitors; saved light preferences persist. Header and Skills have full-width surfaces. Native select options have explicit theme colors. Categories use muted color accents with text labels. Lesson Factory and Dead by Daylight are explicitly placed in the compact archive via `presentation: compact`. Background parallax is capped at 28px on desktop and 12px on mobile, uses passive scroll listeners and one animation frame per scroll update, and stops for reduced-motion preferences. Compact descriptions show two lines; project details retain the full text.

## Stage two: original 2014 archive gallery

Beyond the code includes all 41 original portfolio pages, grouped into Web & campaigns (27), Brand identities (10), and Print & collateral (4). Six previews display initially; visitors can expand the gallery or filter categories. All images are local optimized WebP assets loaded lazily, and each link targets the corresponding source PDF page. `src/archive.json` holds the labels, category, image and page references. The archive test covers expansion, category changes and source-page links.
