import React, {FC} from 'react';

//MUI
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import DeleteIcon from '@mui/icons-material/Delete';

//CATOFFLINE
import AcceptButton from '../buttons/AcceptButton';
import CancelButton from '../buttons/CancelButton';

//UTILS
import {useTranslation} from 'react-i18next';

//STYLES
const dialogSx = {
  bgcolor: 'secondary.main',
  display: 'flex',
  alignItems: 'center',
  letterSpacing: 1.35
};

export enum FEATURE_DELETED {
  SCOPE,
  TRACK,
  POINT
}

export type DeleteDialogProps = {
  featureDeleted: FEATURE_DELETED,
  onAccept: () => void,
  onCancel: () => void,
}

const DeleteDialog: FC<DeleteDialogProps> = ({
  featureDeleted,
  onAccept,
  onCancel
}) => {
  const {t} = useTranslation();


  return <Dialog open={true} onClose={() => onCancel()} fullWidth PaperProps={{sx: {height: 'auto', pb: 8}}}>
    <DialogTitle sx={dialogSx}>
      <DeleteIcon sx={{mr: 2}}/>
      {t(`delete.${FEATURE_DELETED[featureDeleted].toLowerCase()}`)}
    </DialogTitle>
    <DialogContent sx={{mt: 2}}>
      <Typography>
        {
          featureDeleted === FEATURE_DELETED.SCOPE
            ? t(`delete.message.${FEATURE_DELETED[featureDeleted].toLowerCase()}`)
            : t('delete.message.pointTrack')
        }
      </Typography>
    </DialogContent>
    <DialogActions sx={{position: 'absolute', bottom: 0, right: 0}}>
      <AcceptButton onAccept={onAccept}/>
      <CancelButton onCancel={onCancel}/>
    </DialogActions>
  </Dialog>;
};

export default DeleteDialog;
