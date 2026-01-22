import { useState } from 'react';
import { usePublicPricing } from '../utils/usePublicPricing';
import { motion, AnimatePresence } from 'motion/react';
import {
  TrendingUp,
  Palette,
  Type,
  Layout,
  Image as ImageIcon,
  FileText,
  CheckCircle,
  Copy,
  Check,
  Eye,
  Target,
  Heart,
  Zap,
  Shield,
  Lightbulb,
  Users,
  Download,
  Code,
  Sparkles,
  BookOpen,
  Layers,
  Settings,
  XCircle
} from 'lucide-react';

// Tab configuration
const tabs = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'components', label: 'Components', icon: Layers },
  { id: 'logo', label: 'Logo & Assets', icon: Sparkles },
  { id: 'guidelines', label: 'Usage Guidelines', icon: FileText }
];

// Color palette with interactive features
const colorPalette = [
  {
    category: 'Primary',
    colors: [
      {
        name: 'Deep Navy',
        variable: '--primary',
        hex: '#1e2875',
        rgb: 'rgb(30, 40, 117)',
        usage: 'Primary buttons, headers, CTAs',
        contrast: 'AAA'
      },
      {
        name: 'Primary Hover',
        variable: '--primary-hover',
        hex: '#16204f',
        rgb: 'rgb(22, 32, 79)',
        usage: 'Hover states for primary elements',
        contrast: 'AAA'
      }
    ]
  },
  {
    category: 'Secondary',
    colors: [
      {
        name: 'Teal Accent',
        variable: '--secondary',
        hex: '#14b8a6',
        rgb: 'rgb(20, 184, 166)',
        usage: 'Accents, highlights, premium badges',
        contrast: 'AA'
      }
    ]
  },
  {
    category: 'Semantic',
    colors: [
      {
        name: 'Success',
        variable: '--success',
        hex: '#10b981',
        rgb: 'rgb(16, 185, 129)',
        usage: 'Positive metrics, confirmations',
        contrast: 'AA'
      },
      {
        name: 'Warning',
        variable: '--warning',
        hex: '#f59e0b',
        rgb: 'rgb(245, 158, 11)',
        usage: 'Cautions, important alerts',
        contrast: 'AA'
      },
      {
        name: 'Destructive',
        variable: '--destructive',
        hex: '#ef4444',
        rgb: 'rgb(239, 68, 68)',
        usage: 'Errors, deletions, negative metrics',
        contrast: 'AA'
      }
    ]
  },
  {
    category: 'Neutrals',
    colors: [
      {
        name: 'Foreground',
        variable: '--foreground',
        hex: '#09090b',
        rgb: 'rgb(9, 9, 11)',
        usage: 'Primary text color',
        contrast: 'AAA'
      },
      {
        name: 'Muted',
        variable: '--muted',
        hex: '#f4f4f5',
        rgb: 'rgb(244, 244, 245)',
        usage: 'Backgrounds, subtle elements',
        contrast: 'N/A'
      },
      {
        name: 'Border',
        variable: '--border',
        hex: '#e4e4e7',
        rgb: 'rgb(228, 228, 231)',
        usage: 'Borders, dividers, separators',
        contrast: 'N/A'
      }
    ]
  }
];

// Copy to clipboard component
function CopyButton({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 rounded-md transition-colors group"
    >
      <span className="font-mono">{label || text}</span>
      {copied ? (
        <Check className="w-3 h-3 text-success" />
      ) : (
        <Copy className="w-3 h-3 text-neutral-500 group-hover:text-neutral-700" />
      )}
    </button>
  );
}

