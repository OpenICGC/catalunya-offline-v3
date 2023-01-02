import React, {FC} from 'react';

//MUI
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

//OTHERS
import moment, {Moment} from 'moment/moment';

//UTILS
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';
import styled from '@mui/styles/styled';
import {SxProps} from '@mui/system/styleFunctionSx/styleFunctionSx';
import {Theme} from '@mui/material';
import {ScopePoint, ScopeTrack} from '../../../types/commonTypes';

export interface DateInputProps {
    isEditing: boolean,
    feature: ScopePoint | ScopeTrack,
    onChange: (value: Moment | null) => void,
    sx?: SxProps
}

const classes = {
  root: 'GenericInput-wrapper',
  title: 'GenericInput-title',
};

const DateTimeFieldEditable = styled(TextField)({
  flexGrow: 1,
  fontSize: '0.875rem',
  '& .MuiInputBase-input': {
    outline: '0px solid white',
    padding: '4px',
    fontSize: '0.875rem',
    minWidth: '30px'
  },
  '& .MuiButtonBase-root': {
    paddingRight: '2px'
  }
});

const DateTimeFieldNoEditable = styled(TextField)<Theme>(({theme}) => {
  return {
    borderRadius: '4px',
    flexGrow: 1,
    fontSize: '0.875rem',
    '& .MuiInputBase-input': { //text
      padding: '4px',
      fontSize: '0.875rem',
      minWidth: '25px',
      cursor: 'default',
    },
    '&:hover': {
      borderColor: 'transparent',
    },
    '& fieldset.MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
    },
    '&:hover fieldset.MuiOutlinedInput-notchedOutline': {
      borderColor: 'transparent',
    },
    '& fieldset.MuiOutlinedInput-notchedOutline:hover': {
      borderColor: 'transparent',
    },
    '& .MuiButtonBase-root': { //icon
      paddingRight: '2px',
      color: theme.palette.action.active
    }
  };
});

const DateInput: FC<DateInputProps> = ({
  isEditing,
  onChange,
  feature,
  sx
}) => {
  const {t} = useTranslation();
    
  return <Stack className={classes.root} sx={sx}>
    <Typography className={classes.title} variant='caption'>{t('properties.date')}</Typography>
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={i18n.language}>
      <DateTimePicker
        key='dateTime'
        readOnly={!isEditing}
        onChange={onChange}
        value={moment(feature.properties.timestamp, 'x')}
        renderInput={(params) => isEditing ?
          <DateTimeFieldEditable {...params} size="small" /> :
          <DateTimeFieldNoEditable {...params} />}
      />
    </LocalizationProvider>
  </Stack>;
};

export default DateInput;