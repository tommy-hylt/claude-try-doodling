// Intersection calculation utilities for circle generation

export interface Position {
  x: number;
  y: number;
}

export interface Dimensions {
  width: number;
  height: number;
}

export const RADIUS = 40;
export const TOLERANCE = 0.1;

/**
 * Round coordinates to 2 decimal places for consistency
 */
export const roundCoord = (n: number): number => {
  return Math.round(n * 100) / 100;
};

/**
 * Check if a circle already exists at a position
 */
export const circleExists = (
  pos: Position,
  existingCircles: Position[]
): boolean => {
  return existingCircles.some(
    (circle) =>
      Math.abs(circle.x - pos.x) < TOLERANCE &&
      Math.abs(circle.y - pos.y) < TOLERANCE
  );
};

/**
 * Check if a point is inside (covered by) any existing circle
 */
export const isPointCovered = (
  pos: Position,
  existingCircles: Position[]
): boolean => {
  return existingCircles.some((circle) => {
    const dx = pos.x - circle.x;
    const dy = pos.y - circle.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    // Point is covered if it's inside the circle (distance < radius)
    return distance < RADIUS - TOLERANCE;
  });
};

/**
 * Check if a point is within canvas bounds
 */
export const isWithinBounds = (
  pos: Position,
  dimensions: Dimensions
): boolean => {
  return (
    pos.x >= 0 &&
    pos.x <= dimensions.width &&
    pos.y >= 0 &&
    pos.y <= dimensions.height
  );
};

/**
 * Calculate intersections between a circle and canvas borders
 * Returns points where the circle's circumference touches the border
 */
export const getCircleBorderIntersections = (
  circle: Position,
  dimensions: Dimensions
): Position[] => {
  const intersections: Position[] = [];
  const r = RADIUS;

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
      intersections.push({
        x: roundCoord(dimensions.width),
        y: roundCoord(circle.y - dy),
      });
    }
    if (circle.y + dy <= dimensions.height && Math.abs(dy) > TOLERANCE) {
      intersections.push({
        x: roundCoord(dimensions.width),
        y: roundCoord(circle.y + dy),
      });
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
      intersections.push({
        x: roundCoord(circle.x - dx),
        y: roundCoord(dimensions.height),
      });
    }
    if (circle.x + dx <= dimensions.width && Math.abs(dx) > TOLERANCE) {
      intersections.push({
        x: roundCoord(circle.x + dx),
        y: roundCoord(dimensions.height),
      });
    }
  }

  return intersections;
};

/**
 * Calculate intersections between two circles
 * Returns points where the two circle circumferences intersect
 */
export const getCircleCircleIntersections = (
  c1: Position,
  c2: Position
): Position[] => {
  const dx = c2.x - c1.x;
  const dy = c2.y - c1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const r = RADIUS;

  // If circles are too far apart, no intersection
  if (distance >= r * 2 - TOLERANCE) {
    return [];
  }

  // If circles are too close or identical, no valid intersection
  if (distance < TOLERANCE) {
    return [];
  }

  // Calculate intersection points using standard formula
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
