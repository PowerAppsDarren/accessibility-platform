# UTMB Application Design Brainstorming

<response>
<probability>0.05</probability>
<text>
<idea>
  **Design Movement**: **Clinical Glassmorphism**
  
  **Core Principles**:
  1. **Sterile Transparency**: Use frosted glass effects to create depth while maintaining a clean, hygienic look associated with medical environments.
  2. **Trust & Clarity**: Prioritize legibility and structured data presentation. The interface should feel reliable and authoritative.
  3. **Layered Hierarchy**: Use elevation and blur intensity to denote importance, keeping the most critical information sharp and accessible.
  4. **Subtle Precision**: Micro-interactions should be crisp and immediate, reflecting the precision of medical technology.

  **Color Philosophy**:
  *   **Primary**: **UT System Blue (#003767)** and **Sealy Blue (#00418f)** for a strong, trustworthy foundation.
  *   **Background**: **Pure White (#FFFFFF)** and **Seabreeze Blue (#daeffd)** to keep the interface light and airy.
  *   **Accents**: **UT System Orange (#ca4b0c)** used sparingly for call-to-actions and critical alerts, ensuring they stand out against the cool blue tones.
  *   **Glass**: White-tinted glass with high blur for overlays, creating a "frosted window" effect that feels modern yet professional.

  **Layout Paradigm**:
  *   **Asymmetric Dashboard**: A persistent left sidebar (glass effect) with a fluid main content area.
  *   **Card-Based Data**: Information is organized in "floating" glass cards that sit above a subtle abstract background.
  *   **Split-Screen Details**: Detail views use a split-screen approach, with list navigation on the left and detailed forms/data on the right.

  **Signature Elements**:
  1.  **Frosted Sidebar**: A semi-transparent navigation bar that blurs the content behind it.
  2.  **Floating Action Buttons (FABs)**: Circular, elevated buttons in UTMB Orange for primary actions (e.g., "Add Person").
  3.  **Clean Data Grids**: Tables with subtle row hovering and glass headers, avoiding heavy borders.

  **Interaction Philosophy**:
  *   Interactions should feel "weightless" and smooth. Hovering over a card slightly lifts it (elevation change) and increases the opacity of the glass border.

  **Animation**:
  *   **Entrance**: Elements fade in with a slight upward slide (10px).
  *   **Transitions**: Page transitions use a cross-dissolve with a subtle blur effect.
  *   **Feedback**: Buttons have a "ripple" effect contained within the shape.

  **Typography System**:
  *   **Headings**: **Inter** (Bold/SemiBold) in UT System Blue. Clean, geometric, and readable.
  *   **Body**: **Inter** (Regular) in Anchor Gray (#222222) for maximum legibility.
  *   **Data/Labels**: **JetBrains Mono** or a similar monospaced font for IDs and numerical data to enhance scanning.
</idea>
</text>
</response>

<response>
<probability>0.03</probability>
<text>
<idea>
  **Design Movement**: **Vibrant Bio-Tech**
  
  **Core Principles**:
  1. **Energetic Utility**: Move away from the "sterile" look to something more dynamic and engaging, reflecting the active nature of health and technology.
  2. **High Contrast & Focus**: Use bold colors to guide the eye immediately to key metrics and actions.
  3. **Organic Geometry**: Incorporate rounded corners and softer shapes to make the technology feel more human-centric.
  4. **Contextual Warmth**: Use the orange palette to warm up the interface, making it feel less "cold" than typical enterprise software.

  **Color Philosophy**:
  *   **Primary**: **Sealy Blue (#00418f)** as the anchor.
  *   **Secondary**: **UT System Orange (#ca4b0c)** and **Founders Orange (#fa7e25)** are used much more prominently for active states, progress bars, and highlights.
  *   **Background**: **Discovery Haze (#ebe9e2)** or **Dune Sand (#d6d2c4)** for a warmer, paper-like foundation.
  *   **Glass**: Warmer, amber-tinted or neutral glass effects for modals and overlays.

  **Layout Paradigm**:
  *   **Modular Masonry**: Dashboard widgets are arranged in a masonry-style grid that adapts to screen size.
  *   **Top-Heavy Navigation**: A bold, colored top header containing global navigation, freeing up horizontal space for data.
  *   **Drawer-Based Details**: Clicking an item slides out a detailed drawer from the right, keeping context visible.

  **Signature Elements**:
  1.  **Gradient Headers**: Card headers use a subtle Blue-to-Teal gradient.
  2.  **Pill-Shaped Tags**: Status indicators (e.g., "In Progress") are pill-shaped with bold background colors.
  3.  **Organic Blobs**: Subtle, abstract background shapes (blobs) in UTMB colors that float behind the glass layers.

  **Interaction Philosophy**:
  *   Snappy and tactile. Buttons have a distinct "press" state. Toggles and switches have a satisfying "snap" animation.

  **Animation**:
  *   **Hover**: Elements scale up slightly (1.02x) and gain a colored shadow.
  *   **Loading**: Skeleton screens with a shimmering gradient effect.
  *   **Navigation**: Slide-in animations for drawers and modals.

  **Typography System**:
  *   **Headings**: **Poppins** or **Work Sans** – slightly more character and geometric friendliness.
  *   **Body**: **Roboto** or **Open Sans** for neutral readability.
  *   **Hierarchy**: Heavy use of uppercase for labels (e.g., "DEPARTMENT ID") to distinguish from data.
</idea>
</text>
</response>

<response>
<probability>0.02</probability>
<text>
<idea>
  **Design Movement**: **Deep Blue Executive**
  
  **Core Principles**:
  1. **Professional Authority**: A "Dark Mode" first approach (or deep blue theme) that conveys sophistication and reduces eye strain for power users.
  2. **Data Density**: Optimized for viewing large amounts of data without scrolling. Compact rows and condensed typography.
  3. **Luminous Accents**: Use light and color to "glow" against the dark background, highlighting active elements.
  4. **Immersive Depth**: Strong use of shadows and layering to create a cockpit-like feel.

  **Color Philosophy**:
  *   **Background**: **Legacy Blue (#142047)** and **UT System Blue (#003767)** as the canvas.
  *   **Surface**: **Sealy Blue (#00418f)** with reduced opacity for cards/containers.
  *   **Text**: **Pure White (#FFFFFF)** for primary text, **Seabreeze Blue (#daeffd)** for secondary.
  *   **Accents**: **Golden Orange (#ffbd64)** and **Tidepool Teal (#a5ccd4)** for "glowing" indicators.

  **Layout Paradigm**:
  *   **Command Center**: A dense, fixed layout. Collapsible sidebars on both left (nav) and right (filters/details).
  *   **Tabbed Interface**: Heavy use of tabs to switch between views (People, Departments, etc.) without reloading.
  *   **HUD-Style Overlays**: Modals appear as centered, high-contrast overlays with a backdrop blur.

  **Signature Elements**:
  1.  **Neon Borders**: Active inputs and selected cards have a glowing blue or orange border.
  2.  **Dark Glass**: The glass effect is dark and smoky, blurring the background content significantly.
  3.  **Data Visualizations**: Integrated sparklines and mini-charts within data tables.

  **Interaction Philosophy**:
  *   "High-Tech" feel. Instant response times. Keyboard shortcuts for navigation.

  **Animation**:
  *   **Focus**: When an input is focused, the glow expands.
  *   **Data Updates**: Numbers "tick" up or down when changing.
  *   **Transitions**: fast fades (150ms).

  **Typography System**:
  *   **Headings**: **Rajdhani** or **Barlow** – slightly squared, technical feel.
  *   **Body**: **Inter** or **System UI** font for crisp rendering on dark backgrounds.
  *   **Monospace**: Extensive use of monospace for all data fields.
</idea>
</text>
</response>
