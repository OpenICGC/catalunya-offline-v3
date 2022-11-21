import React, {FC} from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

import {useTranslation} from 'react-i18next';

const typographySx = {
  fontWeight: 'bold'
};

export type SectionTitleProps = {
  titleKey: string,
};

const SectionTitle: FC<SectionTitleProps> = ({titleKey}) => {
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

export default SectionTitle;
