export const capitalize = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const pascalToNormal = (text: string): string => {
  return text.replace(/([A-Z])/g, " $1").trim();
};
