import React from "react";

interface PercentageLineProps {
  value: number;
}

const PercentageLine: React.FC<PercentageLineProps> = ({
  value,
}: PercentageLineProps) => {
  const w = ((value - Math.floor(value)) * 100).toFixed(0);

  return (
    <div className="relative h-6 bg-[#909090] rounded-full">
      <div
        className={`h-6 absolute top-0 left-0 bg-blue rounded-full z-20`}
        style={{ width: `${w}%` }}
      ></div>
    </div>
  );
};

export default PercentageLine;
