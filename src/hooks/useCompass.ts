import {useEffect, useState} from 'react';
import {DeviceOrientation, DeviceOrientationCompassHeading} from '@awesome-cordova-plugins/device-orientation';
import {IS_WEB} from '../config';

declare interface CompassError {
  code: 0 | 20;
}

const useCompass = () => {
  const [heading, setHeading] = useState<number>();

  useEffect(() => {
    if (IS_WEB) { // Actually should test for cordova avail
      const listener = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          const newHeading = Math.round(360 - event.alpha + screen.orientation.angle);
          newHeading && setHeading(prevHeading => prevHeading === newHeading ? prevHeading : newHeading);
        }
      };

      if (!window.DeviceOrientationEvent) {
        console.error('[Compass] Not available on this device');
      } else {
        window.addEventListener('deviceorientation', listener);
      }

      return () => {
        window.removeEventListener('deviceorientation', listener);
      };
    } else {
      const onSuccess = ({magneticHeading}: DeviceOrientationCompassHeading) => {
        const newHeading = Math.round(magneticHeading + screen.orientation.angle);
        setHeading(prevHeading => prevHeading === newHeading ? prevHeading : newHeading);
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
