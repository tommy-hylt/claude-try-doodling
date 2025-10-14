// Test file for intersection calculations
// Run with: npx tsx src/test-intersections.ts

interface Position {
  x: number;
  y: number;
}

const RADIUS = 20;
const TOLERANCE = 0.1;

// Dimensions for testing
const dimensions = { width: 1000, height: 800 };

// Helper function to round coordinates
const roundCoord = (n: number): number => {
  return Math.round(n * 100) / 100;
};

// Check if a point is covered by any existing circle
const isPointCovered = (pos: Position, existingCircles: Position[]): boolean => {
  return existingCircles.some((circle) => {
    const dx = pos.x - circle.x;
    const dy = pos.y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < RADIUS - TOLERANCE;
  });
};

// Calculate intersections between a circle and canvas borders
const getCircleBorderIntersections = (circle: Position): Position[] => {
  const intersections: Position[] = [];
  const r = RADIUS; // Radius of the existing circle (R = 20)

  // Left border (x = 0)
  const dx_left = circle.x;
  if (dx_left >= 0 && dx_left <= r) {
    const dy = Math.sqrt(r * r - dx_left * dx_left);
    if (circle.y - dy >= 0 && Math.abs(dy) > TOLERANCE) {
      intersections.push({ x: roundCoord(0), y: roundCoord(circle.y - dy) });
    }
    if (circle.y + dy <= dimensions.height && Math.abs(dy) > TOLERANCE) {
      intersections.push({ x: roundCoord(0), y: roundCoord(circle.y + dy) });
    }
  }

  // Right border (x = width)
  const dx_right = dimensions.width - circle.x;
  if (dx_right >= 0 && dx_right <= r) {
    const dy = Math.sqrt(r * r - dx_right * dx_right);
    if (circle.y - dy >= 0 && Math.abs(dy) > TOLERANCE) {
      intersections.push({ x: roundCoord(dimensions.width), y: roundCoord(circle.y - dy) });
    }
    if (circle.y + dy <= dimensions.height && Math.abs(dy) > TOLERANCE) {
      intersections.push({ x: roundCoord(dimensions.width), y: roundCoord(circle.y + dy) });
    }
  }

  // Top border (y = 0)
  const dy_top = circle.y;
  if (dy_top >= 0 && dy_top <= r) {
    const dx = Math.sqrt(r * r - dy_top * dy_top);
    if (circle.x - dx >= 0 && Math.abs(dx) > TOLERANCE) {
      intersections.push({ x: roundCoord(circle.x - dx), y: roundCoord(0) });
    }
    if (circle.x + dx <= dimensions.width && Math.abs(dx) > TOLERANCE) {
      intersections.push({ x: roundCoord(circle.x + dx), y: roundCoord(0) });
    }
  }

  // Bottom border (y = height)
  const dy_bottom = dimensions.height - circle.y;
  if (dy_bottom >= 0 && dy_bottom <= r) {
    const dx = Math.sqrt(r * r - dy_bottom * dy_bottom);
    if (circle.x - dx >= 0 && Math.abs(dx) > TOLERANCE) {
      intersections.push({ x: roundCoord(circle.x - dx), y: roundCoord(dimensions.height) });
    }
    if (circle.x + dx <= dimensions.width && Math.abs(dx) > TOLERANCE) {
      intersections.push({ x: roundCoord(circle.x + dx), y: roundCoord(dimensions.height) });
    }
  }

  return intersections;
};

// Calculate intersections between two circles
const getCircleCircleIntersections = (c1: Position, c2: Position): Position[] => {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const r = RADIUS; // Each circle has radius R = 20

  if (distance >= r * 2 - TOLERANCE || distance < TOLERANCE) {
    return [];
  }

  const a = distance / 2;
  const h = Math.sqrt(r * r - a * a);

  const midX = (c1.x + c2.x) / 2;
  const midY = (c1.y + c2.y) / 2;

  const perpX = -(dy / distance) * h;
  const perpY = (dx / distance) * h;

  return [
    { x: roundCoord(midX + perpX), y: roundCoord(midY + perpY) },
    { x: roundCoord(midX - perpX), y: roundCoord(midY - perpY) },
  ];
};

// Test cases
console.log('=== CIRCLE-BORDER INTERSECTION TESTS ===\n');

// Test 1: Circle at top-left corner (0, 0)
console.log('Test 1: Circle at top-left corner (0, 0)');
console.log('Expected: Two intersections - one on left border, one on top border');
const test1 = getCircleBorderIntersections({ x: 0, y: 0 });
console.log('Result:', test1);
console.log('Count:', test1.length);
console.log('Expected positions: (0, 20) and (20, 0)');
console.log('');

// Test 2: Circle at top-right corner (1000, 0)
console.log('Test 2: Circle at top-right corner (1000, 0)');
console.log('Expected: Two intersections - one on right border, one on top border');
const test2 = getCircleBorderIntersections({ x: dimensions.width, y: 0 });
console.log('Result:', test2);
console.log('Count:', test2.length);
console.log('Expected positions: (1000, 20) and (980, 0)');
console.log('');

// Test 3: Circle at (40, 0) - should intersect top and left borders
console.log('Test 3: Circle at (40, 0)');
console.log('Expected: Intersections on top border and potentially left border');
const test3 = getCircleBorderIntersections({ x: 40, y: 0 });
console.log('Result:', test3);
console.log('Count:', test3.length);
console.log('');

