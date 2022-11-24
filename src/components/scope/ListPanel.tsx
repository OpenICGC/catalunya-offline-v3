import React, {FC} from 'react';

//MUI
import List from '@mui/material/List';

//MUI-ICONS
import FolderIcon from '@mui/icons-material/FolderIcon';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

//CATOFFLINE
import ManagerHeader from '../ManagerHeader';
import EntityListItem from './EntityListItem';

//UTILS
import {Scope} from '../../types/commonTypes';

export type ListPanelProps = {
    scopes: Scope[]
};

const contextualMenu = [
  {
    id: 'rename',
    label: 'Renombrar',
    icon: <EditIcon/>
  },
  {
    id: 'delete',
    label: 'Borrar',
    icon: <DeleteIcon/>
  },
  {
    id: 'instamaps',
    label: 'Instamaps',
    icon: <MoreHorizIcon/>
  },
  {
    id: 'dataSchema',
    label: 'Esquema de datos',
    icon: <DashboardIcon/>
  }
];

const ListPanel: FC<ListPanelProps> = ({scopes}) => {
  //STYLES
  
  return <>
    <ManagerHeader name='Ámbitos' startIcon={<FolderIcon sx={{color: theme => theme.palette.getContrastText('#1b718c')}}/>}/>
    <List>
      {
        scopes.map(scope => <EntityListItem
          key={scope.entity.id}
          entity={scope.entity}
          actionIcon={<FileUploadIcon/>}
          contextualMenu={contextualMenu}
        />)
      }
    </List>
  </>;
};

export default ListPanel;