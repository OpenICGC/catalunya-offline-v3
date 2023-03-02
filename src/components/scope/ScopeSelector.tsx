import React, {FC} from 'react';

//MUI
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import DialogActions from '@mui/material/DialogActions';

//MUI-ICONS
import ReportProblemIcon from '@mui/icons-material/ReportProblem';

//CATOFFLINE
import CancelButton from '../buttons/CancelButton';
import List from './List';

//UTILS
import {useTranslation} from 'react-i18next';
import {Scope, UUID} from '../../types/commonTypes';
import {useSettings} from '../../hooks/useSettings';

export interface ScopeSelectorProps {
    isAccessibleSize: boolean;
    isOpen?: boolean;
    scopes: Array<Scope>;
    onScopeSelected: (scope: UUID) => void;
    onCancel: () => void;
}

const ScopeSelector: FC<ScopeSelectorProps> = ({
  scopes,
  onScopeSelected,
  onCancel
}) => {
  const {t} = useTranslation();
  const {isAccessibleSize} = useSettings();

  return <Dialog open={true} onClose={() => onCancel()} fullWidth PaperProps={{sx: {height: '500px'}}}>
    <DialogTitle sx={{display: 'flex', alignItems: 'center', letterSpacing: 1.35}}>
      <ReportProblemIcon sx={{mr: 1}}/>
      {t('noScopeAlert')}
    </DialogTitle>
    <Divider/>
    <List
      isAccessibleSize={isAccessibleSize}
      items={scopes}
      onClick={onScopeSelected}
      searchSx={{pt: 2.5, px: 2.5}}
      listSx={{pb: 2.5, px: 2.5, m: 0}}
    />
    <DialogActions sx={{position: 'absolute', bottom: 0, right: 0}}>
      <CancelButton onCancel={onCancel}/>
    </DialogActions>
  </Dialog>;
};

export default ScopeSelector;
