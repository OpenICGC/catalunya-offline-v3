import React, {FC, SyntheticEvent, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import AddPath from '../icons/AddPath';

//CATOFFLINE
import AddButton from '../buttons/AddButton';
import Header from './Header';
import List from './List';

//UTILS
import {HEXColor, Scope, ScopePath, ScopePoint, UUID} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import {lighten} from '@mui/system/colorManipulator';
import {Theme} from '@mui/material';
import {listItemType} from './ListItem';

export type FeaturesPanelProps = {
  isAccessibleSize?: boolean,
  isLeftHanded?: boolean,
  scope: Scope,
  scopePoints: Array<ScopePoint>,
  scopePaths: Array<ScopePath>,
  onBackButtonClick: () => void,
  onAddPoint: () => void,
  onSelectPoint: (itemId: UUID) => void,
  onColorChangePoint: (color: HEXColor, itemId: UUID) => void,
  onGoToPoint: (itemId: UUID) => void,
  onDeletePoint: (itemId: UUID) => void,
  onExportPoint: (itemId: UUID) => void,
  onNameChangePoint: (name: string, itemId: UUID) => void
  onToggleVisibilityPoint: (itemId: UUID) => void,
  onAddPath: () => void,
  onSelectPath: (itemId: UUID) => void,
  onColorChangePath: (color: HEXColor, itemId: UUID) => void,
  onGoToPath: (itemId: UUID) => void,
  onDeletePath: (itemId: UUID) => void,
  onExportPath: (itemId: UUID) => void,
  onNameChangePath: (name: string, itemId: UUID) => void
  onToggleVisibilityPath: (itemId: UUID) => void
};

const FeaturesPanel: FC<FeaturesPanelProps> = ({
  isAccessibleSize = false,
  isLeftHanded = false,
  scope,
  scopePoints,
  scopePaths,
  onBackButtonClick,
  onAddPoint,
  onSelectPoint,
  onColorChangePoint,
  onGoToPoint,
  onDeletePoint,
  onExportPoint,
  onNameChangePoint,
  onToggleVisibilityPoint,
  onAddPath,
  onSelectPath,
  onColorChangePath,
  onGoToPath,
  onDeletePath,
  onExportPath,
  onNameChangePath,
  onToggleVisibilityPath
}) => {
  const {t} = useTranslation();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (e: SyntheticEvent<Element, Event>, value: number) => setTabValue(value);

  const handleContextualMenuPointClick = (menuId: string, itemId: UUID) => {
    const menuEntry = contextualMenu.point.find(({id}) => id === menuId);
    if (menuEntry?.callbackProp) {
      menuEntry.callbackProp(itemId);
    }
  };
  
  const handleContextualMenuPathClick = (menuId: string, itemId: UUID) => {
    const menuEntry = contextualMenu.path.find(({id}) => id === menuId);
    if (menuEntry?.callbackProp) {
      menuEntry.callbackProp(itemId);
    }
  };
  
  const contextualMenu = {
    point : [
      {
        id: 'goTo',
        label: t('actions.goTo'),
        icon: <SwipeRightAltIcon/>,
        callbackProp: onGoToPoint
      },
      {
        id: 'rename',
        label: t('actions.rename'),
        icon: <EditIcon/>
      },        
      {
        id: 'delete',
        label: t('actions.delete'),
        icon: <DeleteIcon/>,
        callbackProp: onDeletePoint
      }
      ,
      {
        id: 'export',
        label: t('actions.export'),
        icon: <FileUploadIcon/>,
        callbackProp: onExportPoint
      }
    ],
    path: [
      {
        id: 'goTo',
        label: t('actions.goTo'),
        icon: <SwipeRightAltIcon/>,
        callbackProp: onGoToPath
      },
      {
        id: 'rename',
        label: t('actions.rename'),
        icon: <EditIcon/>
      },
      {
        id: 'delete',
        label: t('actions.delete'),
        icon: <DeleteIcon/>,
        callbackProp: onDeletePath
      },
      {
        id: 'export',
        label: t('actions.export'),
        icon: <FileUploadIcon/>,
        callbackProp: onExportPath
      }
    ]
  };
  
  const tabsSx = {
    color: 'action.disabled',
    '& .Mui-selected': {
      bgcolor: lighten(scope.color, 0.25),
      color: (theme: Theme) => theme.palette.getContrastText(lighten(scope.color, 0.25)),
    },
    '& .MuiTabs-indicator': {
      bgcolor: (theme: Theme) => theme.palette.getContrastText(lighten(scope.color,0.25))
    }
  };

  const pointItems: Array<listItemType> = scopePoints.map(scopePoint => ({
    id: scopePoint.id,
    name: scopePoint.properties.name,
    color: scopePoint.properties.color || scope.color, // Inherits color from scope
    isActive: scopePoint.properties.isVisible
  }));

  const pathItems: Array<listItemType> = scopePaths.map(scopePath => ({
    id: scopePath.id,
    name: scopePath.properties.name,
    color: scopePath.properties.color || scope.color, // Inherits color from scope
    isActive: scopePath.properties.isVisible
  }));

  const actionIcons = [{id: 'visibility', activeIcon: <VisibilityIcon/>, inactiveIcon: <VisibilityOffIcon/>}];

  return <>
    <Header
      name={scope.name}
      color={scope.color}
      numPoints={scopePoints.length}
      numPaths={scopePaths.length}
      onBackButtonClick={onBackButtonClick}
    />
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      textColor='inherit'
      variant='fullWidth'
      sx={tabsSx}
    >
      <Tab
        label={
          <Stack sx={{flexDirection: 'row', gap: 1}}>
            <LocationOnIcon/>
            <Typography>{t('features.points')}</Typography>
          </Stack>
        }
        value={0}
      />
      <Tab label={
        <Stack sx={{flexDirection: 'row', gap: 1}}>
          <RouteIcon/>
          <Typography>{t('features.paths')}</Typography>
        </Stack>
      } value={1}/>
    </Tabs>
    {
      tabValue === 0 && <><List
        isAccessibleSize={isAccessibleSize}
        items={pointItems}
        contextualMenu={contextualMenu.point}
        actionIcons={actionIcons}
        onActionClick={onToggleVisibilityPoint}
        onClick={onSelectPoint}
        onColorChange={onColorChangePoint}
        onContextualMenuClick={handleContextualMenuPointClick}
        onNameChange={onNameChangePoint}
      />
      <Box sx={{width: '100%', height: 0}}>
        <AddButton
          isAccessibleSize={isAccessibleSize}
          isLeftHanded={isLeftHanded}
          onClick={onAddPoint}
        >
          <AddLocationAltIcon/>
        </AddButton>
      </Box></>
    }
    {
      tabValue === 1 && <>
        <List
          isAccessibleSize={isAccessibleSize}
          items={pathItems}
          contextualMenu={contextualMenu.path}
          actionIcons={actionIcons}
          onActionClick={onToggleVisibilityPath}
          onClick={onSelectPath}
          onColorChange={onColorChangePath}
          onContextualMenuClick={handleContextualMenuPathClick}
          onNameChange={onNameChangePath}
        />
        <Box sx={{width: '100%', height: 0}}>
          <AddButton
            isAccessibleSize={isAccessibleSize}
            isLeftHanded={isLeftHanded}
            onClick={onAddPath}
          >
            <AddPath/>
          </AddButton>
        </Box>
      </>
    }
  </>;
};

export default FeaturesPanel;
