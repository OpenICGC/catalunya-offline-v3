import {useState} from 'react';

const useStopWatch = () => {
  const [time, setTime] = useState(0);
  const [, setTimer] = useState<number>();

  const activateTimer = (start: boolean) => setTimer(prevTimer => {
    if (prevTimer) window.clearInterval(prevTimer);
    return start ?
      window.setInterval(() =>
        setTime(prevState => prevState + 1)
      , 1000) :
      undefined;
  });

  return {
    time,
    start: () => {
      setTime(0);
      activateTimer(true);
    },
    pause: () => activateTimer(false),
    resume: () => activateTimer(true),
    stop: () => {
      activateTimer(false);
      setTime(0);
    }
  };
};

export default useStopWatch;
