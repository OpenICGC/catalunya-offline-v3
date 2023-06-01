import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
/*import SvgIcon from '@mui/material/SvgIcon';*/

//MUI-ICON
import AppShortcutIcon from '@mui/icons-material/AppShortcut';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';

//UTILS
import {useTranslation} from 'react-i18next';
import LogoICGC from '../icons/LogoICGC';
import version from '../../../package.json';

const dialogSx = {
  bgcolor: 'secondary.main',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: 1.35
};

const iconTitleSx = {
  position: 'absolute',
  right: 8,
  top: 8
};

const versionSx = {
  justifyContent: 'center',
  width: '140px',
  '& .MuiChip-label': {
    ml: 1
  }
};

const iconLinkSx = {
  mb: 2,
  display: 'flex',
  maxWidth: {
    xs: '80px',
    sm: '300px'
  },
  flexDirection: {
    xs: 'column',
    sm: 'row'
  },
  alignItems: 'center'
};

const textSx = {
  textAlign: 'justify'
};

//TYPES
export type AboutDialogProps = {
  onClose: () => void
};

const AboutDialog: FC<AboutDialogProps> = ({
  onClose
}) => {

  const {t} = useTranslation();
  const handleClose = () => onClose();

  return <Dialog open={true} fullWidth onClose={handleClose}>
    <DialogTitle sx={dialogSx}>
      <InfoIcon sx={{mr: 2}}/>
      {t('about.title')}
      <IconButton
        onClick={handleClose}
        sx={iconTitleSx}
      >
        <CloseIcon/>
      </IconButton>
    </DialogTitle>
    <DialogContent sx={{mt: 2, display: 'flex', flexDirection: 'column'}}>
      <Link href={t('about.presentation_link')} target='_blank' rel='noreferrer' sx={{mb:2}}>
        <LogoICGC/>
      </Link>
      <Typography gutterBottom sx={textSx}>{t('about.content_01')}</Typography>
      <Typography gutterBottom sx={textSx}>{t('about.content_02')}</Typography>
      <Typography gutterBottom sx={textSx}>{t('about.content_03')}</Typography>

      <Box sx={{display: 'flex', flexDirection: 'row', justifyContent: 'space-around', spacing: 10}}>

        <Link
          href={t('about.tutorial_link')}
          target='_blank' rel='noreferrer' underline='hover' sx={iconLinkSx}>
          <IconButton>
            <OndemandVideoIcon color='primary'/>
          </IconButton>
          <Typography align='center'> {t('about.video-tutorial')}</Typography>
        </Link>

        <Link href={t('about.otherApps_link')}
          target='_blank' rel='noreferrer' underline='hover' sx={iconLinkSx}>
          <IconButton>
            <AppShortcutIcon color='primary'/>
          </IconButton>
          <Typography align='center'>{t('about.otherApps')}</Typography>
        </Link>

        <Link href={t('about.presentation_link')}
          target='_blank' rel='noreferrer' underline='hover' sx={iconLinkSx}>
          <IconButton>
            <HelpCenterIcon color='primary'/>
          </IconButton>
          <Typography align='center'>{t('about.moreInfo')}</Typography>
        </Link>

      </Box>

      <Divider sx={{mb: 2}}/>

      <Chip label={
        <>
          <Typography variant='caption' sx={{fontWeight: 'bolder'}}>{`${t('about.version')}: `}</Typography>
          <Typography variant='caption' sx={{mr: 1}}>{version.version}</Typography>
        </>
      } sx={versionSx} size='small'/>
    </DialogContent>
  </Dialog>;
};
export default AboutDialog;