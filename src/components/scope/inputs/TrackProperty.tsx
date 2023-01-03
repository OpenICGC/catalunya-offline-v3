import React, {FC, ReactNode} from 'react';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export interface TrackPropertyProps {
  icon: ReactNode,
    value?: string | number | false
}

const TrackProperty: FC<TrackPropertyProps> = ({
  icon,
  value
}) => {
  return <Stack direction='row' alignItems='center'>
    <IconButton size='small' disabled={!value}>
      {icon}
    </IconButton>
    {value ? 
      <Typography variant="caption" sx={{px: 0, color: undefined }}>{value}</Typography> :
      <Typography variant="caption" sx={{px: 2, color: 'action.disabled'}}>{'-'}</Typography>
    }
  </Stack>;
};

export default TrackProperty;