import React, {FC} from 'react';

//MUI-ICONS
import RecordIcon from '@mui/icons-material/FiberManualRecord';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

//OTHERS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';

//UTILS
import {RECORDING_STATUS} from '../map/RecordingPanel';

const recordIconSx = {color: '#d32f2f'};

export interface RecordingButtonGroupProps {
  isAccessibleSize: boolean,
  recordingStatus: RECORDING_STATUS,
  onButtonClick: (id: RECORDING_STATUS) => void
}

const RecordingButtonGroup: FC<RecordingButtonGroupProps> = ({
  isAccessibleSize,
  recordingStatus,
  onButtonClick
}) => {
  const pauseIconSx = {color: recordingStatus === RECORDING_STATUS.PAUSE ? 'white': 'grey.700'};
  const stopIconSx = {color: recordingStatus === RECORDING_STATUS.STOP ? 'white': 'grey.700'};

  const controls = [
    {
      id: RECORDING_STATUS.RECORDING,
      content: <RecordIcon sx={recordIconSx}/>
    },
    {
      id: RECORDING_STATUS.PAUSE,
      content: <PauseIcon sx={pauseIconSx}/>
    },
    {
      id: RECORDING_STATUS.STOP,
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

  const handleItemClick = (itemId: number) => {
    if (itemId !== null) {
      onButtonClick(itemId);
    }
  };

  return <ButtonGroup
    variant='contained'
    color='#616161'
    sx={recordingButtonSx}
    items={controls}
    selectedItemId={recordingStatus}
    onItemClick={handleItemClick}
  />;
};

export default RecordingButtonGroup;
