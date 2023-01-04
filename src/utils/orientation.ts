export const getOrientation = () => {
  if (screen?.orientation) {
    return screen.orientation.angle;
  } else {
    let angle = window.orientation;
    if (angle === -90) {
      angle = 360 - 90;
    }
    return angle;
  }
};