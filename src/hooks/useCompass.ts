import {useEffect, useState} from 'react';
import {DeviceOrientation, DeviceOrientationCompassHeading} from '@awesome-cordova-plugins/device-orientation';
import {Capacitor} from '@capacitor/core';

declare interface CompassError {
  code: 0 | 20;
}

const useCompass = () => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') { // Actually should test for cordova avail
      console.error('[Compass] Not available on web platform');
    } else {
      const onSuccess = ({magneticHeading}: DeviceOrientationCompassHeading) => {
        const newValue = Math.round(magneticHeading);
        if (heading !== newValue) {
          setHeading(newValue);
        }
      };

      const onError = (error: CompassError) => console.error(error);

      const subscription = DeviceOrientation.watchHeading().subscribe({
        next: onSuccess,
        error: onError
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  useEffect(() => {
    console.debug('[compass] Got Heading: ', heading);
  }, [heading]);

  return heading;
};

export default useCompass;
