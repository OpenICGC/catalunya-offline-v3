import React, {FC, useState} from 'react';

//MUI
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import RecordingIcon from '@mui/icons-material/FiberManualRecord';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

//CATOFFLINE
import Header from '../common/Header';
import Notification from '../notifications/Notification';
import RecordButton from '../buttons/RecordButton';
import RecordingButtonGroup from '../buttons/RecordingButtonGroup';

//OTHERS
import moment from 'moment';
import 'moment-duration-format';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor} from '../../types/commonTypes';
import {Theme} from '@mui/material';

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
  INITIAL,
  RECORDING,
  PAUSE,
  STOP
}

export type RecordingPanelProps = {
  isAccessibleSize: boolean,
  name: string,
  color: HEXColor,
  time: EpochTimeStamp,
  recordingStatus: RECORDING_STATUS,
  onStatusChange: (status: RECORDING_STATUS) => void,
}

const RecordingPanel: FC<RecordingPanelProps> = ({
  isAccessibleSize,
  name,
  color,
  time,
  recordingStatus,
  onStatusChange
}) => {
  const {t} = useTranslation();
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const handleClick = (status: RECORDING_STATUS) => {
    onStatusChange(status);
    setNotificationOpen(true);
  };

  const handleRecordClick = () => {
    onStatusChange(RECORDING_STATUS.RECORDING);
    setNotificationOpen(true);
  };
  
  const iconActive = {
    [RECORDING_STATUS.INITIAL]: <></>,
    [RECORDING_STATUS.RECORDING]: <RecordingIcon/>,
    [RECORDING_STATUS.PAUSE]: <PauseIcon/>,
    [RECORDING_STATUS.STOP]: <StopIcon/>
  };

  const timeSx = {
    color:(theme: Theme) => theme.palette.getContrastText(color)
  };
  
  const durationTime = moment.duration(time, 'seconds');
  const formattedTime = durationTime.format('h[h] mm[m] ss[s]');

  return <>
    <Header startIcon={!!iconActive[recordingStatus] && iconActive[recordingStatus]} name={name} color={color} sx={headerSx}>
      <Typography sx={timeSx}>{formattedTime}</Typography>
    </Header>
    <Notification
      message={t(`actions.${RECORDING_STATUS[recordingStatus].toLowerCase()}`)}
      onClose={() => setNotificationOpen(false)}
      isOpen={isNotificationOpen}
      variant='center'
    />
    <Stack direction='row' justifyContent='center' sx={buttonContainerSx}>
      {
        recordingStatus === RECORDING_STATUS.INITIAL ?
          <RecordButton isAccessibleSize={isAccessibleSize} onClick={handleRecordClick}/> :
          <RecordingButtonGroup isAccessibleSize={isAccessibleSize} recordingStatus={recordingStatus} onButtonClick={handleClick}/>
      }
    </Stack>
  </>;
};

export default RecordingPanel;
