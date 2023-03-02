import React, {FC, useState} from 'react';

//MUI
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Checkbox from '@mui/material/Checkbox';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';

//MUI-ICONS
import FolderZipIcon from '@mui/icons-material/FolderZip';
import ShareIcon from '@mui/icons-material/Share';

//CATOFFLINE
import CancelButton from '../buttons/CancelButton';
import Kmz from '../icons/Kmz';
import Gpx from '../icons/Gpx';

//UTILS
import {useTranslation} from 'react-i18next';
import {lighten} from '@mui/system/colorManipulator';

//STYLES
const optionSx = {
  '&:hover': {
    bgcolor: 'grey.100'
  },
  borderBottom: '1px solid lightgrey',
  cursor: 'pointer'
};

const cardHeaderSx = {
  '& .MuiCardHeader-subheader': {
    fontSize: '0.75em'
  }
};

const dialogSx = {
  bgcolor: 'secondary.main',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: 1.35
};

export enum SHARE_FORMAT {
  ZIP,
  KMZ,
  GPX
}

export enum FEATURE_SHARED {
  SCOPE,
  TRACK
}

export type ShareDialogProps = {
  featureShared: FEATURE_SHARED,
  onClick: (format: SHARE_FORMAT, shareVisiblePoints?: boolean) => void,
  onCancel: () => void,
}

const formatsForEachFeature = {
  [FEATURE_SHARED.SCOPE]: [SHARE_FORMAT.ZIP, SHARE_FORMAT.KMZ],
  [FEATURE_SHARED.TRACK]: [SHARE_FORMAT.ZIP, SHARE_FORMAT.GPX]
};

const ShareDialog: FC<ShareDialogProps> = ({
  featureShared,
  onClick,
  onCancel
}) => {
  const {t} = useTranslation();
  const [shareVisiblePoints, setShareVisiblePoints] = useState(false);

  const FORMAT_DETAILS = {
    [SHARE_FORMAT.ZIP]: {
      id: SHARE_FORMAT[SHARE_FORMAT.ZIP],
      icon: <FolderZipIcon sx={{color: 'grey.600'}}/>,
      label: t('format.zip.label'),
      message: t('format.zip.message')
    },
    [SHARE_FORMAT.KMZ]: {
      id: SHARE_FORMAT[SHARE_FORMAT.KMZ],
      icon: <Kmz sx={{color: 'grey.600'}}/>,
      label: t('format.kmz.label'),
      message: t('format.kmz.message')
    },
    [SHARE_FORMAT.GPX]: {
      id: SHARE_FORMAT[SHARE_FORMAT.GPX],
      icon: <Gpx sx={{color: 'grey.600'}}/>,
      label: t('format.gpx.label'),
      message: t('format.gpx.message')
    }
  };

  const toggleVisiblePoints = () => setShareVisiblePoints(!shareVisiblePoints);

  const handleClick = (format: SHARE_FORMAT) => {
    if (featureShared === FEATURE_SHARED.TRACK) {
      onClick(format, shareVisiblePoints);
    } else {
      onClick(format);
    }
  };

  return <Dialog open={true} onClose={() => onCancel()} fullWidth PaperProps={{sx: {height: 'auto', pb: 8}}}>
    <DialogTitle sx={dialogSx}>
      <ShareIcon sx={{mr: 2}}/>
      {t(`share.${FEATURE_SHARED[featureShared].toLowerCase()}`)}
    </DialogTitle>
    {
      featureShared === FEATURE_SHARED.TRACK &&
      <CardContent sx={{my: 0, py: 0, bgcolor: theme => lighten(theme.palette.secondary.main, 0.75)}}>
        <FormGroup sx={{mb: 0, pb: 0, ml: 2}}>
          <FormControlLabel sx={{mb: 0, pb: 0, '& .MuiFormControlLabel-label': {fontSize: '0.875rem'}}}
            control={
              <Checkbox
                checked={shareVisiblePoints}
                onChange={toggleVisiblePoints}
                inputProps={{'aria-label': 'controlled'}}
              />
            }
            label={t('share.includeVisiblePoints')}
          />
        </FormGroup>
      </CardContent>
    }
    <Divider/>
    {
      formatsForEachFeature[featureShared].map((format, i) =>
        <Card key={i} elevation={0} onClick={() => handleClick(format)} sx={optionSx}>
          <CardHeader
            avatar={FORMAT_DETAILS[format].icon}
            title={FORMAT_DETAILS[format].label}
            subheader={FORMAT_DETAILS[format].message}
            sx={cardHeaderSx}
          />
        </Card>
      )
    }
    <DialogActions sx={{position: 'absolute', bottom: 0, right: 0}}>
      <CancelButton onCancel={onCancel}/>
    </DialogActions>
  </Dialog>;
};

export default ShareDialog;
