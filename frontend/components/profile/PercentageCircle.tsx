import React from "react";

interface PercentageCircleProps {
  value: number;
  percentage: number;
  color: string;
}

const PercentageCircle: React.FC<PercentageCircleProps> = ({
  value,
  percentage,
  color,
}: PercentageCircleProps) => {
  const radius = 40; // Radius of the circle
  const circumference = 2 * Math.PI * radius; // Calculate the circumference
  const offset = circumference - (percentage / 100) * circumference; // Calculate the stroke-dashoffset

  return (
    <div className="w-40 h-40 relative">
      <svg
        className="w-full h-full"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke="#909090" // Background color
          strokeWidth="10" // Adjust the stroke width as needed
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth="10" // Adjust the stroke width as needed
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 50 50)`} // Rotate the circle to start from the top
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="16"
          fill={color}
        >
          {value}
        </text>
      </svg>
    </div>
  );
};

export default PercentageCircle;
