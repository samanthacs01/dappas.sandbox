import React from 'react';

const ChatAssistantIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg {...props} viewBox="0 0 16 16" fill="none">
      <path d="M16 0H0V16H16V0Z" fill="black" />
      <path d="M16 0H13.0908V2.90909H15.9999L16 0Z" fill="white" />
      <path d="M2.90909 0H0V2.90909H2.90909V0Z" fill="white" />
      <path
        d="M15.9999 13.0918H13.0908V16.0009L16 16L15.9999 13.0918Z"
        fill="white"
      />
      <path d="M2.90909 13.0918H0V16L2.90909 16.0009V13.0918Z" fill="white" />
    </svg>
  );
};

export default ChatAssistantIcon;
