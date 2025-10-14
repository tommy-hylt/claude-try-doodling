interface CircleProps {
  x: number;
  y: number;
  index: number;
}

const Circle: React.FC<CircleProps> = ({ x, y, index }) => {
  const radius = 20;

  return (
    <circle
      cx={x}
      cy={y}
      r={radius}
      fill="white"
      stroke="skyblue"
      strokeWidth="2"
      style={{
        animation: 'fadeIn 0.5s ease-in',
      }}
    />
  );
};

export default Circle;
