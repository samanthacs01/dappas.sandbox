const ChatUserIcon = (props: React.SVGProps<SVGSVGElement>) => {
  return (
    <svg
      {...props}
      viewBox="0 0 16 16"
      fill="none"
    >
      <rect x="13.0908" width="2.90909" height="2.90909" fill="black" />
      <rect width="2.90909" height="2.90909" fill="black" />
      <rect
        x="13.0908"
        y="13.0918"
        width="2.90909"
        height="2.90909"
        fill="black"
      />
      <rect y="13.0918" width="2.90909" height="2.90909" fill="black" />
    </svg>
  );
};

export default ChatUserIcon;