// Test 4: Circle at (0, 40) - should intersect left border and potentially top border
console.log('Test 4: Circle at (0, 40)');
console.log('Expected: Intersections on left border and potentially top border');
const test4 = getCircleBorderIntersections({ x: 0, y: 40 });
console.log('Result:', test4);
console.log('Count:', test4.length);
console.log('');

// Test 5: Circle in the middle (500, 400) - should have no border intersections
console.log('Test 5: Circle in the middle (500, 400)');
console.log('Expected: No intersections (too far from borders)');
const test5 = getCircleBorderIntersections({ x: 500, y: 400 });
console.log('Result:', test5);
console.log('Count:', test5.length);
console.log('');

console.log('\n=== CIRCLE-CIRCLE INTERSECTION TESTS ===\n');

// Test 6: Two corner circles (0,0) and (1000, 0)
console.log('Test 6: Circles at (0, 0) and (1000, 0)');
console.log('Distance:', 1000, 'Max for intersection:', RADIUS * 4);
const test6 = getCircleCircleIntersections({ x: 0, y: 0 }, { x: dimensions.width, y: 0 });
console.log('Result:', test6);
console.log('Count:', test6.length);
console.log('Expected: No intersections (too far apart)');
console.log('');

// Test 7: Two circles at (0,0) and (0, 20) - should intersect
console.log('Test 7: Circles at (0, 0) and (0, 20)');
console.log('Distance:', 20, 'Max for intersection:', RADIUS * 2);
const test7 = getCircleCircleIntersections({ x: 0, y: 0 }, { x: 0, y: 20 });
console.log('Result:', test7);
console.log('Count:', test7.length);
console.log('Expected: 2 intersections');
console.log('');

// Test 8: Two circles at (0,0) and (20, 0) - should intersect
console.log('Test 8: Circles at (0, 0) and (20, 0)');
console.log('Distance:', 20, 'Max for intersection:', RADIUS * 2);
const test8 = getCircleCircleIntersections({ x: 0, y: 0 }, { x: 20, y: 0 });
console.log('Result:', test8);
console.log('Count:', test8.length);
console.log('Expected: 2 intersections');
console.log('');

// Test 9: Full first step simulation
console.log('\n=== FULL STEP 1 SIMULATION ===\n');
console.log('Starting with 4 corner circles:');
const corners = [
  { x: 0, y: 0 },
  { x: dimensions.width, y: 0 },
  { x: dimensions.width, y: dimensions.height },
  { x: 0, y: dimensions.height },
];
console.log(corners);
console.log('');

let allBorderIntersections: Position[] = [];
corners.forEach((circle, idx) => {
  const intersections = getCircleBorderIntersections(circle);
  console.log(`Circle ${idx} at (${circle.x}, ${circle.y}):`);
  console.log('  Border intersections:', intersections);
  allBorderIntersections = allBorderIntersections.concat(intersections);
});

console.log('\nTotal border intersections:', allBorderIntersections.length);
console.log('All positions:', allBorderIntersections);

console.log('\nCircle-circle intersections:');
let allCircleIntersections: Position[] = [];
for (let i = 0; i < corners.length; i++) {
  for (let j = i + 1; j < corners.length; j++) {
    const intersections = getCircleCircleIntersections(corners[i], corners[j]);
    if (intersections.length > 0) {
      console.log(`  Circle ${i} & ${j}:`, intersections);
      allCircleIntersections = allCircleIntersections.concat(intersections);
    }
  }
}

console.log('\nTotal circle-circle intersections:', allCircleIntersections.length);
console.log('\nTotal new circles in step 1 (before coverage filter):', allBorderIntersections.length + allCircleIntersections.length);

// Test coverage filtering
console.log('\n=== COVERAGE VALIDATION TESTS ===\n');

console.log('Test 10: Check if (0, 20) is covered by corner circles');
const isCovered1 = isPointCovered({ x: 0, y: 20 }, corners);
console.log('Result:', isCovered1);
console.log('Expected: false (this is an intersection point, should NOT be covered)');
console.log('');

console.log('Test 11: Check if (0, 10) is covered by circle at (0, 0)');
const isCovered2 = isPointCovered({ x: 0, y: 10 }, [{ x: 0, y: 0 }]);
console.log('Result:', isCovered2);
console.log('Expected: true (distance = 10 < radius = 20)');
console.log('');

console.log('Test 12: Check if (20, 0) is covered by circle at (0, 0)');
const isCovered3 = isPointCovered({ x: 20, y: 0 }, [{ x: 0, y: 0 }]);
console.log('Result:', isCovered3);
console.log('Expected: false (distance = 20 = radius, on boundary, not inside)');
console.log('');

console.log('Test 13: Check if (10, 10) is covered by circle at (0, 0)');
const distance13 = Math.sqrt(10 * 10 + 10 * 10);
console.log('Distance from (0,0) to (10,10):', distance13.toFixed(2));
const isCovered4 = isPointCovered({ x: 10, y: 10 }, [{ x: 0, y: 0 }]);
console.log('Result:', isCovered4);
console.log('Expected: true (distance ≈ 14.14 < radius = 20)');
console.log('');
