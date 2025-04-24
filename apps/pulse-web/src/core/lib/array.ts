export const convertTo2DArray = <T>(
  originalArray: T[],
  numCols: number,
): T[][] => {
  const newArray: T[][] = [];
  const numRows = Math.ceil(originalArray.length / numCols);

  for (let i = 0; i < numRows; i++) {
    newArray.push(originalArray.slice(i * numCols, (i + 1) * numCols));
  }

  return newArray;
};
