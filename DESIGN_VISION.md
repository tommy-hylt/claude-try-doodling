# Design Vision

## Visual Style
The page should be relaxing. Use blue and white in different saturations.
Circles have sky blue stroke with white fill.

## UI/UX Concept
The page does not contain any button nor text. Simply on page load, you start drawing.

### Layout
- Full-screen canvas

### Color Scheme
- Primary colors: sky blue
- Background: white background

## "Doodles on Itself" Concept
The program should draw circles of 20px radius gradually.
First draw circles at corners. And then more circles arsies from intersections.
Until the whole page is filled with circles.

### Behavior Description
1. The application starts with a blank canvas
2. Every 3 seconds, new circles appears
3. Newer circles should be drawn beneath older circles
4. Continues until the whole screen is filled (no more valid intersections)

### Animation Characteristics
- Smooth animation for circle creation, animte the opacity
