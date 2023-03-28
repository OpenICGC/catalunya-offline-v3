import {useState} from 'react';
import {App} from '@capacitor/app';

const useIsActive = () => {
  const [isActive, setActive] = useState<boolean>(true);

  App.addListener('appStateChange',
    appState => setActive(appState.isActive)
  );

  return isActive;
};

export default useIsActive;
