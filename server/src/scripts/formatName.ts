export const formatName = (
  name: string,
): { firstName: string; lastName: string } => {
  const nameParts = name.trim().split(/\s+/); // Split by any whitespace
  const firstName =
    nameParts[0][0].toUpperCase() + nameParts[0].slice(1).toLowerCase();
  const lastName = nameParts
    .slice(1)
    .map((part) => part[0].toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
  return { firstName, lastName };
};

console.log(formatName("SHRESHTH MIDDLENAME PUROHIT"));
// Output: { firstName: 'Shreshth', lastName: 'Middlename P
