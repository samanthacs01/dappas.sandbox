import { useEffect, useState } from 'react';

const LoginBgPulse = () => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const letters = ['P', 'U', 'L', 'S', 'E'];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex(Math.floor(Math.random() * letters.length));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="absolute w-screen h-screen top-0 left-0 z-10">
      <svg  viewBox="0 0 600 200">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff00cc" />
            <stop offset="100%" stopColor="#3333ff" />
          </linearGradient>
        </defs>
        <text
          x="300"
          y="100"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-9xl font-bold"
          fill="none"
          stroke="#4a5568"
          strokeWidth="1"
          strokeDasharray="5,5"
        >
          {letters.map((letter, index) => (
            <tspan
              key={index}
              dx={index === 0 ? 0 : '-0.05em'}
              className={`transition-all duration-500 ease-in-out ${
                index === activeIndex ? 'animate-pulse-gradient' : ''
              }`}
            >
              {letter}
            </tspan>
          ))}
        </text>
      </svg>
    </div>
  );
};

export default LoginBgPulse;
