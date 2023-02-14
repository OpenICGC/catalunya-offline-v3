import React, {FC} from 'react';

//MUI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import LinearProgress from '@mui/material/LinearProgress';
import ShareIcon from '@mui/icons-material/Share';

//UTILS
import {useTranslation} from 'react-i18next';


//STYLES
const dialogSx = {
  bgcolor: 'secondary.main',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: 1.35
};

const ProgressDialog: FC = () => {
  const {t} = useTranslation();

  return <Dialog open={true} fullWidth PaperProps={{sx: {height: 'auto', pb: 4}}}>
    <DialogTitle sx={dialogSx}>
      <ShareIcon sx={{mr: 2}}/>
      {t('actions.sharing')}
    </DialogTitle>
    <LinearProgress />
  </Dialog>;
};

export default ProgressDialog;
