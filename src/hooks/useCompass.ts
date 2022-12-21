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
      const onSuccess = (event: DeviceOrientationEvent) => {
        const newHeading = event.alpha !== null ? Math.round(360 - event.alpha) : undefined;
        setOrientation(prevOrientation => {
          if (newHeading && newHeading !== prevOrientation?.heading) {
            return {heading: newHeading};
          } else {
            return prevOrientation;
          }
        });
      };

      if (!window.DeviceOrientationEvent) {
        console.error('[Compass] Not available on this device');
      } else {
        window.addEventListener('deviceorientation', onSuccess);
      }

      return () => {
        window.removeEventListener('deviceorientation', onSuccess);
      };
    } else {
      const onSuccess = ({magneticHeading, headingAccuracy}: DeviceOrientationCompassHeading) => {
        const newHeading = Math.round(magneticHeading);
        const newAccuracy = Math.round(headingAccuracy);
        setOrientation(prevOrientation => {
          if (prevOrientation?.heading !== newHeading || prevOrientation?.accuracy !== newAccuracy) {
            console.log('GG', prevOrientation, newHeading, newAccuracy);
            return {heading: newHeading, accuracy: newAccuracy};
          } else {
            return prevOrientation;
          }
        });
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
