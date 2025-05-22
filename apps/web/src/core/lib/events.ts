export const createChangeEvent = (
  value: string,
): React.ChangeEvent<HTMLSelectElement> => {
  return {
    target: { value } as HTMLSelectElement,
    currentTarget: { value } as HTMLSelectElement,
    bubbles: true,
    cancelable: true,
    defaultPrevented: false,
    eventPhase: 3,
    isTrusted: true,
    nativeEvent: new Event('change'),
    type: 'change',
    timeStamp: Date.now(),
  } as React.ChangeEvent<HTMLSelectElement>;
};
