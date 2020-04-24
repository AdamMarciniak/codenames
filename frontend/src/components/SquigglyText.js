import React from "react";

const SquigglyText = (props) => (
  <>
    <svg
      className="squigglySvg"
      width="100%"
      height="100%"
      viewBox="0 0 150 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <text
        x="50%"
        y="50%"
        dominantBaseline="middle"
        textAnchor="middle"
        fontSize="100%"
        fontFamily="Rock Salt, cursive"
      >
        {props.children}
      </text>
      <defs>
        <filter id="squiggly-0">
          <feTurbulence
            id="turbulence"
            baseFrequency="0.01"
            numOctaves="3"
            result="noise"
            seed="0"
          />
          <feDisplacementMap
            id="displacement"
            in="SourceGraphic"
            in2="noise"
            scale="2"
          />
        </filter>
        <filter id="squiggly-1">
          <feTurbulence
            id="turbulence"
            baseFrequency="0.01"
            numOctaves="3"
            result="noise"
            seed="1"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="12" />
        </filter>

        <filter id="squiggly-2">
          <feTurbulence
            id="turbulence"
            baseFrequency="0.001"
            numOctaves="3"
            result="noise"
            seed="2"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
        </filter>
        <filter id="squiggly-3">
          <feTurbulence
            id="turbulence"
            baseFrequency="0.01"
            numOctaves="3"
            result="noise"
            seed="3"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
        </filter>

        <filter id="squiggly-4">
          <feTurbulence
            id="turbulence"
            baseFrequency="0.2"
            numOctaves="3"
            result="noise"
            seed="4"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" />
        </filter>
      </defs>
    </svg>
  </>
);

export default SquigglyText;
