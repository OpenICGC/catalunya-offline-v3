import {useEffect, useState} from 'react';
import {Motion} from '@capacitor/motion';

const useCompass = () => {
  const [orientation, setOrientation] = useState(0);

  useEffect(() => {
    console.log('[compass] Set Orientation: ', orientation);
  }, [orientation]);

  const handleOrientation = (newOrientation) => {
    if (Math.round(newOrientation) !== orientation) {
      setOrientation(Math.round(newOrientation));
    }
  };

  useEffect(async () => {
    const orientationHandler = await Motion.addListener('orientation', e => {
      //if (e.webkitCompassHeading) {
      //  handleOrientation(e.webkitCompassHeading);
      //} else {
      // TODO e.alpha needs holding phone horizontal and portrait mode. Take into consideration other scenarios
      handleOrientation(360-e.alpha);
      //}
    });

    return () => {
      if (orientationHandler) {
        orientationHandler.remove();
      }
    };
  }, []);

  return orientation;
};

export default useCompass;
