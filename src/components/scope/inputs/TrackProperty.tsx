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
    <IconButton size='small' disabled={!value} disableFocusRipple disableRipple sx={{cursor: 'default'}}>
      {icon}
    </IconButton>
    {value ? 
      <Typography noWrap variant="caption" sx={{px: 0, color: undefined, cursor: 'default' }}>{value}</Typography> :
      <Typography noWrap variant="caption" sx={{px: 2, color: 'action.disabled', cursor: 'default'}}>{'-'}</Typography>
    }
  </Stack>;
};

export default TrackProperty;