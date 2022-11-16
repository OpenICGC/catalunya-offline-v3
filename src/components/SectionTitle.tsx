import React, {FC} from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import {useTranslation} from 'react-i18next';

const typographySx = {
  fontWeight: 'bold'
};

type Props = {
  titleKey: string,
};

const SectionTitle: FC<Props> = ({titleKey}) => {
  const {t} = useTranslation();
  return (
    <Box mt={2} mb={1} >
      <Typography
        variant='subtitle1'
        sx={typographySx}
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
