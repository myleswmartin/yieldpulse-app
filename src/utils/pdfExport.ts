import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface ExportOptions {
  fileName: string;
  scale?: number;
  backgroundColor?: string;
}

const UNSAFE_COLOR_REGEX = /oklab|oklch|color-mix/i;
const MAX_LOG_ENTRIES = 25;

const buildNodeLabel = (el: Element) => {
  const id = el.id ? `#${el.id}` : "";
  const className =
    el instanceof HTMLElement && el.className
      ? `.${String(el.className).trim().replace(/\s+/g, ".")}`
      : "";
  return `${el.tagName.toLowerCase()}${id}${className}`;
};

const isUnsafeColor = (value: string | null | undefined) =>
  !!value && UNSAFE_COLOR_REGEX.test(value);

const colorCanvas = (() => {
  let canvas: HTMLCanvasElement | null = null;
  return () => {
    if (!canvas) {
      canvas = document.createElement("canvas");
      canvas.width = 1;
      canvas.height = 1;
    }
    return canvas;
  };
})();

const convertUnsafeColor = (value: string) => {
  if (!isUnsafeColor(value)) return value;
  if (/gradient|color-mix/i.test(value)) return null;

  try {
    const canvas = colorCanvas();
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000000";
    ctx.fillStyle = value;
    ctx.fillRect(0, 0, 1, 1);

    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    const alpha = Math.round((a / 255) * 1000) / 1000;
    if (alpha >= 1) {
      return `rgb(${r}, ${g}, ${b})`;
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  } catch {
    return null;
  }
};

const sanitizeValue = (prop: string, value: string | null) => {
  if (!value) return value;
  if (!isUnsafeColor(value)) return value;
  const lowerProp = prop.toLowerCase();
  if (lowerProp.includes("background-image")) return "none";
  if (lowerProp.includes("shadow")) return "none";
  const converted = convertUnsafeColor(value);
  if (converted) return converted;
  if (lowerProp.includes("fill") || lowerProp.includes("stroke")) return "#111827";
  if (lowerProp.includes("color")) return "#111827";
  if (lowerProp.includes("background")) return "#ffffff";
  if (lowerProp.includes("border")) return "#e5e7eb";
  return "initial";
};

const COLOR_PROPERTIES = [
  "color",
  "background-color",
  "border-color",
  "border-top-color",
  "border-right-color",
  "border-bottom-color",
  "border-left-color",
  "outline-color",
  "text-decoration-color",
  "fill",
  "stroke",
  "stop-color",
  "flood-color",
  "lighting-color",
  "caret-color",
  "box-shadow",
  "text-shadow",
  "background-image",
];

const scanUnsafeColors = (root: HTMLElement) => {
  const entries: Array<{
    node: string;
    type: string;
    value: string;
  }> = [];

  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  for (const el of elements) {
    if (entries.length >= MAX_LOG_ENTRIES) break;

    const styleAttr = el.getAttribute("style");
    if (styleAttr && UNSAFE_COLOR_REGEX.test(styleAttr)) {
      entries.push({
        node: buildNodeLabel(el),
        type: "inline-style",
        value: styleAttr,
      });
    }

    const attrs = ["fill", "stroke", "stop-color", "flood-color", "lighting-color", "color"];
    for (const attr of attrs) {
      if (entries.length >= MAX_LOG_ENTRIES) break;
      const attrValue = el.getAttribute(attr);
      if (attrValue && UNSAFE_COLOR_REGEX.test(attrValue)) {
        entries.push({
          node: buildNodeLabel(el),
          type: `attr:${attr}`,
          value: attrValue,
        });
      }
    }

    if (entries.length >= MAX_LOG_ENTRIES) break;
    const computed = window.getComputedStyle(el);
    for (let i = 0; i < computed.length; i += 1) {
      if (entries.length >= MAX_LOG_ENTRIES) break;
      const prop = computed[i];
      const value = computed.getPropertyValue(prop);
      if (value && UNSAFE_COLOR_REGEX.test(value)) {
        entries.push({
          node: buildNodeLabel(el),
          type: `computed:${prop}`,
          value,
        });
      }
    }
  }

  return entries;
};

const applyInlineSnapshotStyles = (root: HTMLElement) => {
  const originals = new Map<HTMLElement, string | null>();
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];

  elements.forEach((el, index) => {
    originals.set(el, el.getAttribute("style"));
    const computed = window.getComputedStyle(el);

    if (index === 0) {
      for (let i = 0; i < computed.length; i += 1) {
        const prop = computed[i];
        if (!prop.startsWith("--")) continue;
        const value = computed.getPropertyValue(prop);
        if (!value || !isUnsafeColor(value)) continue;
        const converted = convertUnsafeColor(value) ?? "#000000";
        el.style.setProperty(prop, converted);
      }
    }

    COLOR_PROPERTIES.forEach((prop) => {
      const value = computed.getPropertyValue(prop);
      if (!value || !isUnsafeColor(value)) return;
      const safeValue = sanitizeValue(prop, value);
      if (!safeValue) return;
      el.style.setProperty(prop, safeValue, computed.getPropertyPriority(prop));
    });

    if (el instanceof SVGElement) {
      const svgAttrs = ["fill", "stroke", "stop-color", "flood-color", "lighting-color", "color"];
      svgAttrs.forEach((attr) => {
        const attrValue = el.getAttribute(attr);
        if (attrValue && isUnsafeColor(attrValue)) {
          const converted = convertUnsafeColor(attrValue) ?? "#111827";
          el.setAttribute(attr, converted);
        }
      });
    }
  });

  return () => {
    originals.forEach((styleValue, el) => {
      if (styleValue === null) {
        el.removeAttribute("style");
      } else {
        el.setAttribute("style", styleValue);
      }
    });
  };
};

