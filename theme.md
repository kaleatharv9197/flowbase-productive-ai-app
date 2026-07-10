# Cozy Notion-Miro Hybrid: Design Theme & Guidelines

Welcome to the design system for our cozy, Notion-Miro hybrid productivity app. Our goal is to balance Notion's clean, minimalist layout with Miro's playful, creative, and visually rich canvas element, wrapped in a warm, inviting, and cozy atmosphere.

## 🎨 Cozy Color Palette

Our palette moves away from harsh pure whites and blues, opting for warmer tones, soft pastel highlights, and tactile separator colors.

### Base Colors
- **Page Background (`--cozy-bg`)**: `#FAF8F5` (Oatmeal Cream / Warm Warm White)
  - Dark Mode: `#1C1A19` (Warm Charcoal)
- **Sidebar & Card Background (`--cozy-card`)**: `#FFFFFF`
  - Dark Mode: `#262322` (Warm Soft Black)
- **Primary Text (`--cozy-text-primary`)**: `#322F2E` (Deep Cocoa / Soft Gray-Black)
  - Dark Mode: `#EBE6E4` (Warm Cream White)
- **Muted Text (`--cozy-text-muted`)**: `#857D7A` (Soft Clay Gray)
  - Dark Mode: `#A19794` (Muted Warm Gray)
- **Primary Brand Accent (`--cozy-primary`)**: `#7B6256` (Warm Earthy Cocoa)
- **Soft Border/Divider (`--cozy-border`)**: `#EBE6DF` (Soft Warm Beige)
  - Dark Mode: `#383331` (Dark Clay Border)

### Colorful Icon Badges (Cozy Accent Palette)
To fulfill the requirement for colorful icons, each sidebar icon will have its own soft, glowing background pill and warm colored icon:

| Page / Navigation | Icon Color | Background Pill Color | Feel |
|---|---|---|---|
| **Dashboard** | `#4A7C70` (Sage) | `#E2ECE9` | Grounded, calm |
| **AI Assistant** | `#8E75C4` (Lavender) | `#F0EBF8` | Magical, creative |
| **Calendar** | `#D36A73` (Rose Coral) | `#F9EAEB` | Welcoming, structured |
| **Task / Kanban** | `#D8A035` (Amber Gold) | `#FBF3DB` | Bright, encouraging |
| **Notes** | `#4285F4` (Soft Blue) | `#E8F0FE` | Focused, clean |
| **Whiteboard** | `#E07A5F` (Terracotta) | `#FCECE7` | Creative, active |
| **Pages / Spaces** | `#5F9E77` (Mint Moss) | `#EAF5E9` | Organized, growing |
| **AI Template Builder**| `#D95B96` (Warm Pink) | `#FCEAF3` | Playful, productive |
| **Settings** | `#71717A` (Slate Gray) | `#F1F1F4` | Balanced, functional |

---

## ✍️ Typography

We use rounded, friendly, yet highly legible sans-serif and soft serif typography:
- **Primary Sans**: `Inter`, or system UI default.
- **Cozy Headers (optional)**: `Outfit` or a soft humanist font for badges/hero states.
- **Letter Spacing**: `-0.01em` on headers for a modern, compact look.
- **Sizing Hierarchy**:
  - `h1`: `2.25rem` (36px) — bold, warm.
  - `h2`: `1.5rem` (24px) — semibold, clean.
  - `h3`: `1.125rem` (18px) — medium.
  - `body`: `0.9375rem` (15px) — cozy readability (slightly larger line height: `1.6`).

---

## 📐 Spacing & Layout Constraints

- **Border Radius**: Warm, extremely rounded corners.
  - Cards, modals, sidebars: `16px` (`rounded-2xl` or `1rem`)
  - Buttons, items: `10px` (`rounded-xl` or `0.625rem`)
- **Spacing Steps**: Focus on spacious padding to feel relaxed, not cramped.
  - Grid Gap: `1.5rem` (24px)
  - Card Inner Padding: `1.5rem` (24px)
  - Sidebar Padding: `1rem` (16px)

---

## ✨ Cozy Micro-Animations
- Hover transition: `all 0.2s cubic-bezier(0.4, 0, 0.2, 1)`
- Sidebar collapse width animation: `width 0.3s cubic-bezier(0.4, 0, 0.2, 1)`
- Scale on hover for interactive badges: `hover:scale-102`
