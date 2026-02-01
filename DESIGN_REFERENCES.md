# 🎨 YieldPulse Design Reference Guide

This document serves as the master index for all Figma design imports and reference files in the YieldPulse project.

---

## 📍 Quick Navigation

### **Comparison Report PDF Designs** 🆕
**Location:** `/src/imports/COMPARISON_REPORT_DESIGNS_README.md`

The complete Figma designs for the multi-page comparison PDF report are stored in `/src/imports/` with detailed documentation:

- **Cover Page** → `/src/imports/A41.tsx`
- **Summary Page** → `/src/imports/A42.tsx`
- **Yield Comparison** → `/src/imports/A43.tsx`
- **Cash Flow Analysis** → `/src/imports/A44.tsx`
- **Risk Profiles** → `/src/imports/A4I5.tsx`
- **Investment Decision Helper** → `/src/imports/A46.tsx`

**📖 [Read Full Documentation →](/src/imports/COMPARISON_REPORT_DESIGNS_README.md)**

---

## 🔍 How to Access Design Files

### **Option 1: File Explorer**
1. Navigate to `/src/imports/` in your IDE or file browser
2. Look for files named `A41.tsx` through `A46.tsx`
3. Open `COMPARISON_REPORT_DESIGNS_README.md` for complete documentation

### **Option 2: Search**
Search your project for:
- `"COMPARISON_REPORT_DESIGNS"` - finds the README
- `"A41.tsx"` - finds the cover page design
- `"figma:asset"` - finds all Figma-imported images

### **Option 3: Direct Links (in VS Code)**
- Press `Cmd/Ctrl + P` and type `COMPARISON_REPORT`
- Select the README file to open

---

## 🎯 For Developers

**Current Implementation Status:**
- ✅ Comparison PDF generator exists at `/src/utils/comparisonPdfGenerator.ts`
- ⚠️ Design matching needs refinement to match Figma specs exactly
- 📐 All design specs are documented in `/src/imports/COMPARISON_REPORT_DESIGNS_README.md`

**Next Steps:**
1. Review the design files in `/src/imports/A4*.tsx`
2. Compare with current PDF output from `/src/utils/comparisonPdfGenerator.ts`
3. Refine implementation to match Figma designs pixel-perfect
4. Implement missing sections (Risk Profiles, Investment Decision Helper)

---

## 📦 Design File Storage Architecture

```
/src/imports/
├── COMPARISON_REPORT_DESIGNS_README.md  ← START HERE
├── A41.tsx                               ← Cover Page
├── A42.tsx                               ← Summary Page
├── A43.tsx                               ← Yield Comparison
├── A44.tsx                               ← Cash Flow Analysis
├── A4I5.tsx                              ← Risk Profiles
├── A46.tsx                               ← Investment Decision Helper
└── svg-*.ts                              ← Vector assets used by above
```

---

## 🚨 Important Guidelines

### **DO NOT DELETE**
- Any files in `/src/imports/A4*.tsx` - these are design references
- The README file `COMPARISON_REPORT_DESIGNS_README.md`
- Any `svg-*.ts` files that are imported by the design components

### **SAFE TO MODIFY**
- `/src/utils/comparisonPdfGenerator.ts` - this is the implementation
- This file (`/DESIGN_REFERENCES.md`) - update as needed

### **WHEN TO UPDATE**
If designs change in Figma:
1. Re-import the frames using Figma Make's import feature
2. Update the `COMPARISON_REPORT_DESIGNS_README.md` if structure changes
3. Update implementation in `/src/utils/comparisonPdfGenerator.ts`

---

**Last Updated:** January 30, 2026  
**Maintained By:** Product Team
