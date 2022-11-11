import {useEffect, useState} from 'react';
/// Using also "cordova-plugin-device-orientation"

const useCompass = () => {
  const [heading, setHeading] = useState(0);

  useEffect(() => {
    const onSuccess = ({magneticHeading}) => {
      const newValue = Math.round(magneticHeading);
      if (heading !== newValue) {
        setHeading(newValue);
      }
    };

    const onError = error => console.error(error);

    var watchID = navigator.compass?.watchHeading(onSuccess, onError);

    return () => {
      watchID && navigator.compass?.clearWatch(watchID);
    };
  }, []);

  useEffect(() => {
    console.log('[compass] Set Heading: ', heading);
  }, [heading]);

  return heading;
};

export default useCompass;
