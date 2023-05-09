import React, {FC, useCallback, useMemo, useState} from 'react';

//MUI
import Stack from '@mui/material/Stack';

//CATOFFLINE
import Notification from '../notifications/Notification';
import RecordingButtonGroup from '../buttons/RecordingButtonGroup';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor} from '../../types/commonTypes';
import useTheme from '@mui/material/styles/useTheme';
import TrackRecorderHeader from './TrackRecorderHeader';

const buttonContainerSx = (bottomMargin: number | undefined) => ({
  position: 'absolute',
  bottom: bottomMargin ? `${bottomMargin+8}px` : '8px',
  left: 0,
  py: 1,
  zIndex: 1000,
  width: '100vw'
});

export enum RECORDING_STATUS {
  STOPPED,
  RECORDING,
  PAUSED
}

export type TrackRecorderProps = {
  name?: string,
  color?: HEXColor,
  bottomMargin?: number,
  startTime?: number,
  onPause: () => void,
  onResume: () => void,
  onStop: () => void
}

const TrackRecorder: FC<TrackRecorderProps> = ({
  name,
  color,
  bottomMargin,
  startTime,
  onPause,
  onResume,
  onStop
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<RECORDING_STATUS>(RECORDING_STATUS.RECORDING);

  const handleClose = useCallback(() => setNotificationOpen(false), []);

  const handleButtonGroupClick = useCallback((status: RECORDING_STATUS) => {
    setRecordingStatus(status);
    setNotificationOpen(true);
    switch (status) {
    case RECORDING_STATUS.PAUSED:
      onPause();
      break;
    case RECORDING_STATUS.RECORDING:
      onResume();
      break;
    case RECORDING_STATUS.STOPPED:
      onStop();
      setRecordingStatus(RECORDING_STATUS.RECORDING);
      break;
    }
  }, [onPause, onResume, onStop]);

  const stackSx = useMemo(() => buttonContainerSx(bottomMargin), [bottomMargin]);

  const statusMessage = useMemo(() => t(`actions.${RECORDING_STATUS[recordingStatus].toLowerCase()}`), [recordingStatus]);

  const headerName = useMemo(() => (name ? `${name.toUpperCase()} - ` : '') + statusMessage, [name, statusMessage]);
  const headerColor = useMemo(() => color ? color : (theme.palette.secondary.main as HEXColor), [color, theme.palette.secondary.main]);

  return <>
    <TrackRecorderHeader
      recordingStatus={recordingStatus}
      headerName={headerName}
      headerColor={headerColor}
      startTime={startTime}
    />
    <Notification
      message={statusMessage}
      onClose={handleClose}
      isOpen={isNotificationOpen}
      variant='center'
    />
    <Stack direction='row' justifyContent='center' sx={stackSx}>
      <RecordingButtonGroup recordingStatus={recordingStatus} onButtonClick={handleButtonGroupClick}/>
    </Stack>
  </>;
};

export default React.memo(TrackRecorder);
