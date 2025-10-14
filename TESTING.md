# Testing Notes

## Issues Found and Fixed

### Issue 1: Incorrect radius used in calculations
**Root Cause**: Used `r = RADIUS * 2` (40px) instead of `r = RADIUS` (20px) for intersection calculations

**Fix**: Changed all intersection calculations to use `r = RADIUS` (20px) as the actual circle radius

### Issue 2: Circle-circle intersection formula bug
**Root Cause**: Circle-circle intersection formula had a bug: `a = (r² - r² + d²) / 2d` which cancelled out

**Fix**: Fixed circle-circle intersection to use standard formula: `a = d/2`, `h = √(r² - a²)`

### Issue 3: Circle-border intersection logic error
**Root Cause**:
1. Used `dx > 0` which excluded circles exactly at borders (e.g., corner circles at x=0)
2. Didn't filter out duplicate/degenerate intersections where offset is near zero

**Fix**:
1. Changed condition from `dx > 0` to `dx >= 0` to include circles on borders
2. Added `Math.abs(dy) > TOLERANCE` check to avoid creating duplicate circles at the same position
3. Used signed distances:
   - Left border: `dx = circle.x` (distance from x=0)
   - Right border: `dx = width - circle.x` (distance from x=width)
   - Top border: `dy = circle.y` (distance from y=0)
   - Bottom border: `dy = height - circle.y` (distance from y=height)

Then check if `0 ≤ distance ≤ 2R` and calculate intersection using `√(4R² - distance²)`

### Issue 4: Wild growth of circles
**Root Cause**: Not checking if a new circle's center is inside (covered by) an existing circle, leading to exponential growth of overlapping circles

**Fix**:
1. Added `isPointCovered()` function that checks if a point is inside any existing circle (distance < radius)
2. Filter out new circles whose centers are covered by existing circles
3. This ensures only circles with valid, uncovered centers are added

**Test cases**:
- Point (0, 20) NOT covered by circle at (0, 0) - distance = 20 = radius (on boundary) ✅
- Point (0, 10) IS covered by circle at (0, 0) - distance = 10 < 20 ✅
- Point (10, 10) IS covered by circle at (0, 0) - distance ≈ 14.14 < 20 ✅

## Test Results

After fixes:
- ✅ Step 0: 4 corner circles appear at (0,0), (width,0), (width,height), (0,height)
- ✅ Step 1: Border intersections from corner circles generate new circles
- ✅ Step 2+: Circle-circle intersections create additional circles
- ✅ Runs for 10 steps as specified
- ✅ No duplicate circles (deduplication working)
- ✅ Smooth opacity animations

## Console Logging

Added comprehensive console logging in `generateNextStep()` to track:
- Current step number
- Number of existing circles
- Border intersections per circle
- Circle-circle intersections
- Number of new circles to add

## Manual Testing Checklist

- [x] Initial render shows 4 corner circles
- [x] New circles appear every 3 seconds
- [x] Circles fade in smoothly
- [x] No duplicate circles at same position
- [x] No circles with centers inside existing circles (coverage check)
- [x] Process continues for 10 steps
- [x] Console shows intersection calculations
- [x] Controlled growth without wild explosion
- [x] Responsive to window resize
