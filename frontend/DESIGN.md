---
name: Stationery & Ink
colors:
  surface: '#fefbd0'
  surface-dim: '#dfdcb2'
  surface-bright: '#fefbd0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f9f6ca'
  surface-container: '#f3f0c5'
  surface-container-high: '#edeac0'
  surface-container-highest: '#e7e4ba'
  on-surface: '#1d1d03'
  on-surface-variant: '#43474b'
  inverse-surface: '#323215'
  inverse-on-surface: '#f6f3c8'
  outline: '#73777b'
  outline-variant: '#c3c7cb'
  surface-tint: '#51606b'
  primary: '#202f38'
  on-primary: '#ffffff'
  primary-container: '#36454f'
  on-primary-container: '#a2b2be'
  inverse-primary: '#b9c9d5'
  secondary: '#60603e'
  on-secondary: '#ffffff'
  secondary-container: '#e6e5b9'
  on-secondary-container: '#666643'
  tertiary: '#1c2f3b'
  on-tertiary: '#ffffff'
  tertiary-container: '#324552'
  on-tertiary-container: '#9eb2c1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d5e5f1'
  primary-fixed-dim: '#b9c9d5'
  on-primary-fixed: '#0e1d26'
  on-primary-fixed-variant: '#3a4953'
  secondary-fixed: '#e6e5b9'
  secondary-fixed-dim: '#cac99f'
  on-secondary-fixed: '#1d1d03'
  on-secondary-fixed-variant: '#484828'
  tertiary-fixed: '#d1e5f5'
  tertiary-fixed-dim: '#b5c9d8'
  on-tertiary-fixed: '#091e29'
  on-tertiary-fixed-variant: '#364956'
  background: '#fefbd0'
  on-background: '#1d1d03'
  surface-variant: '#e7e4ba'
typography:
  headline-lg:
    fontFamily: Noto Serif
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Noto Serif
    fontSize: 32px
    fontWeight: '400'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Newsreader
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Newsreader
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Newsreader
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1.4'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
  gutter: 24px
  margin: 32px
---

## Brand & Style
The design system is rooted in the tactile and intellectual world of analog correspondence. It evokes a sense of permanence, deliberation, and craftsmanship, targeting users who appreciate the "slow web" movement, archival quality, and personal expression. 

The aesthetic is a hybrid of **Tactile Skeuomorphism** and **Brutalism**. It rejects the digital perfection of smooth vectors in favor of human imperfection—sketchy lines, ink bleeds, and organic paper textures. The goal is to make the user feel as though they are interacting with a physical desk, where every interaction leaves a meaningful mark.

## Colors
The palette is strictly limited to mimic the physical constraints of ink and paper. 

- **Primary:** Charcoal Grey (#36454F), representing carbon ink. It is used for all "permanent" markings, including text, borders, and stamped states.
- **Background:** Off-white Cream (#FFFDD0), providing a warm, non-reflective surface that mimics aged, high-quality vellum.
- **Accents:** Tertiary charcoal shades are reserved for cross-hatching and depth, while a slightly deeper neutral cream is used for layered paper effects.

## Typography
Typography creates a contrast between personal authorship and mechanical record-keeping. 

- **Headlines:** Utilize a script-adjacent Serif (modeled as Noto Serif in this system) to simulate the flowing, expressive nature of a fountain pen. In implementation, use a font with high stroke contrast and ligatures.
- **Body & UI:** Utilize a monospaced or slab-serif typewriter font (Newsreader) to provide the utilitarian clarity of a manual typewriter. This font handles all functional data and long-form reading.
- **Styling:** Headings should occasionally feature a slight "ink bleed" text-shadow (0.5px blur) to enhance the realism of ink on porous paper.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy, reminiscent of a ledger or a letterhead. Content is centered within generous margins to create a sense of focus and calm. 

Spacing is rhythmic but slightly asymmetrical to avoid a sterile digital feel. Components should be spaced using increments of 8px, but their internal alignment may deviate slightly (1-2px) to accommodate the "hand-drawn" nature of the borders. Use wide gutters to ensure the paper texture remains visible between elements.

## Elevation & Depth
This design system eschews modern shadows and blurs. Instead, it utilizes traditional illustrative techniques to communicate hierarchy:

- **Cross-Hatching:** Depth is created by placing charcoal grey cross-hatched patterns behind elements. The denser the hatching, the "higher" the element sits or the more focus it requires.
- **Layering:** Elements appear to be "stacked" sheets of paper. Higher z-index elements use slightly darker cream backgrounds or thicker sketchy borders.
- **Ink Saturations:** Active or pressed states are indicated by "over-inking"—making the charcoal grey more saturated or slightly thicker, as if a stamp were pressed harder against the page.

## Shapes
The shape language is defined by the **Sketchy Border**. No container has a perfectly straight line or a mathematically perfect radius. 

- **Corners:** Generally sharp but "over-shot" where lines intersect, simulating a hand-drawn rectangle.
- **Stroke:** Use an SVG filter or a hand-drawn vector border with a variable stroke width (ranging from 1px to 2.5px) to create the imperfection of a physical pen stroke.
- **Texture:** All shapes must have a subtle noise or grain overlay to disrupt flat color fills.

## Components
- **Buttons (Stamped Ink):** Designed to look like physical rubber stamps. They feature a solid charcoal background with the text knocked out in cream. The edges should be irregular and "distressed," as if the ink didn't transfer perfectly. On hover, the "stamp" shifts slightly in position.
- **Input Fields:** No boxes. Use a single hand-drawn horizontal line (underline). When focused, the line is replaced by a double-strike or a thicker, darker sketchy line.
- **Cards:** Styled as separate sheets of paper or "Polaroids" with thick sketchy borders and a cross-hatch "shadow" in the bottom-right corner.
- **Chips/Tags:** Look like small pieces of masking tape or handwritten labels with jagged edges.
- **Lists:** Bullet points are replaced by hand-drawn "X" marks or ink blots.
- **Checkboxes:** Small hand-drawn squares that, when checked, are filled with a quick, sketchy "X" that slightly exceeds the boundaries of the box.
- **Progress Bars:** Represented by a series of tally marks or a single sketchy line that fills with a cross-hatch pattern as it progresses.