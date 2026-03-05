#!/usr/bin/env bash
set -euo pipefail

# Draft UI Setup Script
# Sets up layouts, pages, controllers, and supporting infrastructure
# for a fresh Rails + Inertia.js + React + TypeScript project.
#
# Usage: bash scripts/setup.sh [project_root]
#
# Dependencies: bash, ruby, bundler, node, npm (all project prerequisites)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILL_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
PROJECT_ROOT="${1:-.}"
PROJECT_ROOT="$(cd "$PROJECT_ROOT" && pwd)"

echo "==> Draft UI Setup"
echo "    Skill dir:   $SKILL_DIR"
echo "    Project dir: $PROJECT_ROOT"
echo ""

cd "$PROJECT_ROOT"

# ── Step 1: Install Ruby gems ──────────────────────────────────────────
echo "==> Installing Ruby gems..."
bundle add pagy --version "~> 43.2" --skip-install || true
bundle install --quiet

# ── Step 2: Install npm dependencies ──────────────────────────────────
echo "==> Removing unused npm packages..."
npm uninstall eslint-plugin-import-x @tailwindcss/forms --silent || true

echo "==> Installing npm dev dependencies..."
npm install --save-dev \
  @ianvs/prettier-plugin-sort-imports \
  prettier-plugin-tailwindcss \
  --silent

# ── Step 3: Install shadcn/ui components ───────────────────────────────
echo "==> Installing shadcn/ui components..."
npx shadcn@latest add -y -o \
  alert avatar badge breadcrumb card checkbox collapsible command \
  dialog dropdown-menu input label popover progress select separator \
  sheet sidebar skeleton sonner table tabs textarea tooltip

# ── Step 4: Clean up example files from initial scaffold ───────────────
echo "==> Cleaning up example files..."
rm -f "$PROJECT_ROOT/app/controllers/inertia_example_controller.rb"
rm -rf "$PROJECT_ROOT/app/frontend/pages/inertia_example"

# ── Step 5: Copy all template files ───────────────────────────────────
echo "==> Copying template files (78 files)..."

# Copy dot files explicitly
cp -f "$SKILL_DIR/assets/.editorconfig" "$PROJECT_ROOT/"
cp -f "$SKILL_DIR/assets/.prettierrc" "$PROJECT_ROOT/"
cp -f "$SKILL_DIR/assets/.prettierignore" "$PROJECT_ROOT/"

# Copy everything else (overwrite existing, no rsync dependency)
cp -Rf "$SKILL_DIR/assets/app" "$PROJECT_ROOT/"
cp -Rf "$SKILL_DIR/assets/config" "$PROJECT_ROOT/"
cp -f "$SKILL_DIR/assets/eslint.config.mjs" "$PROJECT_ROOT/"

# ── Step 5b: Replace project name in template files ──────────────────
APP_NAME=$(grep '^module ' config/application.rb | head -1 | awk '{print $2}')
APP_NAME_LOWER=$(echo "$APP_NAME" | sed 's/\([a-z]\)\([A-Z]\)/\1_\2/g' | tr '[:upper:]' '[:lower:]')

if [ -n "$APP_NAME" ] && [ "$APP_NAME" != "Enlead" ]; then
  echo "==> Replacing 'Enlead' → '$APP_NAME', 'enlead' → '$APP_NAME_LOWER'..."
  find "$PROJECT_ROOT/app/frontend" "$PROJECT_ROOT/app/views" \
    -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.erb" \) \
    -exec perl -pi -e "s/Enlead/${APP_NAME}/g; s/enlead/${APP_NAME_LOWER}/g" {} +
else
  echo "    Project name: $APP_NAME (template default, no replacement needed)"
fi

# ── Step 6: Auto-fix linting ─────────────────────────────────────────
echo "==> Auto-fixing lint issues..."
bin/rubocop --autocorrect 2>/dev/null || true
npm run lint:fix 2>/dev/null || true
npx prettier --write "app/frontend/**/*.{ts,tsx}" 2>/dev/null || true

# ── Step 7: Run CI checks (style only) ───────────────────────────────
echo ""
echo "==> Running CI checks..."
ERRORS=0

echo "--> Ruby style (rubocop)..."
if bin/rubocop; then
  echo "    PASS"
else
  echo "    FAIL"
  ERRORS=$((ERRORS + 1))
fi

echo "--> TypeScript (tsc)..."
if npm run check; then
  echo "    PASS"
else
  echo "    FAIL"
  ERRORS=$((ERRORS + 1))
fi

echo "--> ESLint..."
if npm run lint; then
  echo "    PASS"
else
  echo "    FAIL"
  ERRORS=$((ERRORS + 1))
fi

echo "--> Prettier..."
if npm run format:check; then
  echo "    PASS"
else
  echo "    FAIL"
  ERRORS=$((ERRORS + 1))
fi

echo ""
if [ $ERRORS -eq 0 ]; then
  echo "==> Draft UI setup complete! All 4 checks passed."
else
  echo "==> Draft UI setup complete with $ERRORS failed check(s). Review above."
  exit 1
fi
