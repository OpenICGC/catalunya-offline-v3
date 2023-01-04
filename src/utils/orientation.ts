import {PLATFORM} from '../config';

export const getOrientation = () => {
  if (PLATFORM === 'ios') {
    let angle = window.orientation;
    if (angle === -90) {
      angle = 360 - 90;
    }
    return angle;
  } else {
    return screen.orientation.angle;
  }
};