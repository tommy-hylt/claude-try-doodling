# Code Quality Improvements

This document outlines potential code quality enhancements.

## Code Organization

### Current State
- All logic in Canvas.tsx (~260 lines)
- Intersection calculations inline

### Improvement Ideas
- Extract intersection logic to separate utility file, so that
  - Other developers can also read and modify the code
  - Test the intersection code directly, instead of copying code into test file

- Move Canvas.tsx and Circle.tsx one layer upward. Drop components folder.

- Extract style of <circle> into CSS file

## Performance Optimizations

### Current State
- O(n²) circle-circle intersection checks
- Recalculates all intersections each step

### Potential Issues
- Performance degrades as circles increase
- Redundant calculations

### Improvement Ideas
- Memoize intersection calculations

## Code Quality

### Testing
- Unit tests for intersection functions
- Visual regression tests