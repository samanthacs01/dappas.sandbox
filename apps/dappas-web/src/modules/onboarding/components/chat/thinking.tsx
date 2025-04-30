const ChatThinking = () => {
  return (
    <div className="flex justify-center items-center p-2 rounded-2xl bg-purple-700 w-max">
      <div className="flex items-center gap-2">
        <span className="text-primary-foreground text-base font-medium">Thinking</span>
        <div className="animate-pulse flex">
          <div className="h-1 w-1 rounded-full bg-white mr-1" />
          <div className="h-1 w-1 rounded-full bg-white mr-1" />
          <div className="h-1 w-1 rounded-full bg-white mr-1" />
        </div>
      </div>
    </div>
  );
};

export default ChatThinking;
