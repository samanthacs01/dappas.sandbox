import React, { SVGProps } from 'react';

interface CustomTickProps extends SVGProps<SVGElement> {
  x: number;
  y: number;
  payload: {
    value: string;
  };
  dataLength?: number;
  unRotateXLabel?: boolean;
}

const CustomXAxisTick: React.FC<CustomTickProps> = ({
  x,
  y,
  payload,
  width,
  dataLength,
  unRotateXLabel = false,
  ...rest
}) => {
  const maxLength =
    (typeof width === 'number' && width !== undefined && width < 500) ||
    (dataLength && dataLength < 5)
      ? 5
      : 8;

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.slice(0, maxLength)}...`;
  };

  return (
    <g
      transform={`translate(${x},${y}) ${unRotateXLabel || (width && width !== undefined && +width > 500) || (dataLength && dataLength < 5) ? '' : 'rotate(-45)'} `}
    >
      <text x={0} y={0} dy={16} textAnchor="middle" fill="#666" fontSize={10}>
        {truncateText(payload.value, maxLength)}
      </text>
    </g>
  );
};

export default CustomXAxisTick;
