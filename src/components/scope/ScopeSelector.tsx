import React, {FC} from 'react';

//MUI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

//MUI-ICONS
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

//CATOFFLINE
import List from './List';

//UTILS
import {useTranslation} from 'react-i18next';
import {Scope} from '../../types/commonTypes';

export interface ScopeSelectorProps {
    isAccesibleSize: boolean;
    isOpen: boolean;
    scopes: Array<Scope>;
    onClick: () => void;
    onAccept: () => void;
    onClose: () => void;
}

const ScopeSelector: FC<ScopeSelectorProps> = ({
  isAccesibleSize,
  isOpen,
  scopes,
  onClick,
  onAccept,
  onClose,
}) => {
    
  const {t} = useTranslation();
    
  return <Dialog open={isOpen} onClose={onClose} fullWidth PaperProps={{sx: {height: '500px'}}}>
    <DialogTitle sx={{display: 'flex', alignItems: 'center', letterSpacing: 1.35}}>
      <ReportProblemIcon sx={{mr: 1}}/>
      El punto no pertenece a ningún ámbito, elige uno.
    </DialogTitle>
    <Divider/>
    <List
      isAccessibleSize={isAccesibleSize}
      items={scopes}
      onClick={onClick}
      searchSx={{pt: 2.5, px: 2.5}}
      listSx={{pb: 2.5, px: 2.5, m: 0}}
    />
    <DialogActions sx={{position: 'absolute', bottom: 0, right: 0}}>
      <Button startIcon={<CancelIcon/>} onClick={onClose} sx={{color: 'text.secondary'}}>{t('actions.cancel')}</Button>
      <Button startIcon={<CheckCircleIcon/>} onClick={onAccept}>{t('actions.accept')}</Button>
    </DialogActions>
  </Dialog>;
};

export default ScopeSelector;