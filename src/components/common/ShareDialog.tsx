import React, {FC, useState} from 'react';

//MUI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';
import CancelButton from '../buttons/CancelButton';

//MUI-ICONS
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ShareIcon from '@mui/icons-material/Share';

//UTILS
import {useTranslation} from 'react-i18next';
import {Card, CardContent, CardHeader, Checkbox, FormControlLabel, FormGroup} from '@mui/material';

//STYLES
const optionSx = {
  '&:hover': {
    bgcolor: 'grey.100'
  },
  borderBottom: '1px solid lightgrey',
  cursor: 'pointer',
};

const cardHeaderSx = {
  '& .MuiCardHeader-subheader': {
    fontSize: '0.75em'
  }
};

const dialogSx = {
  display: 'flex', 
  alignItems: 'center', 
  letterSpacing: 1.35
};

const dialogWithCheckboxSx = {
  display: 'flex',
  alignItems: 'center',
  letterSpacing: 1.35,
  mb: 0,
  pb:0
};

export enum SHARE_FORMAT {
    ZIP,
    KMZ,
    GPX,
    GEOJSON
}

export enum FEATURE_SHARED {
    SCOPE,
    TRACK,
    POINT,
}

export type ShareDialogProps = {
    featureShared: FEATURE_SHARED,
    isAccesibleSize: boolean;
    onClick: (format: SHARE_FORMAT, shareVisiblePoints: boolean) => void;
    onCancel: () => void;
}

const FORMAT_DETAILS = {
  [SHARE_FORMAT.ZIP]: {
    id: 'zip',
    icon: <InsertDriveFileIcon/>,
    label: 'Archivo comprimido zip',
    message: 'Archivo comprimido que contiene un GeoJSON y una carpeta con fotos'
  },
  [SHARE_FORMAT.KMZ]: {
    id: 'kmz',
    icon: <InsertDriveFileIcon/>,
    label: 'Archivo kmz',
    message: 'Archivo comprimido que contiene la geometría y las fotos'
  },
  [SHARE_FORMAT.GPX]: {
    id: 'ppx',
    icon: <InsertDriveFileIcon/>,
    label: 'Archivo gpx',
    message: 'Archivo comprimido que contiene la geometría y las fotos'
  },
  [SHARE_FORMAT.GEOJSON]: {
    id: 'geoJSON',
    icon: <InsertDriveFileIcon/>,
    label: 'Archivo geoJSON',
    message: 'Archivo comprimido que contiene la geometría.'
  }
};

const formatsForEachFeature = {
  [FEATURE_SHARED.SCOPE]: [SHARE_FORMAT.ZIP, SHARE_FORMAT.KMZ],
  [FEATURE_SHARED.TRACK]: [SHARE_FORMAT.GPX, SHARE_FORMAT.ZIP, SHARE_FORMAT.GEOJSON],
  [FEATURE_SHARED.POINT]: [SHARE_FORMAT.ZIP, SHARE_FORMAT.KMZ]
};

const featureSharedName = {
  0: 'scope',
  1: 'track',
  2: 'point'
};

const ShareDialog: FC<ShareDialogProps> = ({
  featureShared,
  isAccesibleSize,
  onClick,
  onCancel
}) => {

  const {t} = useTranslation();
  const [shareVisiblePoints, setShareVisiblePoints] = useState(false);

  const handleChange = () => setShareVisiblePoints(!shareVisiblePoints);
  
  return <Dialog open={true} onClose={() => onCancel()} fullWidth PaperProps={{sx: {height: 'auto', pb: 8}}}>
    <DialogTitle sx={featureShared === FEATURE_SHARED.POINT ? dialogWithCheckboxSx : dialogSx}>
      <ShareIcon sx={{mr: 2}}/>
      {t(`share.${featureSharedName[featureShared]}`)}
    </DialogTitle>
    {
      featureShared === FEATURE_SHARED.POINT &&
                  <CardContent sx={{my:0, py: 0}}>
                    <FormGroup sx={{mb:0, pb: 0, ml: 6}}>
                      <FormControlLabel sx={{mb:0, pb: 0, '& .MuiFormControlLabel-label': {fontSize: '0.875rem'}}}
                        control={
                          <Checkbox
                            checked={shareVisiblePoints}
                            onChange={handleChange}
                            inputProps={{'aria-label': 'controlled'}}
                          />
                        }
                        label={'¿Quieres incluir los puntos visibles?'}
                      />
                    </FormGroup>
                  </CardContent>
    }
    <Divider/>
    {
      formatsForEachFeature[featureShared].map((format, i) =>
        <Card key={i} elevation={0} onClick={() => onClick(format, shareVisiblePoints)} sx={optionSx}>
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
      <CancelButton isAccessibleSize={isAccesibleSize} onCancel={onCancel}/>
    </DialogActions>
  </Dialog>;
};

export default ShareDialog;