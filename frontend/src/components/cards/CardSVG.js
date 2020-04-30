import React from "react";

const CardSVG = ({ outlineColor, word }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 346 229"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0"
        y="0"
        width="346"
        height="229"
        rx="30"
        fill="#E0D4BE"
      />

      <rect
        x="20"
        y="20"
        width="306"
        height="189"
        rx="20"
        stroke={outlineColor}
        strokeWidth={10}
      />

      <rect
        x="38"
        y="112"
        width="270"
        height="80"
        rx="10"
        fill="white"
      />

      <text
        x="173"
        y="165"
        fontFamily="Montserrat, sans-serif"
        fontWeight="bold"
        fontSize="32"
        textAnchor="middle"
        fill="#262626"
      >
        {word.toUpperCase()}
      </text>
    </svg>
  );
};

export default CardSVG;
