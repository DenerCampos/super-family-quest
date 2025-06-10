export const capitalizeFirstLetter = (str: string): string => {
  return str
    .toLowerCase()
    .replace(
      /^(\**)(\w)/,
      (match: string) => {        
        return match.toUpperCase();
      },
    );
};
