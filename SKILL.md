---
name: rails-inertia-react-draft-ui
description: >-
  This skill should be used when the user asks to "set up draft UI",
  "add layouts and pages", "scaffold admin and public pages",
  "set up Inertia layouts", "add public marketing pages",
  "set up admin dashboard layout", or needs a complete UI scaffold
  for a Rails + Inertia.js + React + TypeScript project.
  Covers 3-layer layout system, public pages, admin pages, app pages,
  error pages, controllers, and lint configuration.
version: 0.1.0
---

# Draft UI — Layouts + Pages Scaffold

Set up a complete draft UI for a Rails 8 + Inertia.js + React + TypeScript project.
This includes a 3-layer layout system, public marketing pages, admin dashboard pages,
app pages, error handling, and code quality configuration.

**Prerequisite**: A fresh Rails + Inertia.js + React + TypeScript project
(created via `rails-inertia-stack` skill or equivalent). Must have Vite, shadcn/ui
initialized, and SSR configured.

## What Gets Installed

### Via commands (shadcn, gems, npm)

- **shadcn/ui components**: alert, avatar, badge, breadcrumb, card, checkbox,
  collapsible, command, dialog, dropdown-menu, input, label, popover, progress,
  select, separator, sheet, sidebar, skeleton, sonner, table, tabs, textarea, tooltip
- **Ruby gem**: `pagy ~> 43.2` (pagination)
- **npm install**: `@ianvs/prettier-plugin-sort-imports`, `prettier-plugin-tailwindcss`
- **npm uninstall**: `eslint-plugin-import-x` (replaced by prettier import sorting), `@tailwindcss/forms` (unused)

### Via template files (78 assets)

**3-Layer Layout System:**
- `PersistentLayout` — root wrapper: Sonner Toaster + useFlash hook + TooltipProvider
- `PublicLayout` — marketing pages: SiteHeader, SiteFooter, SEO meta tags (OG, Twitter Card, JSON-LD)
- `AdminLayout` — Shopify-style: collapsible sidebar, sticky header, breadcrumbs, user dropdown, SaveBar
- `AppLayout` — end-user app: simplified sidebar, same patterns as admin

**Public Pages** (6 pages): Home, About, Pricing, Contact, Privacy, Terms

**Admin Pages** (9 pages): Dashboard, Users, Webhooks, Settings, Team Settings,
Billing Settings, Analytics Live, Analytics Reports, Error page

**App Pages** (5 pages): Dashboard, Projects, Settings, Billing, Error page

**Error Page** (1 page): Global error page (`pages/errors/show.tsx`) + per-namespace variants

**Controllers** (16 new + 2 modified + 2 concerns):
- `PagesController` — public pages (6 actions)
- `ErrorsController` — error pages with per-namespace rendering
- `Admin::BaseController` — Pagy pagination, flash, shared admin props
- `App::BaseController` — shared app props
- 9 admin resource controllers + 4 app resource controllers
- `ApplicationController` (modified) — global error handling
- `InertiaController` (modified) — shared Inertia props
- `InertiaFlash` concern — custom flash types
- `InertiaUtils` concern — array parsing helpers

**Hooks** (5 hooks): useFlash, useMobile, useIndexPageSearch, useIndexPageSort, useSaveBar

**Config files**: `.prettierrc`, `.prettierignore`, `.editorconfig`, `eslint.config.mjs`,
`config/initializers/pagy.rb`, `config/routes.rb`, `application.html.erb`

**Shared infrastructure**: `lib/inertia.tsx` (shared page resolution, defaults, title template
used by both client entrypoint and SSR)

## Setup Process

### Step 1: Run the setup script

Execute the setup script from the skill's directory. The script handles everything:
installing dependencies, shadcn components, copying 78 template files, cleaning up
example files, and running linting.

```bash
bash $SKILL_DIR/scripts/setup.sh $PROJECT_ROOT
```

Where `$SKILL_DIR` is this skill's base directory and `$PROJECT_ROOT` is the project root.

### Step 2: Handle any errors

If shadcn prompts fail, install components individually:
```bash
npx shadcn@latest add sidebar
npx shadcn@latest add command
```

If TypeScript check fails, verify `tsconfig.app.json` has paths configured for `@/*`.

### Step 3: Verify the setup

After setup, confirm:
1. `npm run check` — TypeScript passes
2. `npm run lint` — ESLint clean
3. `npx prettier --check "app/frontend/**/*.{ts,tsx}"` — Prettier clean
4. `bin/rubocop` — Ruby lint clean
5. `bin/rails routes` — All routes resolve correctly

### Step 4: Delete example/scaffold files

The script automatically removes:
- `app/controllers/inertia_example_controller.rb`
- `app/frontend/pages/inertia_example/`

## Architecture Conventions

### File naming: action name = page filename

| Rails Action | Frontend File |
|-------------|--------------|
| `#index` | `index.tsx` |
| `#show` | `show.tsx` |
| `#new` | `new.tsx` |
| `#edit` | `edit.tsx` |

### Route structure

```
/                    → pages#home           → pages/pages/home.tsx
/about               → pages#about          → pages/pages/about.tsx
/admin/dashboard     → admin/dashboards#show → pages/admin/dashboard/show.tsx
/admin/users         → admin/users#index     → pages/admin/users/index.tsx
/app/dashboard       → app/dashboards#show   → pages/app/dashboard/show.tsx
/app/projects        → app/projects#index    → pages/app/projects/index.tsx
```

### Inertia shared configuration

`lib/inertia.tsx` is the single source of truth shared by both `entrypoints/inertia.tsx`
(client) and `ssr/ssr.tsx` (server). Contains: page resolution with glob patterns,
default layout application, title template, and Inertia defaults (future flags).

### Toast/Flash pattern

Admin-style dark toast using Sonner. `useFlash` hook reads `page.props.flash` on
Inertia navigation success and fires `toast()`. Toaster configured in PersistentLayout
with `position="bottom-center"` and dark styling.

### Pagy pagination

`Admin::BaseController` includes `Pagy::Method` with `pagination_props(pagy)` helper
that returns a serializable hash. Frontend receives `PaginationData` type (auto-converted
from snake_case to camelCase by Inertia prop transformer).

## Customization Points

After running the skill, customize:

- **Nav links**: `navLinks` array in `components/site-header.tsx`
- **Sidebar items**: `navMain` in `components/admin/app-sidebar.tsx` and `components/app/app-sidebar.tsx`
- **Footer links**: Column arrays in `components/site-footer.tsx`
- **SEO defaults**: `DEFAULT_SEO` in `layouts/public-layout.tsx`
- **Pagy defaults**: `config/initializers/pagy.rb`
- **App name**: Search for "Enlead" and replace with project name
