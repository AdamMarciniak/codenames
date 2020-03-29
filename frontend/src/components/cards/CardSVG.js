import React from "react";

const CardSVG = ({ handleClick, color, outlineColor, word }) => {
  return (
    <svg
      viewBox="0 0 346 229"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{ cursor: "pointer", userSelect: "none" }}
    >
      <rect
        x="24.0381"
        y="24.6368"
        width="297.089"
        height="180.101"
        rx="8.5"
        fill={`#${color}`}
        stroke={`#${outlineColor}`}
        strokeWidth="40"
      />
      <path
        d="M36.2393 135.538H308.924V182.613C308.924 188.136 304.447 192.613 298.924 192.613H46.2392C40.7164 192.613 36.2393 188.136 36.2393 182.613V135.538Z"
        fill="white"
      />
      <line
        x1="41.5352"
        y1="126.453"
        x2="226.083"
        y2="126.453"
        stroke="#AF9A87"
        strokeWidth="3"
      />
      <rect
        x="235.64"
        y="37.3806"
        width="73.2847"
        height="87.9416"
        fill="#EDE1CC"
      />
      <path
        d="M302.863 120.005H241.701L248.497 112.332C251.785 108.02 258.318 98.1261 258.142 93.0402C257.967 87.9543 252.954 79.5215 250.47 75.9408C246.743 67.0257 243.893 48.0555 262.308 43.4957C280.722 38.9358 289.857 55.0414 292.122 63.6641H296.068C297.164 64.3218 298.304 66.3387 300.233 69.1448C302.162 71.9508 301.037 73.9677 300.233 74.6255C298.333 74.8447 294.533 75.4146 294.533 75.9408V81.6405C294.533 83.3942 296.068 87.1212 294.533 89.5326C293.306 91.4618 292.414 92.6748 292.122 93.0402L287.518 95.0132C287.226 96.0362 286.817 98.3454 287.518 99.3976C288.395 100.713 292.999 103.782 296.068 106.851C298.523 109.306 301.621 116.643 302.863 120.005Z"
        fill="#C4BAA9"
      />
      <g filter="url(#filter0_di)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M172.582 69.6262C182.031 69.6262 189.691 61.9662 189.691 52.5172C189.691 43.0681 182.031 35.4081 172.582 35.4081C163.133 35.4081 155.473 43.0681 155.473 52.5172C155.473 61.9662 163.133 69.6262 172.582 69.6262ZM172.581 62.7225C178.218 62.7225 182.787 58.1534 182.787 52.5171C182.787 46.8809 178.218 42.3118 172.581 42.3118C166.945 42.3118 162.376 46.8809 162.376 52.5171C162.376 58.1534 166.945 62.7225 172.581 62.7225Z"
          fill={`#${color}`}
        />
      </g>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M172.582 77.5399C186.402 77.5399 197.605 66.3368 197.605 52.5172C197.605 38.6975 186.402 27.4944 172.582 27.4944C158.763 27.4944 147.56 38.6975 147.56 52.5172C147.56 66.3368 158.763 77.5399 172.582 77.5399ZM172.582 69.6018C182.017 69.6018 189.666 61.9527 189.666 52.5171C189.666 43.0815 182.017 35.4324 172.582 35.4324C163.146 35.4324 155.497 43.0815 155.497 52.5171C155.497 61.9527 163.146 69.6018 172.582 69.6018Z"
        fill={`#${color}`}
      />
      <circle cx="172.701" cy="52.3979" r="10.0859" fill={`#${color}`} />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.3662 0.594238C11.5591 0.594238 0.366211 11.7871 0.366211 25.5942V203.78C0.366211 217.587 11.5591 228.78 25.3662 228.78H319.797C333.604 228.78 344.797 217.587 344.797 203.78V25.5942C344.797 11.7871 333.604 0.594238 319.797 0.594238H25.3662ZM32.5376 23.1368C27.0147 23.1368 22.5376 27.614 22.5376 33.1369V196.238C22.5376 201.76 27.0148 206.238 32.5376 206.238H312.627C318.149 206.238 322.627 201.76 322.627 196.238V33.1368C322.627 27.614 318.149 23.1368 312.627 23.1368H32.5376Z"
        fill={`#${color}`}
      />
      <path
        d="M279.223 23.1368L312.756 23.1369L217.556 151.988L217.556 105.376L279.223 23.1368Z"
        fill="url(#paint0_linear)"
      />
      <path
        d="M225.625 23.1413L267.379 23.1413L211.049 101.036L195.729 62.9435L225.625 23.1413Z"
        fill="url(#paint1_linear)"
      />
      <path
        d="M140.045 206.225L104.48 206.225L169.087 114.721L178.947 154.703L140.045 206.225Z"
        fill="url(#paint2_linear)"
      />
      <path
        d="M176.648 206.227L153.054 206.227L237.35 93.1197L233.049 129.814L176.648 206.227Z"
        fill="url(#paint3_linear)"
      />
      <path
        d="M61.601 23.1263L82.0261 23.1263L36.9959 86.7135L35.7743 59.0371L61.601 23.1263Z"
        fill="url(#paint4_linear)"
      />
      <path
        d="M100.963 23.133L128.163 23.133L86.9873 82.5302L51.3789 82.5302L100.963 23.133Z"
        fill="url(#paint5_linear)"
      />
      <text
        x="135"
        y="128"
        fontFamily="Montserrat, sans-serif"
        fontWeight="bold"
        fontSize="19"
        textAnchor="middle"
        fontStyle="italic"
        fill="#9b8a6e"
        transform="rotate(180,135,118)"
      >
        {word.toUpperCase()}
      </text>
      <text
        x="173"
        y="172"
        fontFamily="Montserrat, sans-serif"
        fontWeight="bold"
        fontSize="27"
        textAnchor="middle"
        fill="#262626"
      >
        {word.toUpperCase()}
      </text>
      <defs>
        <filter
          id="filter0_di"
          x="151.473"
          y="33.4081"
          width="42.2181"
          height="42.2181"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          />
          <feOffset dy="2" />
          <feGaussianBlur stdDeviation="2" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow"
            result="shape"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dx="-1" dy="-1" />
          <feGaussianBlur stdDeviation="1" />
          <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
          />
          <feBlend mode="normal" in2="shape" result="effect2_innerShadow" />
        </filter>
        <linearGradient
          id="paint0_linear"
          x1="281.621"
          y1="49.9521"
          x2="223.066"
          y2="124.684"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.37" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="253.836"
          y1="18.9413"
          x2="203.561"
          y2="85.6477"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.37" />
          <stop offset="1" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient
          id="paint2_linear"
          x1="113.579"
          y1="198.89"
          x2="174.543"
          y2="131.048"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.37" />
          <stop offset="1" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient
          id="paint3_linear"
          x1="176.725"
          y1="193.924"
          x2="238.336"
          y2="126.689"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.37" />
          <stop offset="1" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient
          id="paint4_linear"
          x1="85.5881"
          y1="8.90085"
          x2="34.6841"
          y2="75.1134"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.37" />
          <stop offset="0.771363" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
        <linearGradient
          id="paint5_linear"
          x1="144.716"
          y1="24.4211"
          x2="96.8225"
          y2="88.5464"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" stopOpacity="0.37" />
          <stop offset="1" stopColor="white" stopOpacity="0.05" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default CardSVG;
