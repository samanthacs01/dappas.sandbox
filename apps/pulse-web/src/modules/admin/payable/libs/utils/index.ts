export const getChangedValues = <T extends object>(
  initialValues: T,
  currentValues: T,
): Partial<T> => {
  const changedValues: Partial<T> = {};
  for (const key in currentValues) {
    if (currentValues[key as keyof T] !== initialValues[key as keyof T]) {
      changedValues[key as keyof T] = currentValues[key as keyof T];
    }
  }
  return changedValues;
};
