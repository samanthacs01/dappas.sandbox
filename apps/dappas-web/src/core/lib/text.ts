const removeDiacritics = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export const normalizeText = (text: string): string =>
  removeDiacritics(text)
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
