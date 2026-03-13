# Design Specifications: OptimaAds Boutique Light

## 🎨 Color Palette
| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Background | #FAFAFA | --bg-main | Main page background |
| Surface | #FFFFFF | --bg-surface | Cards, modals, panels |
| Primary (Indigo) | #4F46E5 | --primary | Buttons, primary icons, accents |
| Primary Dark | #4338CA | --primary-dark | Hover states |
| Border | #F1F1F4 | --border-light | Card and input borders |
| Text Primary | #09090B | --text-main | Main titles and body text |
| Text Muted | #71717A | --text-muted | Secondary info, captions |
| Positive | #10B981 | --color-success | Success badges, growth stats |
| Warning | #F59E0B | --color-warning | Warnings, QS fixable |
| Negative | #E11D48 | --color-error | Critical alerts, QS low |

## 📝 Typography
- **Primary Font:** Inter (Fallback: sans-serif)
- **H1:** 32px | Bold | tracking-tight
- **H2:** 24px | Simple Bold
- **Body:** 14px | Normal | leading-relaxed
- **Mono:** JetBrains Mono (For data/IDs)

## 📐 Spacing & Radius
- **Border Radius:** 16px (`rounded-2xl`) for everything.
- **Inner Padding:** 24px (`p-6`) for cards.
- **Section Spacing:** 32px (`gap-8`).

## 🌫️ Shadows
- **Card Shadow:** `shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.04)]` (Very subtle)
- **Hover Shadow:** `hover:shadow-[0_8px_30px_rgb(0,0,0,12%)]` (Elevated feel)

## ✨ UI Components
- **Buttons:** Fully rounded or `rounded-xl`. Subtle gradients `bg-gradient-to-tr from-indigo-600 to-indigo-500`.
- **Badges:** Pastel backgrounds with high-contrast text.
- **Charts:** Vibrant indigo line with a soft translucent area fill.
