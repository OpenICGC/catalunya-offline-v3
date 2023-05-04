import React, {FC, useEffect, useMemo, useState} from 'react';
import Header from '../common/Header';
import Typography from '@mui/material/Typography';
import useTheme from '@mui/material/styles/useTheme';
import RecordingIcon from '@mui/icons-material/FiberManualRecord';
import PauseIcon from '@mui/icons-material/Pause';
import {RECORDING_STATUS} from './TrackRecorder';
import {HEXColor} from '../../types/commonTypes';

const headerSx = {
  '&.Header-root': {
    position: 'absolute',
    top: 0
  }
};

export interface TrackRecorderHeaderProps {
  recordingStatus: RECORDING_STATUS,
  headerName: string,
  headerColor: HEXColor,
  startTime?: number
}

const TrackRecorderHeader: FC<TrackRecorderHeaderProps> = ({recordingStatus, headerName, headerColor, startTime}) => {
  const theme = useTheme();
  const [formattedTime, setFormattedTime] = useState<string>('');

  const iconActive = useMemo(() => ({
    [RECORDING_STATUS.STOPPED]: <></>,
    [RECORDING_STATUS.RECORDING]: <RecordingIcon/>,
    [RECORDING_STATUS.PAUSED]: <PauseIcon/>
  }), []);

  useEffect(() => {
    if (startTime) {
      const timer = setInterval(() => {
        const elapsedTime = Math.round((Date.now() - startTime) / 1000);
        const seconds = elapsedTime % 60;
        const minutes = Math.floor(elapsedTime/60) % 60;
        const hours = Math.floor(elapsedTime/3600);
        let formattedTime = hours ? hours + 'h ' : '';
        formattedTime += minutes || hours ? minutes + 'm ' : '';
        formattedTime += seconds + 's';
        setFormattedTime(formattedTime);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime]);

  const timeSx = useMemo(() => ({
    color: theme.palette.getContrastText(headerColor),
    minWidth: 100,
    textAlign: 'right'
  }), [theme, headerColor]);

  const startIcon = useMemo(() => !!iconActive[recordingStatus] && iconActive[recordingStatus], [recordingStatus]);

  return <Header startIcon={startIcon} name={headerName} color={headerColor} sx={headerSx}>
    <Typography sx={timeSx}>{formattedTime}</Typography>
  </Header>;
};

export default React.memo(TrackRecorderHeader);
