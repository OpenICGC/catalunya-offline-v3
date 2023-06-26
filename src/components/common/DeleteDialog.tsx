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

const paperProps = {sx: {height: 'auto', pb: 8}};

const actionsSx = {position: 'absolute', bottom: 0, right: 0};

const deleteIconSx = {mr: 2};

const dialogContentSx = {mt: 2};


export enum FEATURE_DELETED {
  SCOPE,
  TRACK,
  POINT,
  LAYER
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

  const type= FEATURE_DELETED[featureDeleted].toLowerCase();

  const handleClose = () => onCancel();

  return <Dialog open={true} onClose={handleClose} fullWidth PaperProps={paperProps}>
    <DialogTitle sx={dialogSx}>
      <DeleteIcon sx={deleteIconSx}/>
      {t(`delete.${type}`)}
    </DialogTitle>
    <DialogContent sx={dialogContentSx}>
      <Typography>
        {t(`delete.message.${type}`)}
      </Typography>
    </DialogContent>
    <DialogActions sx={actionsSx}>
      <AcceptButton onAccept={onAccept}/>
      <CancelButton onCancel={onCancel}/>
    </DialogActions>
  </Dialog>;
};

export default DeleteDialog;
