import {useCallback, useState} from 'react';

const useStopWatch = () => {
  const [time, setTime] = useState(0);
  const [, setTimer] = useState<number>();

  const activateTimer = useCallback((start: boolean) => setTimer(prevTimer => {
    if (prevTimer) window.clearInterval(prevTimer);
    return start ?
      window.setInterval(() =>
        setTime(prevState => prevState + 1)
      , 1000) :
      undefined;
  }), []);

  const start = useCallback(() => {
    setTime(0);
    activateTimer(true);
  }, []);

  const pause = useCallback(() => activateTimer(false), []);
  const resume = useCallback(() => activateTimer(true), []);

  const stop = useCallback(() => {
    activateTimer(false);
    setTime(0);
  }, []);

  return {
    time,
    start,
    pause,
    resume,
    stop
  };
};

export default useStopWatch;
