const mmToPx = (mm: number) => (mm / 25.4) * 300;

const pxToMm = (px: number) => (px / 300) * 25.4;

const mmToPt = (mm: number) => (mm / 25.4) * 72;

export { mmToPt, mmToPx, pxToMm };

