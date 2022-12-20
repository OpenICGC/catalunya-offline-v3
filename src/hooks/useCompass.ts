import {useEffect, useState} from 'react';
import {DeviceOrientation, DeviceOrientationCompassHeading} from '@awesome-cordova-plugins/device-orientation';
import {Capacitor} from '@capacitor/core';

declare interface CompassError {
  code: 0 | 20;
}

export type Orientation = {
  heading: number,
  accuracy?: number
}

const useCompass = () => {
  const [orientation, setOrientation] = useState<Orientation>();

  useEffect(() => {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') { // Actually should test for cordova avail
      if (!window.DeviceOrientationEvent) {
        console.error('[Compass] Not available on this device');
      } else {
        window.addEventListener('deviceorientation', (event) => {
          if (event.alpha && Math.round(360 - event.alpha) !== orientation?.heading) {
            setOrientation({heading: Math.round(360 - event.alpha)});
          }
        });
      }
    } else {
      const onSuccess = ({magneticHeading, headingAccuracy}: DeviceOrientationCompassHeading) => {
        const newValue = Math.round(magneticHeading);
        const newAccuracy = Math.round(headingAccuracy);
        if (orientation?.heading !== newValue || orientation?.accuracy !== newAccuracy) {
          setOrientation({heading: newValue, accuracy: newAccuracy});
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
    console.debug('[compass] Got Heading: ', orientation);
  }, [orientation]);

  return orientation;
};

export default useCompass;
