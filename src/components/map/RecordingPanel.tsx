import React, {FC, useState} from 'react';

//MUI
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

//CATOFFLINE
import Header from '../common/Header';
import Notification from '../notifications/Notification';
import TrackRecButton from '../buttons/TrackRecButton';
import TrackRecordingButton from '../buttons/TrackRecordingButton';

//UTILS
import {useTranslation} from 'react-i18next';
import {HEXColor} from '../../types/commonTypes';
import moment from 'moment';
import 'moment-duration-format';
import {Theme} from '@mui/material';

export type RecordingPanelProps = {
  isAccessibleSize: boolean,
  name: string,
  color: HEXColor,
  recordingStatus: 'rec' | 'pause' | 'stop',
    time: EpochTimeStamp,
    onControlClick: () => void,
    onRecStart: () => void
}

const RECORDING_STATUS = {
  REC: 'rec',
  PAUSE: 'pause',
  STOP: 'stop'
};

const RecordingPanel: FC<RecordingPanelProps> = ({
  isAccessibleSize,
  name,
  color,
  recordingStatus,
  time,
  onControlClick,
  onRecStart
}) => {

  const {t} = useTranslation();

  const [isNotificationOpen, setNotificationOpen] = useState(!!RECORDING_STATUS.REC);

  const handleRecStart = () => onRecStart();

  const buttonContainer = {
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
  const formattedTime = durationTime.format('hh:mm:ss');

  //moment.locale('en')'ca' 'es'
  return <>
    <Header startIcon={<FiberManualRecordIcon/>} name={name} color={color} sx={headerSx}>
      <Typography sx={timeSx}>{formattedTime}</Typography>
    </Header>
    <Notification
      message={t('actions.recording')}
      onClose={() => setNotificationOpen(false)}
      isOpen={isNotificationOpen}
      variant='center'
    />
    <Stack direction='row' justifyContent='center' sx={buttonContainer}>
      {
        recordingStatus === RECORDING_STATUS.STOP ? 
          <TrackRecButton isAccessibleSize={isAccessibleSize} onRecStart={handleRecStart}/> :
          <TrackRecordingButton isAccessibleSize={isAccessibleSize} selectedControlId={recordingStatus} onControlClick={onControlClick}/>
      }
    </Stack>
  </>;
};

export default RecordingPanel;