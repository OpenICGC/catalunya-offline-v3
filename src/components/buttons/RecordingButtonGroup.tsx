import React, {FC} from 'react';

//MUI-ICONS
import RecordIcon from '@mui/icons-material/FiberManualRecord';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

//OTHERS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';

//UTILS
import {RECORDING_STATUS} from '../map/TrackRecorder';
import {useSettings} from '../../hooks/useSettings';

const recordIconSx = {color: '#d32f2f'};

export interface RecordingButtonGroupProps {
  recordingStatus: RECORDING_STATUS,
  onButtonClick: (id: RECORDING_STATUS) => void
}

const RecordingButtonGroup: FC<RecordingButtonGroupProps> = ({
  recordingStatus,
  onButtonClick
}) => {

  const {isAccessibleSize} = useSettings();

  const pauseIconSx = {color: recordingStatus === RECORDING_STATUS.PAUSED ? 'white': 'grey.700'};
  const stopIconSx = {color: recordingStatus === RECORDING_STATUS.STOPPED ? 'white': 'grey.700'};

  const controls = [
    {
      id: RECORDING_STATUS.RECORDING.toString(),
      content: <RecordIcon sx={recordIconSx}/>
    },
    {
      id: RECORDING_STATUS.PAUSED.toString(),
      content: <PauseIcon sx={pauseIconSx}/>
    },
    {
      id: RECORDING_STATUS.STOPPED.toString(),
      content: <StopIcon sx={stopIconSx}/>
    },
  ];

  const recordingButtonSx = {
    '& .ButtonGroup-button': {
      backgroundColor: 'white',
      borderColor: 'grey.700',
      '&.MuiButtonBase-root': {
        borderColor: 'grey.700',
        borderWidth: '1px',
        width: isAccessibleSize ? '64px' : '56px',
        height: isAccessibleSize ? '42px' : '37px',
        '&:hover': {
          borderColor: 'grey.700',
          borderWidth: '1px',
          backgroundColor: 'white',
        }
      },
      '&.Mui-selected': {
        borderColor: 'grey.700',
        backgroundColor: 'grey.700',
        '&:hover': {
          backgroundColor: 'grey.700',
        }
      }
    },
    '& .ButtonGroup-buttonContent': {
      borderColor: 'grey.700'
    }
  };

  const handleItemClick = (itemId: string) => {
    if (itemId !== null) {
      onButtonClick(parseInt(itemId));
    }
  };

  return <ButtonGroup
    variant='contained'
    color='#616161'
    sx={recordingButtonSx}
    items={controls}
    selectedItemId={recordingStatus.toString()}
    onItemClick={handleItemClick}
  />;
};

export default RecordingButtonGroup;
