import React, {ChangeEvent, FC} from 'react';

//MUI
import Box from '@mui/material/Box';

//MUI-ICONS
import DeleteIcon from '@mui/icons-material/Delete';

//CATOFFLINE
import FeatureToApplyButton, {FEATURE_APPLIED} from '../buttons/FeatureToApplyButton';

//UTILS
import {SchemaFieldType, UUID} from '../../types/commonTypes';
import TextField from '@mui/material/TextField';

//STYLES
const wrapperSx = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  mb: 1
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
  schemaField: SchemaFieldType
  onDelete: (fieldId: UUID) => void,
  onNameChange: (fieldId: UUID, name: string) => void
  onPointToApplyChange: (fieldId: UUID) => void,
  onTrackToApplyChange: (fieldId: UUID) => void
};

const SchemaField: FC<SchemaFieldProps> = ({
  schemaField,
  onPointToApplyChange,
  onTrackToApplyChange,
  onDelete,
  onNameChange
}) => {

  const handlePointButtonClick = () => onPointToApplyChange(schemaField.id);
  const handleTrackButtonClick = () => onTrackToApplyChange(schemaField.id);

  const handleDelete = () => onDelete(schemaField.id);
  const handleFieldChange = (e: ChangeEvent<HTMLInputElement>) => onNameChange(schemaField.id, e.target.value);


  return <Box sx={wrapperSx}>
    <Box sx={wrapperSx} gap={1}>
      <FeatureToApplyButton isSelected={schemaField.appliesToPoints} onClick={handlePointButtonClick} feature={FEATURE_APPLIED.POINT}/>
      <FeatureToApplyButton isSelected={schemaField.appliesToTracks} onClick={handleTrackButtonClick} feature={FEATURE_APPLIED.TRACK}/>
    </Box>
    <TextField size='small' value={schemaField.name} sx={textFieldSx} onChange={handleFieldChange}/>
    <DeleteIcon onClick={handleDelete} sx={{color: 'action.active'}}/>
  </Box>;
};


export default SchemaField;