export async function exportElementToPdf(element: HTMLElement, options: ExportOptions): Promise<void> {
  const { fileName, scale = 2, backgroundColor = '#ffffff' } = options;

  if (!element) {
    throw new Error('PDF export target not found');
  }

  const unsafeEntries = scanUnsafeColors(element);
  if (unsafeEntries.length > 0) {
    console.group("PDF Export Preflight: Unsafe colors detected");
    console.warn(`Found ${unsafeEntries.length} entries with oklab/oklch/color-mix. Showing up to ${MAX_LOG_ENTRIES}.`);
    unsafeEntries.forEach((entry, index) => {
      console.warn(`#${index + 1}`, entry.node, entry.type, entry.value);
    });
    console.groupEnd();
  }

  const exportMarker = `pdf-export-${crypto.randomUUID()}`;
  element.setAttribute('data-pdf-export-root', exportMarker);

  const originalScroll = { x: window.scrollX, y: window.scrollY };
  window.scrollTo(0, 0);
  const restoreInlineStyles = applyInlineSnapshotStyles(element);
  const totalPixels = element.scrollWidth * element.scrollHeight;
  let effectiveScale = scale;
  if (totalPixels > 10_000_000) {
    effectiveScale = Math.min(effectiveScale, 1.5);
  }
  if (totalPixels > 20_000_000) {
    effectiveScale = Math.min(effectiveScale, 1.2);
  }

  try {
  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(element, {
      scale: effectiveScale,
      useCORS: true,
      backgroundColor,
      logging: false,
      windowWidth: element.scrollWidth,
      windowHeight: element.scrollHeight,
      ignoreElements: (el) => (el as HTMLElement).dataset?.html2canvasIgnore === 'true',
      onclone: (doc) => {
        const clonedRoot = doc.querySelector<HTMLElement>(`[data-pdf-export-root="${exportMarker}"]`);
        if (!clonedRoot) return;

        const cloneNodes = [clonedRoot, ...Array.from(clonedRoot.querySelectorAll<HTMLElement>("*"))];
        cloneNodes.forEach((cloneNode) => {
          if (cloneNode instanceof SVGElement) {
            const svgAttrs = ["fill", "stroke", "stop-color", "flood-color", "lighting-color", "color"];
            svgAttrs.forEach((attr) => {
              const attrValue = cloneNode.getAttribute(attr);
              if (attrValue && isUnsafeColor(attrValue)) {
                cloneNode.setAttribute(attr, "#111827");
              }
            });
          }

          const style = cloneNode.style;
          const props = Array.from(style);
          props.forEach((prop) => {
            const currentValue = style.getPropertyValue(prop);
            const sanitized = sanitizeValue(prop, currentValue);
            if (!sanitized) {
              style.removeProperty(prop);
            } else if (sanitized !== currentValue) {
              style.setProperty(prop, sanitized, style.getPropertyPriority(prop));
            }
          });
        });
      },
    });
  } catch (error) {
    console.error("PDF export failed during html2canvas render", error);
    throw error;
  }

    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position -= pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }

    pdf.save(fileName);
  } finally {
    restoreInlineStyles();
    window.scrollTo(originalScroll.x, originalScroll.y);
    element.removeAttribute('data-pdf-export-root');
  }
}
