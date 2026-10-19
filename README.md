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
- Browse actual screenshots captured from public project websites, alongside clearly labelled repository snapshots for projects without a captured live demo.
- Explore branding, logo, website and business-card originals in Google Drive, Ventus in Figma, and the 2014 design archive.
- Responsive layouts, semantic landmarks, labelled controls, keyboard focus styles, native modal focus handling, Escape-to-close, reduced-motion support and lazy-loaded images.
- No runtime GitHub API calls, credentials, backend or environment variables required.

## Content and editing

`src/projects.json` is the editable project catalogue. Each entry contains a category, description, stack/skills, language labels, status, source evidence, image and optional live URL. Images live in `public/screenshots/`. Design links are in `src/main.tsx`.

`REPOSITORY_REVIEW.md` records review coverage and limitations. All 38 accessible repositories were inventoried. Private repository source is excluded from public content; user-authorized public demos may be represented. Empty repositories are not presented as finished projects. Starter projects are explicitly labelled. Language labels are inferred from first-party file extensions rather than GitHub Linguist percentages. Stacks for supplied client work come from John; skills describe the work involved rather than a certification or proficiency score.

## Screenshots

The initial eight public website captures are bundled locally: Sinking Ship, Fieldnotes, Pearson, property search, Le-Chat agent website, CRM, Odd Squad and Robbie's simulation. Captured 19 October 2026. The CRM remained in its loading state in the capture browser, noted in its caption. Other cards show repository manifest/structure snapshots, not fabricated running interfaces. Branding covers are typographic editorial labels; original files open externally. Website imagery and client marks belong to their respective owners.

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

The profile, career timeline, education, selected client experience and skills now use John's supplied resume and cover letter. The catalogue contains 33 projects, including user-authorized public websites for eVivids, DAYT and Availability. All supplied deployment links are retained; project dialogs call out observed deployment failures or starter pages.

Tailwind CSS 4 is integrated with `@tailwindcss/vite` and imported in `src/styles.css`. Literal utility classes in `src/Profile.tsx` and `src/App.tsx` handle grids, spacing, responsive breakpoints, typography, borders and new component layouts; custom CSS handles editorial styling and motion. This is not an unused Tailwind installation.

`src/Motion.tsx` implements requestAnimationFrame-throttled scroll parallax for the portrait and technical artwork, viewport reveal transitions and a reading-progress line. It uses passive listeners, bounds transforms, cleans up observers/listeners, and responds to reduced-motion preference changes. Light/dark theme selection persists locally. Initial project display is limited to eight with an explicit reveal-all control; search/category/language work across the entire catalogue.

The AI-assisted portrait and technical artwork are optimized local WebP files. See `ASSETS.md` for prompts and provenance. The original photo and private uploaded documents are not published.

### Refresh validation

Eight automated tests pass: four catalogue/filter checks plus four React interaction tests for career rendering, progressive project display, searching hidden projects, deployment notes, modal close/focus restoration, combined filters/reset, theme persistence and reduced-motion rendering. Native dialog methods and media/observer APIs are shimmed in jsdom; this is not browser visual QA. Strict TypeScript and the Vite production build also pass.

The refresh includes 15 actual live-site captures in total. Broken deployments retain source snapshots. `src/Profile.tsx` contains profile/career/skills components; `src/App.tsx` contains navigation, filtering, project cards, theme and dialogs; `src/main.tsx` mounts the application.
