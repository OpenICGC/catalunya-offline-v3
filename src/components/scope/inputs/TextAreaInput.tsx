import React, {ChangeEvent, FC, useMemo} from 'react';
import Typography from '@mui/material/Typography';
import {SxProps} from '@mui/system/styleFunctionSx/styleFunctionSx';
import Stack from '@mui/material/Stack';
import styled from '@mui/styles/styled';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import {ScopePoint, ScopeTrack} from '../../../types/commonTypes';
import {useTranslation} from 'react-i18next';

const classes = {
  root: 'GenericInput-wrapper',
  title: 'GenericInput-title',
};

export interface TextAreaInputProps {
  isEditing: boolean,
    feature: ScopePoint | ScopeTrack,
    onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void,
    sx?: SxProps
}

const TextAreaInput: FC<TextAreaInputProps> = ({
  isEditing,  
  feature,
  onChange,
  sx
}) => {
  const {t} = useTranslation();
      
  const TextAreaEditable = useMemo(() => styled(TextareaAutosize)({
    cursor: 'default',
    padding: '8px',
    fontFamily: '\'Roboto\',\'Helvetica\',\'Arial\'',
    fontSize: '1rem',
    letterSpacing: '0.00938em',
    fontWeight: 400,
    lineHeight: 1.5,
    border: '0px solid white',
    borderRadius: '4px',
    resize: 'none',
    outline: isEditing ? '1px solid rgba(0,0,0,0.23)' : 'none',
    '&:focus': {
      outline: isEditing ? '2px solid orange' : 'none',
    }
  }), [isEditing]);
    
  return <Stack className={classes.root} sx={sx}>
    <Typography className={classes.title} variant='caption'>{t('properties.description')}</Typography>
    <TextAreaEditable
      key='description'
      readOnly={!isEditing}
      defaultValue={feature.properties.description || ''}
      onChange={onChange}
    />
  </Stack>;
};

export default TextAreaInput;