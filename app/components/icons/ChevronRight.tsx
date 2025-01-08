import React from "react";

interface ChevronRightProps {
  size?: number;
  color?: string;
}

export const ChevronRight: React.FC<ChevronRightProps> = ({
  size = 24,
  color = "black",
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
    >
      <path d="M8.59 7.41L13.17 12l-4.58 4.59L10 18l6-6-6-6z" />
    </svg>
  );
};
