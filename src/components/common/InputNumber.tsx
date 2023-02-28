import React, {FC} from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

//TYPES
type Props = {
  value: number,
  onChange: (value: number) => void
};

const InputNumber: FC<Props> = ({
  value,
  onChange,
}) => {
  const handleClick = (value: number) => onChange && onChange(value);

  return <Box display='flex' flexDirection='column' justifyContent='flex-start'>
    <Box display='flex' flexDirection='row' alignItems='center'>
      <IndeterminateCheckBoxIcon
        color='primary'
        onClick={() => handleClick(value - 1)}
      />
      <Typography sx={{mx:0.5}} variant='subtitle1'>{value}</Typography>
      <AddBoxIcon
        color='primary'
        onClick={() => handleClick(value + 1)}
      />
    </Box>
  </Box>;
};
export default InputNumber;