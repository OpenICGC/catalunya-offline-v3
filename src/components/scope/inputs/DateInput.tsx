import React, {FC} from 'react';

//MUI
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment';
import {DateTimePicker} from '@mui/x-date-pickers/DateTimePicker';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

//OTHERS
import moment, {Moment} from 'moment/moment';

//UTILS
import i18n from 'i18next';
import {useTranslation} from 'react-i18next';
import styled from '@mui/material/styles/styled';
import {SxProps} from '@mui/system/styleFunctionSx/styleFunctionSx';

export interface DateInputProps {
    isEditing: boolean,
    timestamp: number,
    onChange: (value: number) => void,
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

const DateTimeFieldNoEditable = styled(TextField)(({theme}) => {
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
  timestamp,
  sx
}) => {
  const {t} = useTranslation();

  const handleChange = (value: Moment | null) => {
    if(value !== null) {
      onChange(value.toDate().getTime()); // timestamp in milliseconds
    }
  };
  
  return <Stack className={classes.root} sx={sx}>
    <Typography className={classes.title} variant='caption'>{t('properties.date')}</Typography>
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={i18n.language}>
      <DateTimePicker
        key='dateTime'
        readOnly={!isEditing}
        onChange={handleChange}
        value={timestamp}
        renderInput={(params) => isEditing ?
          <DateTimeFieldEditable {...params} size="small" /> :
          <DateTimeFieldNoEditable {...params} />}
      />
    </LocalizationProvider>
  </Stack>;
};

export default React.memo(DateInput);
