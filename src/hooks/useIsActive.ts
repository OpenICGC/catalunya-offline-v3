import {useEffect, useState} from 'react';
import {App} from '@capacitor/app';
import {singletonHook} from 'react-singleton-hook';

const useIsActive = () => {
  const [isActive, setActive] = useState<boolean>(true);

  useEffect(() => {
    App.addListener('appStateChange', appState => setActive(appState.isActive));
    App.addListener('backButton', () => App.minimizeApp());

    return () => {
      App.removeAllListeners();
    };
  }, []);

  return isActive;
};

export default singletonHook(
  true,
  () => useIsActive()
);
