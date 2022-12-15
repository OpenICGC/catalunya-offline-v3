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
import CancelButton from '../buttons/CancelButton';
import AcceptButton from '../buttons/AcceptButton';

export interface ScopeSelectorProps {
    isAccesibleSize: boolean;
    isOpen?: boolean;
    scopes: Array<Scope>;
    onClick: () => void;
    onAccept: () => void;
    onClose: () => void;
}

const ScopeSelector: FC<ScopeSelectorProps> = ({
  isAccesibleSize,
  isOpen = true,
  scopes,
  onClick,
  onAccept,
  onClose,
}) => {
    
  const {t} = useTranslation();
    
  return <Dialog open={isOpen} onClose={onClose} fullWidth PaperProps={{sx: {height: '500px'}}}>
    <DialogTitle sx={{display: 'flex', alignItems: 'center', letterSpacing: 1.35}}>
      <ReportProblemIcon sx={{mr: 1}}/>
      {t('noScopeAlert')}
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
      <CancelButton isAccessibleSize={false} onCancel={onClose}/>
      <AcceptButton isAccessibleSize={false} onAccept={onAccept}/>
    </DialogActions>
  </Dialog>;
};

export default ScopeSelector;