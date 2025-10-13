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

1. **Step 0**: Place circles at all four corners of the viewport
2. **Subsequent steps**: For each existing circle, find intersections between that circle and the canvas borders, then place new circles centered at those intersection points
3. **Termination**: Stop after 10 steps or when the screen is filled

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
- Calculate intersection points geometrically between circles (20px radius) and viewport boundaries
- Manage circle positions in state, adding new positions at each step
- Use `setTimeout` or `setInterval` for 3-second delays between steps
- Ensure newer circles have lower z-index or render order so they appear beneath existing ones
