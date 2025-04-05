export const capitalize = (string: string) => {
  if (!string) return "";
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

export const pascalToNormal = (text: string): string => {
  return text.replace(/([A-Z])/g, " $1").trim();
};

export const getOrdinalSuffix = (index: number) => {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = index % 100;
  return suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0];
};
