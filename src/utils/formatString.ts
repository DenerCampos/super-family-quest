export const capitalizeFirstLetter = (str: string): string => {
  return str
    .toLowerCase()
    .replace(
      /^(\**)(\w)/,
      (match: string, asterisks: string, firstLetter: string) => {
        return asterisks + firstLetter.toUpperCase();
      },
    );
};
