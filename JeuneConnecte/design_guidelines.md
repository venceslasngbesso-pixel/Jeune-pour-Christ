# Design Guidelines: Jeunesse Connectée – ACPE PHILADELPHIE

## Design Approach

**System-Based Approach:** Given this is a data-intensive administrative tool for church youth management, we'll draw from **Material Design** principles for their excellent handling of data-dense interfaces, card-based layouts, and mobile-first responsive patterns. The design prioritizes clarity, quick data entry, and efficient information scanning.

## Typography System

**Font Families:**
- Primary: Inter (Google Fonts) - Clean, highly legible for data tables and forms
- Accent: Poppins (Google Fonts) - Headers and emphasis

**Type Scale:**
- Page Headers: text-2xl md:text-3xl font-bold (Poppins)
- Section Headers: text-xl font-semibold (Poppins)
- Card Titles: text-lg font-medium (Inter)
- Body Text: text-base (Inter)
- Stats/Numbers: text-3xl md:text-4xl font-bold (Poppins)
- Labels: text-sm font-medium (Inter)
- Captions: text-xs (Inter)

## Layout System

**Spacing Units:** Use Tailwind units of 2, 4, 6, 8, 12, and 16 consistently
- Component padding: p-4 or p-6
- Section spacing: gap-6 or gap-8
- Page margins: px-4 md:px-6 lg:px-8
- Card spacing: space-y-6

**Container Widths:**
- Mobile: Full width with px-4
- Desktop: max-w-7xl mx-auto
- Forms/Modals: max-w-2xl

**Grid Patterns:**
- Dashboard stats: grid-cols-2 md:grid-cols-4
- Member cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Activity lists: Single column with full-width cards

## Component Library

### Navigation
**Bottom Navigation Bar (Mobile-First):**
- Fixed bottom bar with 6 icons + labels
- Mobile: 3 visible + "More" menu
- Tablet/Desktop: All 6 visible in bottom bar OR convert to sidebar
- Active state: Icon filled + label bolded
- Height: h-16 with safe-area-inset-bottom

### Dashboard Components
**Stat Cards:**
- 4-column grid on desktop, 2-column on mobile
- Each card: rounded-lg shadow with p-6
- Icon top-left (48x48), large number center, label below
- Elevation on hover: hover:shadow-lg

**Quick Action Buttons:**
- Large touch-friendly buttons (min-h-14)
- Full width on mobile, grid on desktop
- Icon + text layout
- Prominent styling with shadows

**Activities Section:**
- Horizontal scrollable cards on mobile
- 2-column grid on tablet+
- Each card: Image/icon, date badge, title, brief description

### Member Components
**Member List Cards:**
- Full-width cards with flex layout
- Left: Circular avatar (56x56)
- Center: Name + role stacked
- Right: Status badge + chevron
- Dividers between cards

**Member Detail Tabs:**
- Sticky tab navigation below header
- 3 tabs: Profil, Cotisations, Présences
- Tab content with padding p-6
- Smooth scroll between sections

**Member Profile Section:**
- Two-column form layout on desktop
- Label-value pairs with clear hierarchy
- Edit mode: Inline form fields

### Trésorerie Components
**Cotisation List:**
- Table layout on desktop (responsive)
- Card layout on mobile
- Columns: Membre, Montant, Date, Statut
- Color-coded status badges
- Sticky header on scroll

**Charts:**
- Bar chart for monthly cotisations
- Full width with aspect-ratio-16/9
- Responsive scaling
- Legend below chart

### Présences Components
**Quick Check-in Interface:**
- Search/filter bar at top
- List of members with checkboxes
- Batch actions: "Marquer tous présents"
- Submit button fixed at bottom on mobile

**Attendance History:**
- Timeline-style layout
- Group by date/culte type
- Expandable sections
- Filter chips at top (Date, Type, Membre)

### Activités Components
**Activity Cards:**
- Full-width cards with header image/icon
- Badge for date (upcoming vs past)
- Title, description truncated
- Participant count + avatars
- Action buttons at bottom

### Forms & Inputs
**Input Fields:**
- Consistent height: h-12
- Rounded: rounded-lg
- Full width on mobile
- Labels: text-sm font-medium mb-2
- Focus states: ring-2

**Buttons:**
- Primary: h-12 rounded-lg font-medium
- Secondary: Outlined variant
- Icon buttons: Square 44x44 minimum
- Disabled states with reduced opacity

**Select/Dropdowns:**
- Native select styled consistently
- Icon indicator (chevron-down)
- Full width on mobile

### Modals & Overlays
**Modal Structure:**
- Centered on screen
- max-w-2xl with p-6
- Header with title + close button
- Content area with scroll
- Footer with actions (right-aligned)
- Backdrop: backdrop-blur-sm

**Bottom Sheets (Mobile):**
- Slide up from bottom
- Drag handle at top
- Safe area handling
- Max height: 90vh

## Page-Specific Layouts

### Dashboard (Accueil)
- Header with church name + logo
- 4-column stat grid
- Quick action button row (3 buttons)
- Upcoming activities section (horizontal scroll)
- Spacing: space-y-6

### Membres
- Search bar fixed at top
- Filter chips (Tous, Membres, Responsables)
- Member card grid
- Floating "+" button (bottom-right)

### Detail Member
- Hero section with large avatar + name
- Tab navigation (sticky)
- Tab content with appropriate layouts per section
- Back button in header

### Trésorerie
- Summary cards at top (Total, Ce mois, En retard)
- Filter bar
- Table/list of cotisations
- Charts section below
- Export button in header

### Présences
- Type selector at top (tabs or dropdown)
- Date picker
- Member checklist
- Submit button
- History tab with timeline

### Activités
- Toggle: À venir / Passées
- Activity cards in list
- Filter by responsable
- "+" button to add activity

### Paramètres
- Section groups with dividers
- Church info (logo upload, name)
- Sync status with progress indicator
- Contact information
- App version at bottom

## Responsive Breakpoints
- Mobile: < 768px (default)
- Tablet: md: 768px+
- Desktop: lg: 1024px+

## Accessibility
- Touch targets: Minimum 44x44px
- Color contrast: WCAG AA compliant
- Form labels always visible
- Focus indicators on all interactive elements
- Semantic HTML throughout

## PWA-Specific Elements
**Offline Indicator:**
- Toast notification at top when offline
- Sync status icon in header
- Pending changes badge

**Install Prompt:**
- Banner at top on first visit
- Dismissible with "Install" CTA

**Loading States:**
- Skeleton screens for data loading
- Spinner for actions
- Progressive content loading