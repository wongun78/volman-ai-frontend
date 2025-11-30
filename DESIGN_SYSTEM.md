# Dark Premium Minimalist Design System

> Bloomberg Terminal aesthetic for professional trading interface

## 🎨 Color Palette

### Background Colors
```css
--bg-primary: #0d0f14        /* Deep black - main background */
--bg-secondary: #12141a      /* Slightly lighter - cards/panels */
--bg-tertiary: #1a1c24       /* Even lighter - hover states */
```

### Text Colors
```css
--text-primary: #e2e8f0      /* slate-200 - Main text */
--text-secondary: #cbd5e1    /* slate-300 - Secondary text */
--text-muted: #94a3b8        /* slate-400 - Less important */
--text-subtle: #64748b       /* slate-500 - Very subtle */
--text-faint: #475569        /* slate-600 - Labels, captions */
--text-ghost: #334155        /* slate-700 - Disabled states */
```

### Accent Colors (Muted Professional)
```css
/* Primary - Muted Blue/Purple */
--primary: #7c8db5           /* Muted blue-purple */
--primary-light: #9ca8c8     /* Lighter variant */

/* Success - Muted Sage Green */
--success: #6b9080           /* Muted sage green for LONG/profit */

/* Danger - Muted Rose */
--danger: #a16e7c            /* Muted rose for SHORT/loss */

/* Neutral - Very subtle */
--neutral: rgba(255, 255, 255, 0.02)  /* white/2 */
```

### Opacity Scale (white based)
```css
white/1   = rgba(255, 255, 255, 0.01)
white/2   = rgba(255, 255, 255, 0.02)
white/3   = rgba(255, 255, 255, 0.03)
white/5   = rgba(255, 255, 255, 0.05)
white/10  = rgba(255, 255, 255, 0.10)
white/20  = rgba(255, 255, 255, 0.20)
```

---

## 📐 Layout & Spacing

### Container
```css
max-width: 1280px (7xl)
padding: 1rem (mobile) → 1.5rem (tablet) → 2rem (desktop)
```

### Card/Panel Pattern
```css
.card-shadow {
  background: rgba(18, 20, 26, 0.6);  /* bg-[#12141a]/60 */
  border: 1px solid rgba(255, 255, 255, 0.05);  /* border-white/5 */
  padding: 1.5rem;  /* p-6 */
}
```

### Grid Layouts
```css
/* Stats Grid (4 columns) */
grid-template-columns: repeat(4, minmax(0, 1fr));
gap: 0.75rem;  /* gap-3 */

/* Form Grid (2 columns) */
grid-template-columns: repeat(2, minmax(0, 1fr));
gap: 1.25rem;  /* gap-5 */
```

---

## 🔤 Typography

### Font Family
```css
font-family: system-ui, -apple-system, sans-serif;  /* System default */
font-family: ui-monospace, monospace;  /* For code/numbers */
```

### Font Sizes
```css
--text-xs: 0.75rem      /* 12px - Small labels */
--text-sm: 0.875rem     /* 14px - Body text */
--text-base: 1rem       /* 16px - Default */
--text-lg: 1.125rem     /* 18px - Headings */
--text-xl: 1.25rem      /* 20px - Large headings */
```

### Font Weights
```css
--font-normal: 400      /* Regular text */
--font-medium: 500      /* Emphasized text */
--font-semibold: 600    /* Headings */
```

### Label Pattern (Uppercase Small)
```css
.label {
  font-size: 0.625rem;           /* text-[10px] */
  color: #64748b;                /* text-slate-600 */
  letter-spacing: 0.1em;         /* tracking-widest */
  text-transform: uppercase;
  font-weight: 400;              /* font-normal */
}
```

---

## 🧩 Component Patterns

### 1. Card Component
```tsx
<div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
  {/* Content */}
</div>
```

### 2. Data Display Card
```tsx
<div className="bg-white/1 p-4 border border-white/5">
  <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-2">
    Label
  </div>
  <div className="text-lg font-medium text-slate-300">
    Value
  </div>
</div>
```

### 3. Button (Primary)
```tsx
<button className="px-6 py-3 bg-[#7c8db5]/15 hover:bg-[#7c8db5]/25 
                   border border-[#7c8db5]/20 text-[#9ca8c8] 
                   text-sm font-medium tracking-wide transition-all">
  Button Text
</button>
```

### 4. Input Field
```tsx
<input className="w-full px-4 py-2.5 bg-white/1 border border-white/5 
                  text-slate-300 text-sm focus:outline-none 
                  focus:border-[#7c8db5]/30 transition-all" />
```

### 5. Direction Badge
```tsx
/* LONG */
<span className="px-3 py-1 bg-[#6b9080]/10 text-[#6b9080] 
                 border border-[#6b9080]/20 text-xs font-medium tracking-wide">
  LONG
</span>

/* SHORT */
<span className="px-3 py-1 bg-[#a16e7c]/10 text-[#a16e7c] 
                 border border-[#a16e7c]/20 text-xs font-medium tracking-wide">
  SHORT
</span>

/* NEUTRAL */
<span className="px-3 py-1 bg-white/2 text-slate-500 
                 border border-white/5 text-xs font-medium tracking-wide">
  NEUTRAL
</span>
```

### 6. Table Pattern
```tsx
<table className="w-full text-sm">
  <thead className="border-b border-white/5">
    <tr className="text-left text-slate-600">
      <th className="pb-3 font-normal text-[10px] tracking-widest uppercase">
        Column
      </th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-white/3">
      <td className="py-3 text-slate-300">Data</td>
    </tr>
  </tbody>
</table>
```

---

## 🎭 Special Effects

### Background Texture Overlay
```css
.texture-overlay {
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(255, 255, 255, 0.01) 2px,
      rgba(255, 255, 255, 0.01) 4px
    );
}
```

