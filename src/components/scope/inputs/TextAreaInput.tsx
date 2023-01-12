import React, {FC, useMemo} from 'react';
import Typography from '@mui/material/Typography';
import {SxProps} from '@mui/system/styleFunctionSx/styleFunctionSx';
import Stack from '@mui/material/Stack';
import styled from '@mui/styles/styled';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import {useTranslation} from 'react-i18next';

const classes = {
  root: 'GenericInput-wrapper',
  title: 'GenericInput-title',
};

export interface TextAreaInputProps {
  isEditing: boolean,
    text: string,
    onChange: (text: string) => void,
    sx?: SxProps
}

const TextAreaInput: FC<TextAreaInputProps> = ({
  isEditing,  
  text,
  onChange,
  sx
}) => {
  const {t} = useTranslation();

  const TextAreaEditable = useMemo(() => styled(TextareaAutosize)({
    cursor: 'default',
    padding: '8px',
    fontFamily: '\'Roboto\',\'Helvetica\',\'Arial\'',
    fontSize: '0.9rem',
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
      value={text || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  </Stack>;
};

export default TextAreaInput;