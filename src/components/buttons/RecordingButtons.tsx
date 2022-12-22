import React, {FC} from 'react';

//MUI-ICONS
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';

//OTHERS
import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';

//UTILS
import {Theme} from '@mui/material';
import {RECORDING_STATUS} from '../map/RecordingPanel';

export interface RecordingButtonsProps {
    isAccessibleSize: boolean,
  selectedButtonId: RECORDING_STATUS,
    onStatusClick: (id: RECORDING_STATUS) => void,
}

const RecordingButtons: FC<RecordingButtonsProps> = ({
  isAccessibleSize,
  selectedButtonId,
  onStatusClick
}) => {
  const controls = [
    {
      id: RECORDING_STATUS.RECORDING,
      content: <FiberManualRecordIcon sx={{color: '#d32f2f'}}/>
    },
    {
      id: RECORDING_STATUS.PAUSE,
      content: <PauseIcon sx={{color: selectedButtonId === RECORDING_STATUS.PAUSE ? 'white': 'grey.700'}}/>
    },
    {
      id: RECORDING_STATUS.STOP,
      content: <StopIcon sx={{color: selectedButtonId === RECORDING_STATUS.STOP ? 'white': 'grey.700'}}/>
    },
  ];
  const recordingButtonSx = {
    '& .ButtonGroup-button': {
      backgroundColor: 'white',
      borderColor: 'grey.700',
      '&.MuiButtonBase-root': {
        borderColor: (theme: Theme) => theme.palette.grey[700],
        borderWidth: '1px',
        width: isAccessibleSize ? '64px' : '56px',
        height: isAccessibleSize ? '42px' : '37px',
        '&:hover': {
          borderColor: (theme: Theme) => theme.palette.grey[700],
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
      borderColor: 'grey.700',

    }
  };

  return <ButtonGroup
    color='#616161'
    items={controls}
    selectedItemId={selectedButtonId}
    onItemClick={onStatusClick}
    variant='contained'
    sx={recordingButtonSx}
  />;
};

export default RecordingButtons;