import React, {FC, useState} from 'react';

//MUI
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

//CATOFFLINE
import Header from '../common/Header';
import Notification from '../notifications/Notification';
import RecordButton from '../buttons/RecordButton';
import RecordingButtons from '../buttons/RecordingButtons';

//OTHERS
import moment from 'moment';
import 'moment-duration-format';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor} from '../../types/commonTypes';
import {Theme} from '@mui/material';

export type RecordingPanelProps = {
  isAccessibleSize: boolean,
  name: string,
  color: HEXColor,
  recordingStatusId: RECORDING_STATUS,
    time: EpochTimeStamp,
    onClick: (status: RECORDING_STATUS) => void,
}

export enum RECORDING_STATUS {
  INITIAL, RECORDING,  PAUSE, STOP
}

const RecordingPanel: FC<RecordingPanelProps> = ({
  isAccessibleSize,
  name,
  color,
  recordingStatusId,
  time,
  onClick
}) => {

  const {t} = useTranslation();
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  const handleClick = (id: RECORDING_STATUS) => {
    onClick(id);
    setNotificationOpen(true);
  };

  const handleRecordClick = () => {
    onClick(RECORDING_STATUS.RECORDING);
    setNotificationOpen(true);
  };
  
  const iconActive = {
    [RECORDING_STATUS.RECORDING]: <FiberManualRecordIcon/>,
    [RECORDING_STATUS.PAUSE]: <PauseIcon/>,
    [RECORDING_STATUS.STOP]: <StopIcon/>,
    [RECORDING_STATUS.INITIAL]: <></>
  };

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
  const timeSx = {
    color:(theme: Theme) => theme.palette.getContrastText(color)
  };
  
  const durationTime = moment.duration(time, 'seconds');
  const formattedTime = durationTime.format('hh[h] mm[m] ss[s]');

  return <>
    <Header startIcon={!!iconActive[recordingStatusId] && iconActive[recordingStatusId]} name={name} color={color} sx={headerSx}>
      <Typography sx={timeSx}>{formattedTime}</Typography>
    </Header>
    <Notification
      message={t(`actions.${RECORDING_STATUS[recordingStatusId].toLowerCase()}`)}
      onClose={() => setNotificationOpen(false)}
      isOpen={isNotificationOpen}
      variant='center'
    />
    <Stack direction='row' justifyContent='center' sx={buttonContainerSx}>
      {
        recordingStatusId === RECORDING_STATUS.INITIAL ?
          <RecordButton isAccessibleSize={isAccessibleSize} onClick={handleRecordClick}/> :
          <RecordingButtons isAccessibleSize={isAccessibleSize} selectedButtonId={recordingStatusId} onStatusClick={handleClick}/>
      }
    </Stack>
  </>;
};

export default RecordingPanel;