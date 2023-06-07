import React, {ChangeEvent, FC} from 'react';

//MUI
import Box from '@mui/material/Box';

//MUI-ICONS
import DeleteIcon from '@mui/icons-material/Delete';

//CATOFFLINE
import FeatureToApplyButton, {FEATURE_APPLIED} from '../buttons/FeatureToApplyButton';

//UTILS
import {UUID} from '../../types/commonTypes';
import TextField from '@mui/material/TextField';

//STYLES
const wrapperSx = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center'
};

const textFieldSx = {
  ml: 1,
  flexGrow: 1,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    ml: 1,
    outline: '0px solid white',
    padding: '4px',
    fontSize: '0.875rem',
    minWidth: '30px'
  },
  '& .Mui-error': {
    borderWidth: 15,
    bgcolor: 'rgba(239,83,80,0.22)'
  }
};

export type SchemaFieldProps = {
  id: UUID,
  name: string,
  error?: string,
  appliesToPoints: boolean,
  appliesToTracks: boolean,
  onDelete: (fieldId: UUID) => void,
  onNameChange: (fieldId: UUID, name: string) => void
  onPointApply: (isSelected: boolean) => void,
  onTrackApply: (isSelected: boolean) => void,
};

const SchemaField: FC<SchemaFieldProps> = ({
  id,
  name,
  appliesToPoints,
  appliesToTracks,
  error = undefined,
  onPointApply,
  onTrackApply,
  onDelete,
  onNameChange
}) => {

  const handlePointClick = (selected: boolean) => onPointApply(selected);
  const handleTrackClick = (selected: boolean) => onTrackApply(selected);

  const handleDelete = () => onDelete(id);
  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => onNameChange(id, e.target.value);


  return <Box sx={wrapperSx}>
    <Box sx={wrapperSx} gap={1}>
      <FeatureToApplyButton isSelected={appliesToPoints} onClick={handlePointClick} feature={FEATURE_APPLIED.POINT}/>
      <FeatureToApplyButton isSelected={appliesToTracks} onClick={handleTrackClick} feature={FEATURE_APPLIED.TRACK}/>
    </Box>
    <TextField size='small' value={name} sx={textFieldSx} onChange={handleFieldChange} error={!!error}/>
    <DeleteIcon onClick={handleDelete} sx={{color: 'action.active'}}/>
  </Box>;
};


export default SchemaField;