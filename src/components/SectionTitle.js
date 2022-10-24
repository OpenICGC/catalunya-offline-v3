import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import {useTranslation} from 'react-i18next';

const SectionTitle = ({titleKey}) => {
  const {t} = useTranslation();
  return (
    <Box mb={1} >
      <Typography
        variant='subtitle1'
        sx={{fontWeight: 'bold'}}
      >
        {t(titleKey)}
      </Typography>
      <Divider/>
    </Box>
  );
};

SectionTitle.propTypes = {
  titleKey: PropTypes.string.isRequired,
};

export default SectionTitle;