// Interactive Color Card
function ColorCard({ color }: { color: typeof colorPalette[0]['colors'][0] }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      onHoverStart={() => setShowDetails(true)}
      onHoverEnd={() => setShowDetails(false)}
      className="bg-white rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Color Swatch */}
      <div
        className="h-32 relative cursor-pointer group"
        style={{ backgroundColor: color.hex }}
      >
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 flex items-center justify-center"
            >
              <div className="text-white text-center">
                <div className="text-sm font-medium mb-2">Click to copy</div>
                <div className="flex gap-2 justify-center">
                  <CopyButton text={color.hex} />
                  <CopyButton text={color.rgb} label="RGB" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Color Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-bold text-foreground">{color.name}</h4>
          <span className="text-xs font-semibold px-2 py-0.5 bg-success/10 text-success rounded">
            {color.contrast}
          </span>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Variable</span>
            <CopyButton text={color.variable} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">HEX</span>
            <CopyButton text={color.hex} />
          </div>
        </div>

        <p className="text-xs text-neutral-600 leading-relaxed">{color.usage}</p>
      </div>
    </motion.div>
  );
}

// Code Snippet Component
function CodeSnippet({ code, language = 'css' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-neutral-900 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 border-b border-neutral-700">
        <span className="text-xs text-neutral-400 font-medium uppercase">{language}</span>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto">
        <code className="text-sm text-neutral-100 font-mono">{code}</code>
      </pre>
    </div>
  );
}

