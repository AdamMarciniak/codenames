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
        x="22.1719"
        y="17.0194"
        width="300.089"
        height="195.311"
        rx="10"
        fill={outlineColor}
      />

      <path
        d="M35.874 62.0297C35.874 56.5069 40.3512 52.0297 45.874 52.0297H298.559C304.082 52.0297 308.559 56.5069 308.559 62.0297V166.156C308.559 171.679 304.082 176.156 298.559 176.156H45.874C40.3512 176.156 35.874 171.679 35.874 166.156V62.0297Z"
        fill="white"
      />
      <path
        d="M35.874 62.0297C35.874 56.5069 40.3512 52.0297 45.874 52.0297H298.559C304.082 52.0297 308.559 56.5069 308.559 62.0297V166.156C308.559 171.679 304.082 176.156 298.559 176.156H45.874C40.3512 176.156 35.874 171.679 35.874 166.156V62.0297Z"
        fill="white"
      />

      <text
        x="173"
        y="130"
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
