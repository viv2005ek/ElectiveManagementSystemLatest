export const getBatches = (
  numberOfPastBatches: number,
  numberOfFutureBatches: number,
) => {
  const year = new Date().getFullYear();
  return Array.from(
    { length: numberOfPastBatches + numberOfFutureBatches + 1 },
    (_, i) => ({
      number: year - numberOfPastBatches + i,
      name: `Batch of ${year - numberOfPastBatches + i}`,
      id: (year - numberOfPastBatches + i).toString(),
    }),
  );
};

export const getSemesters = (upperLimit: number) => {
  return Array.from({ length: upperLimit }, (_, i) => ({
    number: i + 1,
    name: `Semester ${i + 1}`,
    id: (i + 1).toString(),
  }));
};