export default function InteractiveBrandGuidelines() {
  const [activeTab, setActiveTab] = useState('overview');
  const { priceLabel } = usePublicPricing();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-hover to-secondary text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="p-4 bg-white rounded-2xl shadow-xl">
                <TrendingUp className="w-12 h-12 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold">YieldPulse</h1>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Interactive Brand Guidelines</h2>
            <p className="text-lg text-white/90 mb-6">
              Explore our complete visual identity system with live examples, code snippets, and interactive demos
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span className="text-sm">Version 1.0 • Updated January 2025</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tab Navigation */}
      <div className="sticky top-16 z-40 bg-white border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-neutral-600 hover:text-foreground hover:border-neutral-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-primary/10 rounded-xl">
                      <Target className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">Mission</h3>
                      <p className="text-neutral-700 leading-relaxed">
                        To democratize institutional-grade property investment analysis for UAE investors by 
                        providing professional ROI calculations and 5-year projections at an accessible price point.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-secondary/10 rounded-xl">
                      <Eye className="w-6 h-6 text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-foreground mb-2">Vision</h3>
                      <p className="text-neutral-700 leading-relaxed">
                        To become the trusted standard for UAE property investment analysis, empowering every 
                        investor with data-driven insights that transform real estate decisions from guesswork into science.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Values */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Heart className="w-6 h-6 text-destructive" />
                  <h3 className="text-2xl font-bold text-foreground">Core Values</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { 
                      title: 'Transparency', 
                      desc: 'Every calculation is explained. No hidden assumptions, no black boxes.',
                      icon: Eye,
                      color: 'primary'
                    },
                    { 
                      title: 'Accuracy', 
                      desc: 'UAE-specific parameters ensure realistic, market-aligned projections.',
                      icon: Target,
                      color: 'secondary'
                    },
                    { 
                      title: 'Empowerment', 
                      desc: 'Give retail investors the tools that professionals use.',
                      icon: Zap,
                      color: 'warning'
                    },
                    { 
                      title: 'Integrity', 
                      desc: 'Clear disclaimers, realistic projections, no false promises.',
                      icon: Shield,
                      color: 'success'
                    },
                    { 
                      title: 'Innovation', 
                      desc: 'Continuously improving with cutting-edge technology.',
                      icon: Lightbulb,
                      color: 'chart-1'
                    },
                    { 
                      title: 'Accessibility', 
                      desc: 'Professional analysis at retail prices, available 24/7.',
                      icon: Users,
                      color: 'chart-2'
                    }
                  ].map((value, idx) => (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ y: -4 }}
                      className="p-6 bg-neutral-50 rounded-xl border border-border hover:border-primary/30 transition-all"
                    >
                      <div className={`inline-flex p-2 bg-${value.color}/10 rounded-lg mb-3`}>
                        <value.icon className={`w-5 h-5 text-${value.color}`} />
                      </div>
                      <h4 className="font-bold text-foreground mb-2">{value.title}</h4>
                      <p className="text-sm text-neutral-600">{value.desc}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Brand Personality */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-6">Brand Personality</h3>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      We Are:
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-neutral-700 flex items-start gap-2">
                        <span className="text-success font-bold">✓</span>
                        <span>Expert but approachable (trusted advisor, not salesperson)</span>
                      </li>
                      <li className="text-neutral-700 flex items-start gap-2">
                        <span className="text-success font-bold">✓</span>
                        <span>Confident but humble (provide data, you decide)</span>
                      </li>
                      <li className="text-neutral-700 flex items-start gap-2">
                        <span className="text-success font-bold">✓</span>
                        <span>Clear and direct (no jargon unless explained)</span>
                      </li>
                      <li className="text-neutral-700 flex items-start gap-2">
                        <span className="text-success font-bold">✓</span>
                        <span>Professional but warm</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-destructive" />
                      We Are Not:
                    </h4>
                    <ul className="space-y-2">
                      <li className="text-neutral-700 flex items-start gap-2">
                        <span className="text-destructive font-bold">✗</span>
                        <span>Overly technical or jargon-heavy</span>
                      </li>
                      <li className="text-neutral-700 flex items-start gap-2">
                        <span className="text-destructive font-bold">✗</span>
                        <span>Pushy or aggressive in sales messaging</span>
                      </li>
                      <li className="text-neutral-700 flex items-start gap-2">
                        <span className="text-destructive font-bold">✗</span>
                        <span>Making financial promises or guarantees</span>
                      </li>
                      <li className="text-neutral-700 flex items-start gap-2">
                        <span className="text-destructive font-bold">✗</span>
                        <span>Casual or unprofessional</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6">At a Glance</h3>
                <div className="grid sm:grid-cols-4 gap-6">
                  {[
                    { label: 'Premium Price', value: priceLabel, color: 'primary' },
                    { label: 'Weekly Users', value: '500+', color: 'secondary' },
                    { label: 'Analysis Time', value: '2 min', color: 'success' },
                    { label: 'Market Focus', value: 'UAE', color: 'warning' }
                  ].map((stat, idx) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-6 bg-neutral-50 rounded-xl border border-border"
                    >
                      <div className={`text-3xl font-bold text-${stat.color} mb-1`}>
                        {stat.value}
                      </div>
                      <div className="text-sm text-neutral-600">{stat.label}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Colors Tab */}
          {activeTab === 'colors' && (
            <motion.div
              key="colors"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-3xl font-bold text-foreground mb-2">Color System</h2>
                <p className="text-neutral-600 mb-6">
                  Hover over any color to see copy options. All colors meet WCAG accessibility standards.
                </p>

                {/* Color Palette */}
                <div className="space-y-8">
                  {colorPalette.map((category, idx) => (
                    <motion.div
                      key={category.category}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                    >
                      <h3 className="text-xl font-bold text-foreground mb-4">{category.category}</h3>
                      <div className={`grid gap-6 ${
                        category.colors.length === 1 ? 'sm:grid-cols-2 lg:grid-cols-3' : 
                        category.colors.length === 2 ? 'sm:grid-cols-2' :
                        'sm:grid-cols-2 lg:grid-cols-3'
                      }`}>
                        {category.colors.map((color) => (
                          <ColorCard key={color.name} color={color} />
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Usage Guidelines */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-6">60-30-10 Color Rule</h3>
                <p className="text-neutral-700 mb-6">
                  Maintain visual balance in your designs by following this proven color distribution:
                </p>
                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-neutral-100 rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-neutral-700 mb-2">60%</div>
                    <div className="font-semibold text-foreground mb-1">Neutrals</div>
                    <p className="text-sm text-neutral-600">Backgrounds, containers</p>
                  </div>
                  <div className="bg-primary rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-white mb-2">30%</div>
                    <div className="font-semibold text-white mb-1">Primary Navy</div>
                    <p className="text-sm text-white/80">Headers, CTAs, key elements</p>
                  </div>
                  <div className="bg-secondary rounded-lg p-6 text-center">
                    <div className="text-4xl font-bold text-white mb-2">10%</div>
                    <div className="font-semibold text-white mb-1">Teal Accent</div>
                    <p className="text-sm text-white/80">Highlights, accents</p>
                  </div>
                </div>
              </div>

              {/* CSS Variables */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-4">CSS Variables</h3>
                <p className="text-neutral-600 mb-6">
                  Use these CSS custom properties in your stylesheets for consistent theming:
                </p>
                <CodeSnippet
                  language="css"
                  code={`:root {
  /* Primary Colors */
  --primary: #1e2875;
  --primary-hover: #16204f;
  
  /* Secondary Colors */
  --secondary: #14b8a6;
  
  /* Semantic Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --destructive: #ef4444;
  
  /* Neutrals */
  --foreground: #09090b;
  --muted: #f4f4f5;
  --border: #e4e4e7;
}

/* Usage Example */
.primary-button {
  background-color: var(--primary);
  color: white;
}

.primary-button:hover {
  background-color: var(--primary-hover);
}`}
                />
              </div>
            </motion.div>
          )}

          {/* Typography Tab */}
          {activeTab === 'typography' && (
            <motion.div
              key="typography"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Font Family */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-3xl font-bold text-foreground mb-6">Typography System</h2>
                <div className="mb-8">
                  <div className="text-6xl font-bold text-primary mb-4">Inter</div>
                  <p className="text-lg text-neutral-600 mb-6">
                    Our primary typeface for all digital applications. Clean, modern, and highly legible.
                  </p>
                  <CodeSnippet
                    language="css"
                    code={`font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;`}
                  />
                </div>
              </div>

              {/* Type Scale - Live Examples */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6">Type Scale</h3>
                <div className="space-y-8">
                  {[
                    { name: 'Display', size: 'text-7xl', weight: 'font-bold', example: 'Hero Headlines', px: '72px' },
                    { name: 'H1', size: 'text-5xl', weight: 'font-bold', example: 'Page Titles', px: '48px' },
                    { name: 'H2', size: 'text-4xl', weight: 'font-semibold', example: 'Section Headers', px: '36px' },
                    { name: 'H3', size: 'text-3xl', weight: 'font-semibold', example: 'Subsection Titles', px: '30px' },
                    { name: 'H4', size: 'text-2xl', weight: 'font-semibold', example: 'Card Headers', px: '24px' },
                    { name: 'Body Large', size: 'text-xl', weight: 'font-normal', example: 'Introduction Text', px: '20px' },
                    { name: 'Body', size: 'text-base', weight: 'font-normal', example: 'Default Body Text', px: '16px' },
                    { name: 'Small', size: 'text-sm', weight: 'font-normal', example: 'Captions & Labels', px: '14px' }
                  ].map((type, idx) => (
                    <motion.div
                      key={type.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-border pb-6 last:border-0"
                    >
                      <div className="flex items-baseline justify-between mb-3">
                        <span className="font-semibold text-neutral-600">{type.name}</span>
                        <span className="text-sm text-neutral-500">{type.px}</span>
                      </div>
                      <p className={`${type.size} ${type.weight} text-foreground`}>
                        {type.example}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Font Weights */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6">Font Weights</h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { weight: '400', name: 'Normal', class: 'font-normal', usage: 'Body text' },
                    { weight: '500', name: 'Medium', class: 'font-medium', usage: 'Labels' },
                    { weight: '600', name: 'Semibold', class: 'font-semibold', usage: 'Subheadings' },
                    { weight: '700', name: 'Bold', class: 'font-bold', usage: 'Headlines' }
                  ].map((fw, idx) => (
                    <motion.div
                      key={fw.weight}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-neutral-50 rounded-xl p-6 border border-border text-center"
                    >
                      <div className={`text-5xl ${fw.class} mb-3`}>Aa</div>
                      <div className="font-semibold text-foreground mb-1">{fw.name}</div>
                      <div className="text-xs font-mono text-neutral-600 mb-2">{fw.weight}</div>
                      <div className="text-xs text-neutral-500">{fw.usage}</div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Components Tab */}
          {activeTab === 'components' && (
            <motion.div
              key="components"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Buttons */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-3xl font-bold text-foreground mb-6">Interactive Components</h2>
                
                <div className="space-y-8">
                  {/* Button Styles */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-4">Buttons</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Primary */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Primary</h4>
                        <div className="flex flex-wrap gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors shadow-md"
                          >
                            Primary Action
                          </motion.button>
                          <button className="px-6 py-3 bg-primary text-white rounded-lg font-medium opacity-50 cursor-not-allowed">
                            Disabled
                          </button>
                        </div>
                        <CodeSnippet
                          language="css"
                          code={`className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover"`}
                        />
                      </div>

                      {/* Secondary */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Secondary</h4>
                        <div className="flex flex-wrap gap-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-6 py-3 bg-white border-2 border-border text-neutral-700 rounded-lg font-medium hover:bg-neutral-50 transition-colors"
                          >
                            Secondary Action
                          </motion.button>
                          <button className="px-6 py-3 bg-white border-2 border-border text-neutral-700 rounded-lg font-medium opacity-50 cursor-not-allowed">
                            Disabled
                          </button>
                        </div>
                        <CodeSnippet
                          language="css"
                          code={`className="px-6 py-3 bg-white border-2 border-border text-neutral-700 rounded-lg font-medium hover:bg-neutral-50"`}
                        />
                      </div>

                      {/* Success */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Success</h4>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-success text-white rounded-lg font-medium hover:bg-success/90 transition-colors"
                        >
                          Confirm Action
                        </motion.button>
                        <CodeSnippet
                          language="css"
                          code={`className="px-6 py-3 bg-success text-white rounded-lg font-medium hover:bg-success/90"`}
                        />
                      </div>

                      {/* Destructive */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Destructive</h4>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-6 py-3 bg-destructive text-white rounded-lg font-medium hover:bg-destructive/90 transition-colors"
                        >
                          Delete Action
                        </motion.button>
                        <CodeSnippet
                          language="css"
                          code={`className="px-6 py-3 bg-destructive text-white rounded-lg font-medium hover:bg-destructive/90"`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Button Sizes */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-4">Button Sizes</h3>
                    <div className="flex flex-wrap items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-1.5 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary-hover transition-colors"
                      >
                        Small
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover transition-colors"
                      >
                        Medium (Default)
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-8 py-4 bg-primary text-white rounded-lg font-medium text-lg hover:bg-primary-hover transition-colors"
                      >
                        Large
                      </motion.button>
                    </div>
                  </div>

                  {/* Cards */}
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-4">Cards</h3>
                    <div className="grid sm:grid-cols-2 gap-6">
                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-white rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <TrendingUp className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground mb-1">Feature Card</h4>
                            <p className="text-sm text-neutral-600">
                              Standard card layout for features and content sections
                            </p>
                          </div>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ y: -4 }}
                        className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl p-6 border border-primary/20 hover:shadow-md transition-all"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="p-2 bg-secondary/20 rounded-lg">
                            <Sparkles className="w-6 h-6 text-secondary" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground mb-1">Premium Card</h4>
                            <p className="text-sm text-neutral-600">
                              Highlighted card with gradient background for premium features
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Elements */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6">Form Elements</h3>
                <div className="max-w-md space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Text Input
                    </label>
                    <input
                      type="text"
                      placeholder="Enter value..."
                      className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Select Dropdown
                    </label>
                    <select className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors">
                      <option>Choose an option...</option>
                      <option>Option 1</option>
                      <option>Option 2</option>
                      <option>Option 3</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Textarea
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Enter description..."
                      className="w-full px-4 py-3 border-2 border-border rounded-lg focus:border-primary focus:outline-none transition-colors resize-none"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Logo & Assets Tab */}
          {activeTab === 'logo' && (
            <motion.div
              key="logo"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Primary Logo */}
              <div className="bg-white rounded-2xl p-12 border border-border shadow-sm text-center">
                <h2 className="text-3xl font-bold text-foreground mb-8">Primary Logo</h2>
                <div className="flex items-center justify-center gap-4 mb-8">
                  <div className="p-6 bg-gradient-to-br from-primary to-primary-hover rounded-2xl shadow-lg">
                    <TrendingUp className="w-16 h-16 text-white" />
                  </div>
                  <span className="text-5xl font-bold text-primary">YieldPulse</span>
                </div>
                <p className="text-neutral-600 mb-6">Full horizontal logo - Primary use case</p>
              </div>

              {/* Logo Variations */}
              <div className="grid sm:grid-cols-3 gap-6">
                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl p-8 border border-border text-center shadow-sm hover:shadow-md transition-all"
                >
                  <div className="mb-6 flex justify-center">
                    <div className="p-4 bg-gradient-to-br from-primary to-primary-hover rounded-xl">
                      <TrendingUp className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <h4 className="font-bold text-foreground mb-2">Icon Only</h4>
                  <p className="text-sm text-neutral-600">For small spaces, favicons</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-xl p-8 border border-border text-center shadow-sm hover:shadow-md transition-all"
                >
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-primary">YieldPulse</span>
                  </div>
                  <h4 className="font-bold text-foreground mb-2">Wordmark Only</h4>
                  <p className="text-sm text-neutral-600">For text-heavy contexts</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -4 }}
                  className="bg-neutral-900 rounded-xl p-8 text-center shadow-sm hover:shadow-md transition-all"
                >
                  <div className="mb-6 flex justify-center items-center gap-3">
                    <div className="p-3 bg-white rounded-lg">
                      <TrendingUp className="w-8 h-8 text-primary" />
                    </div>
                    <span className="text-2xl font-bold text-white">YieldPulse</span>
                  </div>
                  <h4 className="font-bold text-white mb-2">White on Dark</h4>
                  <p className="text-sm text-neutral-400">For dark backgrounds</p>
                </motion.div>
              </div>

              {/* Usage Guidelines */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6">Logo Usage Guidelines</h3>
                
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Minimum Sizes</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="bg-neutral-50 rounded-lg p-6 border border-border">
                        <div className="flex items-center gap-2 mb-3">
                          <div className="p-2 bg-gradient-to-br from-primary to-primary-hover rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-lg font-bold text-primary">YieldPulse</span>
                        </div>
                        <p className="text-sm text-neutral-600">Horizontal: 120px minimum width</p>
                      </div>
                      <div className="bg-neutral-50 rounded-lg p-6 border border-border text-center">
                        <div className="flex justify-center mb-3">
                          <div className="p-2 bg-gradient-to-br from-primary to-primary-hover rounded-lg">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <p className="text-sm text-neutral-600">Icon only: 32px minimum</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-destructive" />
                      Don't Do This
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { rule: "Don't rotate or skew", desc: "Keep logo orientation locked" },
                        { rule: "Don't change colors", desc: "Use only approved brand colors" },
                        { rule: "Don't add effects", desc: "No drop shadows, glows, or gradients" },
                        { rule: "Don't stretch", desc: "Maintain original proportions" }
                      ].map((item) => (
                        <div key={item.rule} className="bg-destructive/5 rounded-lg p-4 border border-destructive/20">
                          <p className="text-sm font-semibold text-destructive mb-1">{item.rule}</p>
                          <p className="text-xs text-neutral-600">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Usage Guidelines Tab */}
          {activeTab === 'guidelines' && (
            <motion.div
              key="guidelines"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {/* Accessibility */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h2 className="text-3xl font-bold text-foreground mb-6">Accessibility Standards</h2>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'WCAG 2.1 Level AA',
                      desc: 'All interfaces meet Web Content Accessibility Guidelines',
                      icon: CheckCircle
                    },
                    {
                      title: 'Keyboard Navigation',
                      desc: 'Full functionality available via keyboard',
                      icon: CheckCircle
                    },
                    {
                      title: 'Screen Reader Support',
                      desc: 'Semantic HTML and ARIA labels throughout',
                      icon: CheckCircle
                    },
                    {
                      title: 'Color Contrast',
                      desc: 'Minimum 4.5:1 ratio for all text',
                      icon: CheckCircle
                    },
                    {
                      title: 'Responsive Design',
                      desc: 'Adapts gracefully across all devices',
                      icon: CheckCircle
                    },
                    {
                      title: 'Focus Indicators',
                      desc: 'Clear visual focus states for navigation',
                      icon: CheckCircle
                    }
                  ].map((item, idx) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg border border-border"
                    >
                      <item.icon className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold text-foreground mb-1">{item.title}</h4>
                        <p className="text-sm text-neutral-600">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Writing Style */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6">Writing Style & Tone</h3>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-success" />
                      Do:
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Use active voice',
                        'Be concise and clear',
                        'Explain technical terms',
                        'Use data to support claims',
                        'Include disclaimers where needed',
                        'Address the user directly'
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-neutral-700">
                          <span className="text-success font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                      <XCircle className="w-5 h-5 text-destructive" />
                      Don't:
                    </h4>
                    <ul className="space-y-3">
                      {[
                        'Use passive voice unnecessarily',
                        'Make guarantees or promises',
                        'Use excessive jargon',
                        'Be overly casual or formal',
                        'Hide important information',
                        'Use industry buzzwords'
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2 text-neutral-700">
                          <span className="text-destructive font-bold">✗</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Layout Principles */}
              <div className="bg-white rounded-2xl p-8 border border-border shadow-sm">
                <h3 className="text-2xl font-bold text-foreground mb-6">Layout Principles</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Spacing Scale</h4>
                    <div className="flex flex-wrap gap-2">
                      {['4px', '8px', '12px', '16px', '24px', '32px', '48px', '64px'].map((space) => (
                        <div
                          key={space}
                          className="px-4 py-2 bg-primary/10 text-primary rounded-lg font-mono text-sm font-semibold"
                        >
                          {space}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Content Widths</h4>
                    <div className="space-y-2 text-neutral-700">
                      <p>• Main layouts: <strong>1280px maximum</strong></p>
                      <p>• Reading content: <strong>720px maximum</strong></p>
                      <p>• Form containers: <strong>480px maximum</strong></p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Responsive Breakpoints</h4>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        { name: 'Mobile', size: '320px+' },
                        { name: 'Tablet', size: '768px+' },
                        { name: 'Desktop', size: '1024px+' }
                      ].map((bp) => (
                        <div key={bp.name} className="p-4 bg-neutral-50 rounded-lg border border-border text-center">
                          <div className="font-bold text-foreground mb-1">{bp.name}</div>
                          <div className="text-sm font-mono text-neutral-600">{bp.size}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Brand Applications */}
              <div className="bg-gradient-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 border border-primary/20">
                <h3 className="text-2xl font-bold text-foreground mb-6">Brand Applications</h3>
                <p className="text-neutral-700 mb-6">
                  Apply these brand guidelines consistently across all touchpoints:
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { name: 'Website & Web App', icon: Layout },
                    { name: 'Mobile Apps', icon: Smartphone },
                    { name: 'Email Templates', icon: Mail },
                    { name: 'PDF Reports', icon: FileText },
                    { name: 'Social Media', icon: Users },
                    { name: 'Marketing Materials', icon: ImageIcon },
                    { name: 'Presentations', icon: Monitor },
                    { name: 'Documentation', icon: BookOpen }
                  ].map((app, idx) => (
                    <motion.div
                      key={app.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ scale: 1.05 }}
                      className="bg-white rounded-lg p-4 border border-border text-center"
                    >
                      <app.icon className="w-8 h-8 text-primary mx-auto mb-2" />
                      <p className="text-sm font-medium text-foreground">{app.name}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-primary via-primary-hover to-secondary text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white rounded-xl">
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <span className="text-3xl font-bold">YieldPulse</span>
          </div>
          <p className="text-white/90 mb-2">Interactive Brand Guidelines v1.0</p>
          <p className="text-sm text-white/70">
            © 2025 YieldPulse. All rights reserved. • For internal use only
          </p>
        </div>
      </footer>
    </div>
  );
}
