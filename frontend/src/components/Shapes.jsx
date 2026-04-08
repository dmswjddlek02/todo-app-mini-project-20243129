import React from 'react';

// 공통 SVG props
const svgProps = {
  width: '100%',
  height: '100%',
  viewBox: '0 0 100 100',
  xmlns: 'http://www.w3.org/2000/svg',
};

// 1. Blue: 위아래 V자 노치가 있는 사각형
export const ShapeBlue = ({ color = 'var(--color-theme-blue)', ...props }) => (
  <svg {...svgProps} {...props}>
    <path
      d="M15,5 L50,25 L85,5 L85,95 L50,75 L15,95 Z"
      fill={color}
      stroke={color}
      strokeWidth="5"
      strokeLinejoin="round"
    />
  </svg>
);

// 2. Yellow: Hexagon (정육각형)
export const ShapeYellow = ({ color = 'var(--color-theme-yellow)', ...props }) => (
  <svg {...svgProps} {...props}>
    <path
      d="M50,0 L93.3,25 L93.3,75 L50,100 L6.7,75 L6.7,25 Z"
      fill={color}
    />
  </svg>
);

// 3. Red: Clover (4개의 원형이 겹친 클로버)
export const ShapeRed = ({ color = 'var(--color-theme-red)', ...props }) => (
  <svg {...svgProps} {...props}>
    <circle cx="35" cy="35" r="25" fill={color} />
    <circle cx="65" cy="35" r="25" fill={color} />
    <circle cx="35" cy="65" r="25" fill={color} />
    <circle cx="65" cy="65" r="25" fill={color} />
  </svg>
);

// 4. Mint: Teardrop (물방울 모양, 우상단 대각선 방향으로 뾰족함)
export const ShapeMint = ({ color = 'var(--color-theme-mint)', ...props }) => (
  <svg {...svgProps} {...props}>
    <path
      d="M50,90 C22.4,90 10,67.6 10,40 C10,20 30,10 90,10 C90,70 80,90 50,90 Z"
      fill={color}
    />
  </svg>
);

// 테마 인덱스에 따라 Shape 컴포넌트를 반환하는 헬퍼
export const getShapeByIndex = (index) => {
  const shapes = [ShapeBlue, ShapeYellow, ShapeRed, ShapeMint];
  return shapes[index % 4];
};

export const getColorByIndex = (index) => {
  const colors = [
    'var(--color-card-blue)',
    'var(--color-card-yellow)',
    'var(--color-card-red)',
    'var(--color-card-mint)'
  ];
  return colors[index % 4];
};
