import {useState} from 'react';
import {App} from '@capacitor/app';

export enum AppState {
  INITIAL,
  FOREGROUND,
  BACKGROUND
}

const useAppState = () => {
  const [getStatus, setStatus] = useState<AppState>(AppState.INITIAL);

  App.addListener('appStateChange',
    ({isActive}) => {
      setStatus(isActive ? AppState.FOREGROUND : AppState.BACKGROUND);
    }
  );

  return getStatus;
};

export default useAppState;
