# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a generative art React application that gradually fills the screen with circles. The app creates a relaxing visual experience where circles appear at strategic positions with smooth animations.

**Tech Stack:** Vite + React + TypeScript + SVG

## Key Architecture

### Component Structure

- **App**: Root component, manages application state
- **Canvas**: Container component that holds circle positions as `{ x: number, y: number }[]` and renders the SVG canvas
- **Circle**: Presentational component that renders individual SVG circles with 20px radius

### Core Algorithm

The circle generation follows a specific geometric pattern:

1. **Step 0**: Place circles with centers at the four corners of the viewport: (0,0), (width,0), (width,height), (0,height)
2. **Subsequent steps**: Find all intersection points where new circles can be placed:
   - **Circle-Border intersections**: For each existing circle, find where its circumference intersects with the canvas borders. A new circle centered at that intersection point will be tangent to both the existing circle and the border.
   - **Circle-Circle intersections**: For each pair of existing circles, find where their circumferences intersect. A new circle centered at that intersection point will be tangent to both existing circles.

   Place new circles centered at each intersection point, but only if no circle already exists at that position (avoid duplicates)
3. **Termination**: Continue until no new circles can be generated (screen is filled)

**Important**: The intersection points are on the circumferences of existing circles, and new circles are centered exactly at these intersection points.

### Animation Behavior

- Each generation step pauses for 3 seconds before the next
- New circles animate in with opacity transition (smooth fade-in)
- Newer circles render beneath older circles (z-index/layer order)

### Visual Design

- **Colors**: Sky blue circles in various saturations on white background
- **Layout**: Full-screen canvas with no UI controls or text
- **UX**: Animation starts automatically on page load
- **Style**: Minimal, relaxing aesthetic

## Development Commands

Once the project is set up:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Implementation Notes

- Use SVG for circle rendering (not HTML Canvas)
- **Circle Positioning**:
  - Initial circles are centered at viewport corners: (0,0), (width,0), (width,height), (0,height)
  - New circles are centered at intersection points on existing circles' circumferences
- **Intersection Calculations**:
  - **Circle-Border**: For a circle centered at (cx, cy) with radius R (20px), find where its circumference intersects borders. Using circle equation `(x-cx)² + (y-cy)² = R²`:
    - For left border (x=0): if cx ≤ R, intersections at `(0, cy ± √(R² - cx²))`
    - For top border (y=0): if cy ≤ R, intersections at `(cx ± √(R² - cy²), 0)`
    - Similar for right and bottom borders
    - These intersection points become centers of NEW circles
  - **Circle-Circle**: Use standard circle-circle intersection formula. For two circles at distance d apart with radius R each, if d < 2R, they intersect. Calculate midpoint between centers, then perpendicular offset `h = √(R² - (d/2)²)` to find the two intersection points.
- Manage circle positions in state, adding new positions at each step
- **Floating Point Precision**: Be extremely careful with floating point arithmetic throughout:
  - Circle-circle and circle-border intersection calculations may produce slight precision errors
  - Use a tolerance threshold (e.g., 0.1 pixels) when comparing positions for equality
  - Consider rounding coordinates to a reasonable precision (e.g., 2 decimal places) to avoid accumulating errors
- **Deduplication**: Before adding a new circle, check if a circle already exists at that position using distance calculation with tolerance threshold
- **Coverage Check**: Before adding a new circle, verify that its center is NOT inside (covered by) any existing circle. A point is covered if its distance from an existing circle's center is less than the radius (R - tolerance). This prevents wild growth of overlapping circles.
- Use `setTimeout` or `setInterval` for 3-second delays between steps
- **Rendering Order**: Render circles in reverse order (newest first in SVG) so newer circles appear beneath older ones. SVG renders elements in order, with later elements appearing on top.
