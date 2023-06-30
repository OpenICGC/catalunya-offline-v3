import React, {FC} from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';

export interface StorageProgressProps {
  progress: number
}

const StorageProgress: FC<StorageProgressProps> = ({progress}) => {
  return <Box sx={{m: 2}}>
    <Typography variant='caption'>Espai ocupat</Typography>
    <Box sx={{display: 'flex', alignItems: 'center'}}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant='determinate' value={progress}/>
      </Box>
      <Typography variant="body2">{progress?.toFixed(1)}%</Typography>
    </Box>
  </Box>;
};

export default React.memo(StorageProgress);
