import { useState, useEffect } from 'react';
import Circle from './Circle';

interface Position {
  x: number;
  y: number;
}

const RADIUS = 20;
const TOLERANCE = 0.1;
const STEP_DELAY = 3000; // 3 seconds

const Canvas: React.FC = () => {
  const [circles, setCircles] = useState<Position[]>([]);
  const [step, setStep] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Get viewport dimensions
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Initialize with corner circles
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const cornerCircles: Position[] = [
      { x: 0, y: 0 }, // Top-left corner
      { x: dimensions.width, y: 0 }, // Top-right corner
      { x: dimensions.width, y: dimensions.height }, // Bottom-right corner
      { x: 0, y: dimensions.height }, // Bottom-left corner
    ];

    setCircles(cornerCircles);
    setStep(1);
  }, [dimensions]);

  // Helper function to round coordinates for consistency
  const roundCoord = (n: number): number => {
    return Math.round(n * 100) / 100;
  };

  // Check if a circle already exists at a position
  const circleExists = (pos: Position, existingCircles: Position[]): boolean => {
    return existingCircles.some(
      (circle) =>
        Math.abs(circle.x - pos.x) < TOLERANCE &&
        Math.abs(circle.y - pos.y) < TOLERANCE
    );
  };

  // Check if a point is inside (covered by) any existing circle
  const isPointCovered = (pos: Position, existingCircles: Position[]): boolean => {
    return existingCircles.some((circle) => {
      const dx = pos.x - circle.x;
      const dy = pos.y - circle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      // Point is covered if it's inside the circle (distance < radius)
      return distance < RADIUS - TOLERANCE;
    });
  };

  // Calculate intersections between a circle and canvas borders
  // We find points where the circle's circumference touches the border,
  // then place NEW circles centered at those intersection points
  const getCircleBorderIntersections = (circle: Position): Position[] => {
    const intersections: Position[] = [];
    const r = RADIUS; // Radius of each circle is R = 20

    // For a circle centered at (cx, cy) with radius r,
    // find where its circumference intersects the canvas borders
    // These intersection points become the centers of NEW circles

    // Left border (x = 0)
    // Circumference equation: (x - cx)² + (y - cy)² = r²
    // Substitute x = 0: dy = √(r² - cx²)
    const dx_left = circle.x;
    if (dx_left >= 0 && dx_left <= r) {
      const dy = Math.sqrt(r * r - dx_left * dx_left);
      // Two intersection points on the circumference
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
  const getCircleCircleIntersections = (
    c1: Position,
    c2: Position
  ): Position[] => {
    const dx = c2.x - c1.x;
    const dy = c2.y - c1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Two circles with radius R have their circumferences intersect when distance < 2R
    // We want to place new circles at those intersection points
    const r = RADIUS; // Each circle has radius R = 20

    // If circles are too far apart, no intersection
    if (distance >= r * 2 - TOLERANCE) {
      return [];
    }

    // If circles are too close or identical, no valid intersection
    if (distance < TOLERANCE) {
      return [];
    }

    // Calculate intersection points of the two circle circumferences
    // Using the standard circle-circle intersection formula
    const a = distance / 2;
    const h = Math.sqrt(r * r - a * a);

    const midX = (c1.x + c2.x) / 2;
    const midY = (c1.y + c2.y) / 2;

    const perpX = -(dy / distance) * h;
    const perpY = (dx / distance) * h;

    const intersections: Position[] = [
      {
        x: roundCoord(midX + perpX),
        y: roundCoord(midY + perpY),
      },
      {
        x: roundCoord(midX - perpX),
        y: roundCoord(midY - perpY),
      },
    ];

    return intersections;
  };

  // Generate next step of circles
  const generateNextStep = () => {
    const newCircles: Position[] = [];

    console.log(`\n=== Step ${step} ===`);
    console.log(`Current circles: ${circles.length}`, circles);

    // Get intersections with borders
    circles.forEach((circle, idx) => {
      const borderIntersections = getCircleBorderIntersections(circle);
      console.log(`Circle ${idx} at (${circle.x}, ${circle.y}) -> ${borderIntersections.length} border intersections`, borderIntersections);
      borderIntersections.forEach((pos) => {
        if (!circleExists(pos, circles) && !circleExists(pos, newCircles) && !isPointCovered(pos, circles)) {
          newCircles.push(pos);
        }
      });
    });

    // Get intersections between circles
    for (let i = 0; i < circles.length; i++) {
      for (let j = i + 1; j < circles.length; j++) {
        const circleIntersections = getCircleCircleIntersections(
          circles[i],
          circles[j]
        );
        if (circleIntersections.length > 0) {
          console.log(`Circle ${i} & ${j} -> ${circleIntersections.length} intersections`, circleIntersections);
        }
        circleIntersections.forEach((pos) => {
          if (!circleExists(pos, circles) && !circleExists(pos, newCircles) && !isPointCovered(pos, circles)) {
            newCircles.push(pos);
          }
        });
      }
    }

    console.log(`New circles to add (after filtering covered): ${newCircles.length}`, newCircles);

    if (newCircles.length > 0) {
      setCircles((prev) => [...prev, ...newCircles]);
    }

    setStep((prev) => prev + 1);
  };

  // Auto-generate steps
  useEffect(() => {
    if (step === 0) return;

    const timer = setTimeout(() => {
      generateNextStep();
    }, STEP_DELAY);

    return () => clearTimeout(timer);
  }, [step, circles]);

  return (
    <svg
      width="100%"
      height="100%"
      style={{
        display: 'block',
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      {[...circles].reverse().map((circle, index) => (
        <Circle key={circles.length - 1 - index} x={circle.x} y={circle.y} index={index} />
      ))}
    </svg>
  );
};

export default Canvas;
