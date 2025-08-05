import React from 'react';

const Logo = () => (
  <svg
    width="40"
    height="40"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ cursor: 'pointer' }}
  >
    <circle cx="50" cy="50" r="48" stroke="#1565c0" strokeWidth="4" fill="#1976d2" />
    <text
      x="50%"
      y="55%"
      textAnchor="middle"
      fill="white"
      fontSize="48"
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
      dy=".3em"
    >
      SF
    </text>
  </svg>
);

export default Logo;
