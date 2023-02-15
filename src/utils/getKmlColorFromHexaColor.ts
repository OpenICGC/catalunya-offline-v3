export const getKmlColorFromHexaColor = (hexaColor: string | undefined) => {
  if (hexaColor) {
    const firstPair = hexaColor.substring(1,3);
    const secondPair = hexaColor.substring(3,5);
    const thirdPair = hexaColor.substring(5,7);

    return 'ff'+thirdPair+secondPair+firstPair;
  } else return undefined;
};