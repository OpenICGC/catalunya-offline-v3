export const getImageNameWithoutPath = (path: string) => {
  const lastIndexOf = path.lastIndexOf('/');
  return path.substring(lastIndexOf + 1);
};