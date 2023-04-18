import {useEffect, useState} from 'react';
import {DeviceOrientation, DeviceOrientationCompassHeading} from '@awesome-cordova-plugins/device-orientation';
import {IS_WEB} from '../../config';
import {getOrientation} from '../../utils/orientation';
import {singletonHook} from 'react-singleton-hook';
import useIsActive from './useIsActive';

declare interface CompassError {
  code: 0 | 20;
}

type useCompassType = number | undefined;

const useCompass = (): useCompassType => {
  const [heading, setHeading] = useState<number>();

  const isActive = useIsActive();

  useEffect(() => {
    if (IS_WEB) { // Actually should test for cordova avail
      const listener = (event: DeviceOrientationEvent) => {
        if (isActive && event.alpha !== null) {
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
        if (isActive) {
          const newHeading = Math.round(magneticHeading + getOrientation());
          setHeading(prevHeading => prevHeading === newHeading ? prevHeading : newHeading);
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
  }, [isActive]);

  /*
  useEffect(() => {
    console.debug('[compass] Got Heading: ', heading);
  }, [heading]);
  */

  return heading;
};

const initialState: useCompassType = undefined;

export default singletonHook<useCompassType>(initialState, useCompass);
