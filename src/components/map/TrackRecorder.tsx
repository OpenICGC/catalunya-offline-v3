import React, {FC, useState} from 'react';

//MUI
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import RecordingIcon from '@mui/icons-material/FiberManualRecord';
import PauseIcon from '@mui/icons-material/Pause';

//CATOFFLINE
import Header from '../common/Header';
import Notification from '../notifications/Notification';
import RecordingButtonGroup from '../buttons/RecordingButtonGroup';

//OTHERS
import moment from 'moment';
import 'moment-duration-format';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor} from '../../types/commonTypes';
import useTheme from '@mui/material/styles/useTheme';

const buttonContainerSx = {
  position: 'absolute',
  bottom: '8px',
  left: 0,
  py: 1,
  zIndex: 1000,
  width: '100vw'
};
const headerSx = {
  '&.Header-root': {
    position: 'absolute', top: 0
  }
};

export enum RECORDING_STATUS {
  STOPPED,
  RECORDING,
  PAUSED
}

export type TrackRecorderProps = {
  name?: string,
  color?: HEXColor,
  elapsedTime: number,
  onPause: () => void,
  onResume: () => void,
  onStop: () => void
}

const TrackRecorder: FC<TrackRecorderProps> = ({
  name,
  color,
  elapsedTime,
  onPause,
  onResume,
  onStop
}) => {
  const {t} = useTranslation();
  const theme = useTheme();
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [recordingStatus, setRecordingStatus] = useState<RECORDING_STATUS>(RECORDING_STATUS.RECORDING);

  const handleButtonGroupClick = (status: RECORDING_STATUS) => {
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
  };

  const iconActive = {
    [RECORDING_STATUS.STOPPED]: <></>,
    [RECORDING_STATUS.RECORDING]: <RecordingIcon/>,
    [RECORDING_STATUS.PAUSED]: <PauseIcon/>
  };

  const durationTime = moment.duration(elapsedTime, 'seconds');
  const formattedTime = durationTime.format('h[h] mm[m] ss[s]');

  const statusMessage = t(`actions.${RECORDING_STATUS[recordingStatus].toLowerCase()}`);

  const headerName = (name ? `${name.toUpperCase()} - ` : '') + statusMessage;
  const headerColor = color ? color : (theme.palette.secondary.main as HEXColor);

  const timeSx = {
    color: theme.palette.getContrastText(headerColor)
  };

  return <>
    <Header startIcon={!!iconActive[recordingStatus] && iconActive[recordingStatus]} name={headerName} color={headerColor} sx={headerSx}>
      <Typography sx={timeSx}>{formattedTime}</Typography>
    </Header>
    <Notification
      message={statusMessage}
      onClose={() => setNotificationOpen(false)}
      isOpen={isNotificationOpen}
      variant='center'
    />
    <Stack direction='row' justifyContent='center' sx={buttonContainerSx}>
      <RecordingButtonGroup recordingStatus={recordingStatus} onButtonClick={handleButtonGroupClick}/>
    </Stack>
  </>;
};

export default TrackRecorder;
