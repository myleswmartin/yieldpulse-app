# Vercel Build Verification Guide

## Build Error: Failed to resolve /src/main.tsx from index.html

### ✅ Resolution Checklist

#### 1. Repository Structure (Case-Sensitive)
All files MUST exist with exact casing:

```
Repository Root/
├── index.html          ← MUST exist at root
├── package.json        ← MUST exist at root
├── vite.config.ts      ← MUST exist at root
├── tsconfig.json       ← MUST exist at root
├── src/                ← Directory name MUST be lowercase "src"
│   ├── main.tsx        ← Filename MUST be lowercase "main.tsx"
│   ├── app/            ← Directory MUST be lowercase "app"
│   │   └── App.tsx     ← Component file (capital A is correct)
│   └── styles/
│       └── index.css
└── public/
    └── vite.svg
```

#### 2. index.html Content
File: `/index.html`

**Required script tag (line 11):**
```html
<script type="module" src="/src/main.tsx"></script>
```

**Key points:**
- Path MUST start with `/src/` (absolute path from root)
- Extension MUST be `.tsx` not `.ts` or `.jsx`
- Attribute MUST be `type="module"`

#### 3. src/main.tsx Content
File: `/src/main.tsx`

**Required imports and render:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

**Key points:**
- MUST import from `'./app/App'` (relative path, case-sensitive)
- MUST import from `'./styles/index.css'`
- MUST use `ReactDOM.createRoot()` (React 18 syntax)

#### 4. package.json Scripts
File: `/package.json`

**Required scripts:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

#### 5. vite.config.ts Configuration
File: `/vite.config.ts`

**Must include React plugin:**
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### Common Build Failure Causes

❌ **Case sensitivity issues:**
- `Src/` instead of `src/`
- `Main.tsx` instead of `main.tsx`
- `APP.tsx` instead of `App.tsx`

❌ **Wrong script path in index.html:**
- `<script src="src/main.tsx">` (missing leading `/`)
- `<script src="/main.tsx">` (missing `src/` directory)
- `<script src="/src/Main.tsx">` (wrong case)

❌ **Missing type="module":**
- `<script src="/src/main.tsx">` (missing `type="module"`)

❌ **Wrong import paths in main.tsx:**
- `import App from './App'` (missing `app/` directory)
- `import App from '../app/App'` (wrong relative path)
- `import App from '@/app/App'` (alias won't work in entry point)

❌ **Missing files:**
- `src/` directory not committed to Git
- `src/main.tsx` not in repository
- `src/app/App.tsx` not in repository

### Verification Commands

**On GitHub:**
1. Navigate to repository root
2. Verify you can see: `index.html`, `package.json`, `src/` folder
3. Click into `src/` → verify `main.tsx` exists
4. Click into `src/app/` → verify `App.tsx` exists

**Build should execute:**
```bash
# Vercel runs these commands:
npm install          # Installs dependencies
npm run build        # Runs: vite build

# Vite build process:
1. Reads index.html
2. Parses <script type="module" src="/src/main.tsx">
3. Resolves /src/main.tsx → reads file
4. Follows imports → ./app/App → src/app/App.tsx
5. Bundles everything → outputs to dist/
```

### Success Indicators

✅ **Vercel build log should show:**
```
[12:34:56.789] Running build command: npm run build
[12:34:57.890] > vite build
[12:34:58.123] vite v6.3.5 building for production...
[12:35:01.456] ✓ 1234 modules transformed.
[12:35:02.789] dist/index.html                   0.45 kB
[12:35:02.790] dist/assets/index-abc123.css     12.34 kB
[12:35:02.791] dist/assets/index-def456.js     567.89 kB
[12:35:02.792] ✓ built in 4.67s
[12:35:03.000] Build Completed
```

✅ **GitHub repository should show:**
- `index.html` visible at root level
- `src/` folder visible at root level (blue folder icon)
- Clicking `src/` shows `main.tsx` file

### If Build Still Fails

1. **Check Git case sensitivity:**
   - Rename folders/files with exact casing
   - Commit changes with descriptive message

2. **Verify .gitignore doesn't exclude src/:**
   ```
   # .gitignore should NOT contain:
   src/
   src/*
   *.tsx
   ```

3. **Clear Vercel cache:**
   - Go to Vercel Dashboard
   - Deployments → Click latest deployment
   - Click "Redeploy" → Check "Clear cache"

4. **Manual verification:**
   - Clone your GitHub repo to a fresh directory
   - Run `npm install && npm run build`
   - If it fails locally, issue is in code
   - If it succeeds locally but fails on Vercel, contact Vercel support

---

**Last Updated:** January 2, 2026
**Status:** All files verified present and correct ✅