### Subtle Grid Background
```css
.grid-bg {
  background-image: 
    linear-gradient(rgba(255, 255, 255, 0.01) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.01) 1px, transparent 1px);
  background-size: 24px 24px;
}
```

### Card Shadow (Subtle)
```css
.card-shadow {
  box-shadow: 
    0 1px 2px 0 rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(255, 255, 255, 0.02);
}
```

---

## 🚫 Design Constraints (NEVER USE)

### ❌ Forbidden Elements
- ❌ Rounded corners (`rounded-md`, `rounded-lg`) - USE SHARP RECTANGLES
- ❌ Gradients (`bg-gradient-to-r`) - USE SOLID COLORS
- ❌ Animations (`animate-pulse`, `transition-transform`) - STATIC ONLY
- ❌ Bright neon colors (`bg-cyan-500`, `text-purple-400`) - USE MUTED TONES
- ❌ Icons/emojis (unless absolutely necessary) - TEXT ONLY
- ❌ Drop shadows (`shadow-lg`) - USE SUBTLE BORDERS

### ✅ Always Use Instead
- ✅ Sharp rectangles (no border-radius)
- ✅ Muted colors with transparency
- ✅ Subtle borders (white/1 to white/5)
- ✅ Uppercase labels with wide tracking
- ✅ Minimal hover states (opacity/background changes only)

---

## 📱 Responsive Breakpoints

```css
sm:  640px   /* Tablet */
md:  768px   /* Small desktop */
lg:  1024px  /* Desktop */
xl:  1280px  /* Large desktop */
```

### Mobile-First Pattern
```tsx
className="
  text-xs        /* Mobile: 12px */
  sm:text-sm     /* Tablet: 14px */
  lg:text-base   /* Desktop: 16px */
"
```

---

## 🎯 Complete Page Example

```tsx
export function ExamplePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
          Section
        </div>
        <h1 className="text-xl font-semibold text-slate-200">Page Title</h1>
      </div>

      {/* Main Content Card */}
      <div className="card-shadow bg-[#12141a]/60 border border-white/5 p-6">
        {/* Card Header */}
        <div className="mb-6">
          <div className="text-[10px] text-slate-600 mb-2 tracking-widest uppercase">
            Card Title
          </div>
          <h2 className="text-base font-medium text-slate-300">Subtitle</h2>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/1 p-4 border border-white/5">
            <div className="text-[10px] text-slate-600 tracking-widest uppercase mb-2">
              Label
            </div>
            <div className="text-lg font-medium text-slate-300">
              Value
            </div>
          </div>
        </div>

        {/* Button */}
        <button className="mt-6 w-full px-6 py-3 bg-[#7c8db5]/15 hover:bg-[#7c8db5]/25 
                           border border-[#7c8db5]/20 text-[#9ca8c8] text-sm 
                           font-medium tracking-wide transition-all">
          Action Button
        </button>
      </div>
    </div>
  );
}
```

---

## 🔧 TailwindCSS Config

```js
// tailwind.config.js (for reference)
export default {
  theme: {
    extend: {
      colors: {
        // Custom colors already in default palette
      },
    },
  },
}
```

---

## 📝 Usage Rules

### DO ✅
- Use `bg-[#12141a]/60` for cards
- Use `border-white/5` for subtle borders
- Use `text-slate-300` for main text
- Use uppercase labels with `tracking-widest`
- Use `transition-all` for smooth state changes
- Use monospace font (`font-mono`) for numbers/code

### DON'T ❌
- Don't use bright colors (`bg-blue-500`)
- Don't use rounded corners
- Don't use gradients
- Don't use heavy shadows
- Don't use animations (except simple transitions)
- Don't use decorative elements

---

## 🎨 Quick Copy-Paste Classes

```css
/* Card Container */
card-shadow bg-[#12141a]/60 border border-white/5 p-6

/* Section Header */
text-[10px] text-slate-600 mb-2 tracking-widest uppercase

/* Data Value */
text-lg font-medium text-slate-300

/* Input */
w-full px-4 py-2.5 bg-white/1 border border-white/5 text-slate-300 text-sm focus:outline-none focus:border-[#7c8db5]/30 transition-all

/* Button Primary */
px-6 py-3 bg-[#7c8db5]/15 hover:bg-[#7c8db5]/25 border border-[#7c8db5]/20 text-[#9ca8c8] text-sm font-medium tracking-wide transition-all

/* Button Danger */
px-6 py-3 bg-[#a16e7c]/15 hover:bg-[#a16e7c]/25 border border-[#a16e7c]/20 text-[#a16e7c] text-sm font-medium tracking-wide transition-all

/* Badge LONG */
px-3 py-1 bg-[#6b9080]/10 text-[#6b9080] border border-[#6b9080]/20 text-xs font-medium tracking-wide

/* Badge SHORT */
px-3 py-1 bg-[#a16e7c]/10 text-[#a16e7c] border border-[#a16e7c]/20 text-xs font-medium tracking-wide

/* Data Card */
bg-white/1 p-4 border border-white/5

/* Table Header */
border-b border-white/5 text-left text-slate-600 pb-3 font-normal text-[10px] tracking-widest uppercase

/* Table Row */
border-b border-white/3 py-3 text-slate-300
```

---

## 🌟 Brand Identity

**Name**: Volman AI - Price Action Terminal  
**Aesthetic**: Bloomberg Terminal meets minimal design  
**Feeling**: Professional, precise, no-nonsense trading tool  
**Inspiration**: Financial terminals, command-line interfaces, data dashboards  

**NOT**: Flashy crypto exchange, colorful fintech app, gamified trading  
**YES**: Serious trader's tool, professional analysis platform, technical terminal
