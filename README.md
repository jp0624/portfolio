# John Parker — Portfolio

A responsive portfolio built with **React 19, TypeScript and Vite**, showcasing software engineering, technical leadership, interactive development and design.

## Run locally

Requires Node.js 22.12+.

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

`REPOSITORY_REVIEW.md` records review coverage and limitations. All 38 accessible repositories were inventoried. Private projects are excluded from public content. Empty repositories are not presented as finished projects. Starter projects are explicitly labelled. Language labels are inferred from first-party file extensions rather than GitHub Linguist percentages. Stacks for supplied client work come from John; skills describe the work involved rather than a certification or proficiency score.

## Screenshots

Eight public website captures are bundled locally: Sinking Ship, Fieldnotes, Pearson, property search, Le-Chat agent website, CRM, Odd Squad and Robbie's simulation. Captured 19 October 2026. The CRM remained in its loading state in the capture browser, noted in its caption. Other cards show repository manifest/structure snapshots, not fabricated running interfaces. Branding covers are typographic editorial labels; original files open externally. Website imagery and client marks belong to their respective owners.

## Deployment

Import this repository into Vercel or Netlify using the **Vite** preset:

- Install: `npm ci`
- Build: `npm run build`
- Output: `dist`

This app uses anchor navigation, so no SPA route rewrite is needed. `base: './'` also supports static subdirectory hosting. Publish the `dist` folder to any static host. GitHub Actions runs tests and the production build on pushes and pull requests. The repository push does not itself configure a hosting provider.

## Validation

`npm run build` performs strict TypeScript checking and builds the production assets. `npm test` checks catalogue integrity, snapshot availability, combined searching/filtering and non-mutating sorting. These are automated checks; a full browser accessibility and responsive review is still recommended before launch. External demos, Firebase availability, old archives, Drive and Figma permissions can change independently of this portfolio.

Google Fonts are optional enhancements; system fonts provide fallbacks. No analytics or tracking is included.
