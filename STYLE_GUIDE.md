# Kastor Data Academy - UI Style Guide

## 🎨 Color Palette

### Primary Colors
- **Dark Navy (Background)**: `bg-[#1a1a2e]`
  Use for: Main backgrounds, dark sections

- **Medium Navy (Surfaces)**: `bg-[#1f2a40]`
  Use for: Cards, headers, elevated surfaces

- **Darker Surface**: `bg-[#2a2d3a]`
  Use for: Message bubbles, secondary cards

### Accent Colors
- **Cyan/Teal (Primary Accent)**: `#00d9ff`
  Use for: Primary buttons, highlights, links, stage titles
  Gradients: `from-[#00d9ff] to-[#00a6c7]`

- **Darker Cyan (Hover)**: `#00a6c7` to `#008ca8`
  Use for: Button hover states

### Text Colors
- **Primary Text**: `text-white`
- **Secondary Text**: `text-white/70` or `text-white/60`
- **Muted Text**: `text-white/40` or `text-[#b0b0b0]`
- **Accent Text**: `text-[#00d9ff]`

### Borders
- **Light Borders**: `border-white/10`
- **Medium Borders**: `border-white/20`
- **Accent Borders**: `border-[#00d9ff]`

### Backgrounds (Semi-transparent)
- **Light Overlay**: `bg-white/5`
- **Medium Overlay**: `bg-white/10`
- **Strong Overlay**: `bg-white/20`
- **Narrator/System**: `bg-[#2a2d3a]/50`

## 🧩 Component Patterns

### Buttons

#### Primary Button (Cyan Gradient)
```tsx
className="bg-gradient-to-r from-[#00d9ff] to-[#00a6c7] hover:from-[#00a6c7] hover:to-[#008ca8] text-[#1a1a2e] font-bold shadow-lg shadow-[#00d9ff]/20"
```

#### Secondary Button (Translucent White)
```tsx
className="bg-white/10 border border-white/20 text-white hover:bg-white/20"
```

#### Disabled Button
```tsx
className="bg-white/20 text-white/40 cursor-not-allowed"
```

### Cards

#### Main Card
```tsx
className="bg-[#1f2a40] border border-white/10 rounded-xl p-4"
```

#### Secondary Card
```tsx
className="bg-[#2a2d3a] border border-white/10 rounded-lg p-3"
```

### Input Fields

#### Text Input
```tsx
className="bg-white/5 border border-white/10 text-white placeholder:text-white/40 rounded-full px-4 py-2"
```

### Headers

#### Page Header
```tsx
className="bg-[#1f2a40] border-b border-white/10 px-4 py-3"
```

#### Title
```tsx
className="text-white font-semibold"
```

#### Subtitle
```tsx
className="text-[#00d9ff] text-xs"
```

### Chat Messages

#### Detective Message (Right Side)
```tsx
className="bg-gradient-to-br from-[#00d9ff] to-[#0097b2] text-white rounded-xl rounded-br-none px-4 py-3 shadow-[0_4px_12px_rgba(0,217,255,0.2)]"
```

#### NPC Message (Left Side)
```tsx
className="bg-[#2a2d3a] text-white rounded-xl rounded-bl-none px-4 py-3"
```

#### Narrator/System Message
```tsx
className="bg-[#2a2d3a]/50 border border-white/10 text-[#b0b0b0] px-4 py-3 rounded-xl"
```

### Modals

#### Modal Overlay
```tsx
className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
```

#### Modal Content
```tsx
className="bg-[#1f2a40] border border-white/10 rounded-2xl shadow-2xl p-6"
```

## 🎭 Animation & Effects

### Shadows
- **Light Shadow**: `shadow-md`
- **Cyan Glow**: `shadow-lg shadow-[#00d9ff]/20`
- **Strong Shadow**: `shadow-2xl`

### Hover Effects
- **Surface Hover**: `hover:bg-white/10`
- **Button Hover**: `hover:scale-1.02` (with Framer Motion)
- **Icon Hover**: `hover:text-white` (from `text-white/70`)

### Transitions
- **Standard**: `transition-colors` or `transition-all`
- **Duration**: Default Framer Motion or 200-300ms

## 📱 Responsive Considerations

- Use `px-4` on mobile, `px-6` on desktop
- Font sizes: `text-sm` on mobile, `text-base` on desktop
- Max widths: `max-w-md` for modals, `max-w-[90%]` for mobile content

## 🚫 AVOID (Old Light Theme Patterns)

❌ Don't use:
- `bg-white` → Use `bg-[#1f2a40]` or `bg-[#2a2d3a]`
- `bg-gray-50` or `bg-gray-100` → Use `bg-[#1a1a2e]`
- `bg-gray-200` → Use `bg-white/10`
- `text-gray-900` → Use `text-white`
- `text-gray-500` or `text-gray-600` → Use `text-white/60` or `text-white/70`
- `border-gray-200` or `border-gray-300` → Use `border-white/10` or `border-white/20`
- `bg-blue-500` → Use `bg-gradient-to-r from-[#00d9ff] to-[#00a6c7]`

## 📋 Component Checklist

When creating or updating a component, ensure:

1. ✅ Background uses dark navy palette (`#1a1a2e`, `#1f2a40`, `#2a2d3a`)
2. ✅ Text is white with appropriate opacity
3. ✅ Cyan accent (`#00d9ff`) is used for primary actions and highlights
4. ✅ Borders use `border-white/10` or `border-white/20`
5. ✅ Buttons follow the primary (cyan gradient) or secondary (translucent white) patterns
6. ✅ Hover states darken or add white overlay
7. ✅ Shadows use `shadow-[#00d9ff]/20` for cyan glow effects

## 🎯 Examples

### Good ✅
```tsx
<div className="bg-[#1f2a40] border border-white/10 rounded-xl p-4">
  <h2 className="text-white font-semibold mb-2">Title</h2>
  <p className="text-white/70 text-sm">Description</p>
  <button className="mt-4 bg-gradient-to-r from-[#00d9ff] to-[#00a6c7] text-[#1a1a2e] font-bold px-4 py-2 rounded-lg">
    Action
  </button>
</div>
```

### Bad ❌
```tsx
<div className="bg-white border border-gray-200 rounded-xl p-4">
  <h2 className="text-gray-900 font-semibold mb-2">Title</h2>
  <p className="text-gray-600 text-sm">Description</p>
  <button className="mt-4 bg-blue-500 text-white font-bold px-4 py-2 rounded-lg">
    Action
  </button>
</div>
```

---

**Last Updated**: 2025-11-12
**Maintained by**: Kastor Development Team
