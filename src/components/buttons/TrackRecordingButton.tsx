import React, {FC} from 'react';

import ButtonGroup from '@geomatico/geocomponents/ButtonGroup';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import PauseIcon from '@mui/icons-material/Pause';
import StopIcon from '@mui/icons-material/Stop';
import {Theme} from '@mui/material';
export interface TrackRecordingButtonProps {
    isAccessibleSize: boolean,
  selectedControlId: string,
    onControlClick: () => void,
}

const TrackRecordingButton: FC<TrackRecordingButtonProps> = ({
  isAccessibleSize,
  selectedControlId,
  onControlClick
}) => {
  const controls = [
    {
      id: 'rec',
      content: <FiberManualRecordIcon sx={{color: '#d32f2f'}}/>
    },
    {
      id: 'pause',
      content: <PauseIcon sx={{color: selectedControlId === 'pause' ? 'white': 'grey.700'}}/>
    },
    {
      id: 'stop',
      content: <StopIcon sx={{color: selectedControlId === 'stop' ? 'white': 'grey.700'}}/>
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
    selectedItemId={selectedControlId}
    onItemClick={onControlClick}
    variant='contained'
    sx={recordingButtonSx}
  />;
};

export default TrackRecordingButton;