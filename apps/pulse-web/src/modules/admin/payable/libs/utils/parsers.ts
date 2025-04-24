export const parseDynamicEditToFormData = (data: object) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined) return;
    if (value instanceof Array) formData.append(key, value[0]);
    formData.append(key, String(value));
  });
  return formData;
};
