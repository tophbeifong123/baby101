# 🚀 Next.js Core Application (`my-next-app`)

This folder contains the core web application for the **Baby 101** project. It is built as a modern, high-performance Next.js application using React Server Components, TypeScript, and the next-generation Tailwind CSS v4 compiler.

---

## 📌 Table of Contents

- [🛠️ Tech Stack Spec](#️-tech-stack-spec)
- [💻 Scripts Reference](#-scripts-reference)
- [📂 File Structure Highlights](#-file-structure-highlights)
- [⚡ Next.js v16 & React 19 Conventions](#-nextjs-v16--react-19-conventions)
- [💅 Tailwind CSS v4.0 Guideline](#-tailwind-css-v40-guideline)
- [🧪 Quality Assurance & Linting](#-quality-assurance--linting)

---

## 🛠️ Tech Stack Spec

- **Framework:** Next.js (App Router)
- **View Engine:** React 19 (React Server Components enabled by default)
- **Language:** TypeScript (Strict compiler flags)
- **Styling Engine:** Tailwind CSS v4.0 (utilizing the new ultra-fast rust compilation engine)
- **CSS Processor:** PostCSS (via `@tailwindcss/postcss`)
- **Linter:** ESLint (v9 flat config file format)

---

## 💻 Scripts Reference

Execute these commands from inside this subdirectory:

### Development Mode
Starts a local development server with instant Hot Module Replacement (HMR):
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** to view your live changes.

### Production Build
Generates a highly optimized, minified production build containing static pages, server components, and asset chunks:
```bash
npm run build
```

### Production Execution
Starts the Next.js server in production mode utilizing the build artifacts from the step above:
```bash
npm run start
```

### Code Quality Check
Executes code analysis rules using ESLint to verify that code meets team quality guidelines:
```bash
npm run lint
```

---

## 📂 File Structure Highlights

Key configuration files and entry points inside this directory:

* **[`app/page.tsx`](file:///D:/Baby/baby101/my-next-app/app/page.tsx):** Main index view, rendered as a React Server Component.
* **[`app/layout.tsx`](file:///D:/Baby/baby101/my-next-app/app/layout.tsx):** Root layout wrapping all pages. Declares global metadata and loads styles.
* **[`app/globals.css`](file:///D:/Baby/baby101/my-next-app/app/globals.css):** Global stylesheet importing Tailwind CSS components and specifying theme tokens.
* **[`eslint.config.mjs`](file:///D:/Baby/baby101/my-next-app/eslint.config.mjs):** Custom code linting rules under the new ESLint Flat Config syntax.
* **[`next.config.ts`](file:///D:/Baby/baby101/my-next-app/next.config.ts):** System settings and build parameters for Next.js.
* **[`tsconfig.json`](file:///D:/Baby/baby101/my-next-app/tsconfig.json):** Standardized compiler configuration ensuring strict TypeScript syntax checks.

---

## ⚡ Next.js v16 & React 19 Conventions

Please respect the modern architectural patterns configured in this application:

1. **RSC First:** Keep components as **React Server Components (RSC)** to leverage lower client bundle sizes and direct database/API calling safely.
2. **Client Elements:** Use `"use client"` exclusively at the topmost boundary of components that rely on user events (clicks, input), browser APIs, or React lifecycle hooks.
3. **Data Fetching:** Standardize on server-side `fetch` routines inside page modules to automatically benefit from request deduplication, cache controls, and incremental static regeneration (ISR).

---

## 💅 Tailwind CSS v4.0 Guideline

Tailwind CSS v4.0 is fully set up in this project:
- Styles are imported globally in [`app/globals.css`](file:///D:/Baby/baby101/my-next-app/app/globals.css) via `@import "tailwindcss";`.
- Theme values are configured using CSS custom properties inside the `@theme inline { ... }` block in `globals.css` rather than a separate `tailwind.config.js` file.
- Custom fonts and utility color overrides can be easily integrated using the native CSS variable design syntax.

---

## 🧪 Quality Assurance & Linting

Keep your editor's ESLint and Prettier plugins active. Before submitting any changes, it is highly recommended to run the build check locally:

```bash
npm run lint
npm run build
```

This guarantees that all files conform to strict style standards and compile properly without errors.
