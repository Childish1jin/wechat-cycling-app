# Cycling App Design System (v1.0)

## 1. Visual Style: "Eco-Modern Clean"
A clean, nature-inspired aesthetic focusing on readability and outdoor vibes.
- **Keywords**: Fresh, energetic, clarity, precision.
- **Modes**: Light (Day riding) / Dark (Night riding).

---

## 2. Color Palette

### Primary (Brand)
Used for primary actions, active states, and key highlights.
| Token | Light Hex | Dark Hex | Usage |
| :--- | :--- | :--- | :--- |
| `primary` | `#00C853` | `#4ADE80` | Main buttons, active tabs, route lines |
| `onPrimary` | `#FFFFFF` | `#000000` | Text on primary buttons |
| `primaryContainer` | `#DCFCE7` | `#064E3B` | Selected item background, subtle highlights |
| `onPrimaryContainer` | `#14532D` | `#D1FAE5` | Text on container |

### Neutral (Surface & Text)
| Token | Light Hex | Dark Hex | Usage |
| :--- | :--- | :--- | :--- |
| `background` | `#F3F4F6` | `#111827` | App background (scaffold) |
| `surface` | `#FFFFFF` | `#1F2937` | Cards, bottom sheets, dialogs |
| `onSurface` | `#1F2937` | `#F9FAFB` | Primary text, headings |
| `onSurfaceVariant` | `#6B7280` | `#9CA3AF` | Secondary text, icons, captions |
| `outline` | `#E5E7EB` | `#374151` | Dividers, card borders |

### Functional
| Token | Light Hex | Dark Hex | Usage |
| :--- | :--- | :--- | :--- |
| `error` | `#EF4444` | `#F87171` | Stop buttons, error messages |
| `warning` | `#F59E0B` | `#FBBF24` | Weak GPS signal, caution alerts |
| `success` | `#10B981` | `#34D399` | Completion, achievements |

---

## 3. Typography (Scale)

Base Font: System Default (San Francisco / Roboto)

| Category | Size (sp) | Weight | Line Height | Tracking | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Large** | 32 | Bold (700) | 40 | -0.5 | Main stats (Speed/Distance) |
| **Headline Medium** | 20 | SemiBold (600) | 28 | 0 | Page titles, Modal headers |
| **Title Medium** | 16 | Medium (500) | 24 | 0.15 | Card titles, List items |
| **Body Medium** | 14 | Regular (400) | 20 | 0.25 | Descriptions, feed text |
| **Label Small** | 12 | Medium (500) | 16 | 0.5 | Nav bar, badges, captions |

---

## 4. Spacing & Layout

### Grid System
- **Base Unit**: 4dp
- **Margins**: 16dp (Mobile standard)
- **Gutters**: 12dp

### Spacing Tokens
| Token | Size | Usage |
| :--- | :--- | :--- |
| `xs` | 4dp | Icon-text gap |
| `s` | 8dp | Related elements (Label + Input) |
| `m` | 16dp | Container padding, standard separation |
| `l` | 24dp | Section separation |
| `xl` | 32dp | Bottom sheet top spacing |

---

## 5. Component Shapes

| Token | Radius | Usage |
| :--- | :--- | :--- |
| `full` | 999dp | Buttons, Badges, Avatars |
| `large` | 16dp | Bottom Sheets, Modals, Large Cards |
| `medium` | 12dp | Standard Cards, Input Fields |
| `small` | 4dp | Checkboxes, Tags |

---

## 6. Elevation & Shadows (Light Mode Only)

*Note: In Dark Mode, use lighter surface colors (overlay) instead of shadows.*

| Token | CSS / Android | Usage |
| :--- | :--- | :--- |
| `shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` | List items, subtle cards |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1)` | Floating buttons (FAB), Sticky headers |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` | Modals, Bottom Sheets |

---

## 7. UX Interaction Patterns

### Transitions
- **Page Slide**: 300ms `FastOutSlowIn`
- **Modal Pop**: 250ms `Spring` (Damping: 0.8)
- **Touch Feedback**: All interactive elements must reduce opacity (0.7) or scale (0.95) on press.

### Accessibility (A11y)
- **Touch Targets**: Min 44x44dp for all buttons.
- **Contrast**: Text must meet AA (4.5:1) standard.
- **Focus**: Visible ring (2dp primary) for keyboard/d-pad navigation.
