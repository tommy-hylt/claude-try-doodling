import { useState, useEffect } from 'react';
import Circle from './Circle';
import {
  type Position,
  circleExists,
  isPointCovered,
  isWithinBounds,
  getCircleBorderIntersections,
  getCircleCircleIntersections,
} from './utils/intersections';

const STEP_DELAY = 2000; // 2 seconds

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
      { x: 0, y: 0 }, // Top-left corner only
    ];

    setCircles(cornerCircles);
    setStep(1);
  }, [dimensions]);

  // Generate next step of circles
  const generateNextStep = () => {
    const candidateCircles: Position[] = [];

    console.log(`\n=== Step ${step} ===`);
    console.log(`Current circles: ${circles.length}`, circles);

    // Get intersections with borders
    circles.forEach((circle, idx) => {
      const borderIntersections = getCircleBorderIntersections(circle, dimensions);
      console.log(`Circle ${idx} at (${circle.x}, ${circle.y}) -> ${borderIntersections.length} border intersections`, borderIntersections);
      borderIntersections.forEach((pos) => {
        if (isWithinBounds(pos, dimensions) && !circleExists(pos, circles) && !circleExists(pos, candidateCircles) && !isPointCovered(pos, circles)) {
          candidateCircles.push(pos);
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
          if (isWithinBounds(pos, dimensions) && !circleExists(pos, circles) && !circleExists(pos, candidateCircles) && !isPointCovered(pos, circles)) {
            candidateCircles.push(pos);
          }
        });
      }
    }

    console.log(`Candidate circles (after filtering covered): ${candidateCircles.length}`, candidateCircles);

    // Pick one circle pseudo-randomly based on number of candidates
    if (candidateCircles.length > 0) {
      const selectedIndex = (step * 2654435761) % candidateCircles.length;
      const selectedCircle = candidateCircles[selectedIndex];
      console.log(`Selected circle ${selectedIndex}:`, selectedCircle);
      setCircles((prev) => [...prev, selectedCircle]);
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
      {[...circles].reverse().map((circle, index) => (
        <Circle key={circles.length - 1 - index} x={circle.x} y={circle.y} index={circles.length - 1 - index} />
      ))}
    </svg>
  );
};

export default Canvas;
