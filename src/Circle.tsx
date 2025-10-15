import './Circle.css';
import { RADIUS } from './utils/intersections';

interface CircleProps {
  x: number;
  y: number;
  index: number;
}

const Circle: React.FC<CircleProps> = ({ x, y, index }) => {

  // Generate color based on index - different shades of blue
  const getStrokeColor = (idx: number): string => {
    // Create variations from light to dark blue
    const hue = 200; // Blue hue
    const saturation = 60 + (idx % 30); // 60-90%
    const lightness = 40 + (idx % 40); // 40-80%
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  };

  // Generate random animation delay for pulse effect only
  const pulseDelay = (index * 0.137) % 3; // Pseudo-random delay based on index

  return (
    <g>
      {/* Outer circle at 100% radius */}
      <circle
        className="circle"
        cx={x}
        cy={y}
        r={RADIUS}
        style={{
          stroke: getStrokeColor(index),
          animationDelay: `0s, ${pulseDelay}s`, // scaleIn: no delay, pulse: random delay
        }}
      />
      {/* Second circle at 75% radius */}
      <circle
        className="circle"
        cx={x}
        cy={y}
        r={RADIUS * 0.75}
        style={{
          stroke: getStrokeColor(index),
          animationDelay: `0s, ${pulseDelay}s`, // scaleIn: no delay, pulse: random delay
        }}
      />
      {/* Third circle at 50% radius */}
      <circle
        className="circle"
        cx={x}
        cy={y}
        r={RADIUS * 0.5}
        style={{
          stroke: getStrokeColor(index),
          animationDelay: `0s, ${pulseDelay}s`, // scaleIn: no delay, pulse: random delay
        }}
      />
    </g>
  );
};

export default Circle;
