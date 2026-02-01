# 📐 Comparison Report Design Reference Files

**Location:** `/src/imports/`  
**Purpose:** Figma-imported React components for the professional multi-page comparison PDF report  
**Status:** ✅ Ready for developer implementation

---

## 🎨 Design Files Overview

These files contain the **exact Figma designs** for the YieldPulse Comparison Report PDF. They represent the pixel-perfect visual specifications that should be matched in the PDF generator.

### Files in This Collection:

| File Name | Page/Section | Description |
|-----------|--------------|-------------|
| **A41.tsx** | Cover Page | Navy gradient background with YieldPulse logo, report title, property list with color indicators, and metadata (date, prepared by, confidential label) |
| **A42.tsx** | Summary Page | Property overview cards with images, purchase price, monthly rent, yields, cash flow, and cash-on-cash return in a side-by-side layout |
| **A43.tsx** | Yield Comparison | Bar chart visualization comparing Gross Yield %, Net Yield %, and Cash on Cash % across properties |
| **A44.tsx** | Cash Flow Analysis | 5-year cash flow projection charts and detailed year-by-year breakdown tables |
| **A4I5.tsx** | Risk Profiles | Risk profile comparison with radar charts showing 4 risk dimensions across properties |
| **A46.tsx** | Investment Decision Helper | Decision matrix and recommendation summary to guide investment choices |

---

## 🎯 Design System (Extracted from Figma)

### **Brand Colors**
```typescript
Navy Primary: #1F2975 (RGB: 31, 41, 117)
Teal Accent: #14B8A6 (RGB: 20, 184, 166)
```

### **Property Indicator Colors**
```typescript
Property 1: #1E2875 (Navy)
Property 2: #15B8A6 (Teal)
Property 3: #F59E0C (Amber)
Property 4: #6366F1 (Purple)
```

### **Typography (Inter Font)**
```
Title: 33.6px Semi Bold
Section Title: 24px Semi Bold
Card Title: 16px Semi Bold
Body: 12px Regular
Body Small: 10px Regular
Caption: 8px Regular
```

### **Layout Specifications**
- Page Size: A4 (595px × 842px at 72dpi)
- Margins: 40px horizontal
- Content Width: 515px
- Border Radius: 4px-6px for cards
- Spacing: 8px, 16px, 24px grid system

---

## 🔧 How to Use These Files

### **For Developers:**

1. **View the Design Components:**
   ```bash
   # Open any file to see the exact Figma structure
   /src/imports/A41.tsx  # Start with the cover page
   ```

2. **Extract Design Tokens:**
   - Colors are defined in inline styles and Tailwind classes
   - Spacing values are in className props (e.g., `gap-[8px]`, `px-[40px]`)
   - Font sizes are in `text-[XXpx]` format

3. **Reference Images & Assets:**
   - SVG paths are imported from `svg-*.ts` files in this same directory
   - Raster images use `figma:asset/` scheme
   - Noise textures and gradients are defined in component code

4. **Implementation Target:**
   - Current implementation: `/src/utils/comparisonPdfGenerator.ts`
   - Goal: Match these designs pixel-perfect in the PDF output

### **Visual Inspection:**

Each `.tsx` file is a fully functional React component. You can:
- Import and render them in isolation to see the design
- Use browser DevTools to inspect exact measurements
- Copy color values, spacing, and typography directly

---

## 📋 Implementation Checklist

- [x] Cover page structure (A41)
- [x] Property summary cards (A42)
- [x] Yield comparison charts (A43)
- [ ] Cash flow projection charts (A44) - **NEEDS REFINEMENT**
- [ ] Risk profile radar charts (A4I5) - **NOT YET IMPLEMENTED**
- [ ] Investment decision helper (A46) - **NOT YET IMPLEMENTED**

---

## 🚨 Important Notes

### **DO NOT DELETE THESE FILES**
These are the source-of-truth design references. Even if they're not directly imported into the app, they serve as critical documentation for:
- Design specifications
- Color accuracy
- Typography standards
- Layout proportions
- Component structure

### **DO NOT MODIFY THESE FILES**
These files are direct Figma exports. Any changes should be made in Figma and re-imported to maintain design consistency.

### **Accessing SVG Assets**
The design files reference SVG files like:
- `svg-fejnn58qfv.ts`
- `svg-zlxs53lwuh.ts`
- `svg-3h2ld63ejk.ts`

These are in the same `/src/imports/` directory and contain path data for vector graphics.

---

## 📞 Questions or Updates?

If you need to:
- **Update the designs:** Re-import from Figma using Figma Make's import feature
- **Understand a design detail:** Open the `.tsx` file and inspect the component structure
- **Match colors precisely:** Use the color values documented above or extract from className props

---

**Last Updated:** January 30, 2026  
**Design Source:** YieldPulse Figma File (Comparison Report Section)  
**Maintained By:** Product Team
