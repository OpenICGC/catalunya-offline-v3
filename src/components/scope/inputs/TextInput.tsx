import React, {FC} from 'react';
import TextField from '@mui/material/TextField';
import InputBase from '@mui/material/InputBase';
import {UUID} from '../../../types/commonTypes';

const textFieldNoEditableSx = {
  borderRadius: '4px',
  flexGrow: 1,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    padding: '8px',
    fontSize: '0.875rem',
    minWidth: '25px',
    cursor: 'default'
  }
};

const textFieldEditableSx = {
  flexGrow: 1,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    outline: '0px solid white',
    padding: '8px',
    fontSize: '0.875rem',
    minWidth: '30px'
  }
};

export interface TextInputProps {
  isEditing: boolean,
  id: UUID,
  text?: string,
  onChange: (text: string, id: UUID) => void
}

const TextInput: FC<TextInputProps> = ({
  isEditing,
  id,
  text,
  onChange
}) => {

  return isEditing ?
    <TextField size='small' label='' variant='outlined' sx={textFieldEditableSx}
      onChange={(e) => onChange(e.target.value, id)}
      value={text}/>
    : <InputBase inputProps={{ readOnly: true }} sx={textFieldNoEditableSx}
      defaultValue={text ?? '-'}
    />;
};

export default TextInput;
