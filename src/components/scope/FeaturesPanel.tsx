import React, {FC, SyntheticEvent, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

//MUI-ICONS
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';

//CATOFFLINE
import Header from './Header';
import AddButton from '../buttons/AddButton';

import List from './List';
//UTILS
import {HEXColor, UUID} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import {lighten} from '@mui/system/colorManipulator';
import {listItemType} from './ListItem';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import AddPath from '../icons/AddPath';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

export type FeaturesPanelProps = {
    isAccessibleSize: boolean,
    isLeftHanded: boolean,
    name: string,
    color: HEXColor,
    pointItems: Array<listItemType>,
    pathItems: Array<listItemType>,
    onBackButtonClick: () => void,
    onAddPoint: () => void,
    onAddPath: () => void,
    onClick: (itemId: UUID) => void,
    onColorChange: (color: HEXColor, itemId: UUID) => void,
    onGoTo: (itemId: UUID) => void,
    onDelete: (itemId: UUID) => void,
    onExport: (itemId: UUID) => void,
    onNameChange: (name: string, itemId: UUID) => void
    toggleVisibility: (itemId: UUID) => void
};

const FeaturesPanel: FC<FeaturesPanelProps> = ({
  isAccessibleSize,
  isLeftHanded,
  name,
  color,
  pointItems,
  pathItems,
  onAddPoint,
  onAddPath,
  onBackButtonClick,
  onClick,
  onColorChange,
  onGoTo,
  onDelete,
  onExport,
  onNameChange,
  toggleVisibility
}) => {

  const {t} = useTranslation();
  const [tabValue, setTabValue] = useState(0);
  const handleTabChange = (e: SyntheticEvent<Element, Event>, value: number) => setTabValue(value);

  const handleContextualMenuClick = (menuId: string, itemId: UUID) => {
    const menuEntry = contextualMenu.find(({id}) => id === menuId);
    if (menuEntry?.callbackProp) {
      menuEntry.callbackProp(itemId);
    }
  };
  
  const contextualMenu = [
    {
      id: 'goTo',
      label: t('actions.goTo'),
      icon: <SwipeRightAltIcon/>,
      callbackProp: onGoTo
    },
    {
      id: 'edit',
      label: t('actions.edit'),
      icon: <EditIcon/>
    },
    {
      id: 'delete',
      label: t('actions.delete'),
      icon: <DeleteIcon/>,
      callbackProp: onDelete
    },
    {
      id: 'export',
      label: 'Exportar',
      icon: <FileUploadIcon/>,
      callbackProp: onExport
    }
  ];

  return <>
    <Header
      name={name}
      color={color}
      numPoints={pointItems.length}
      numPaths={pathItems.length}
      onBackButtonClick={onBackButtonClick}
    />
    <Tabs
      value={tabValue}
      onChange={handleTabChange}
      textColor='inherit'
      variant='fullWidth'
      sx={{
        color: 'action.disabled',
        '& .Mui-selected': {
          bgcolor: lighten(color, 0.25),
          color: theme => theme.palette.getContrastText(lighten(color, 0.25)),
        },
        '& .MuiTabs-indicator': {
          bgcolor: theme => theme.palette.getContrastText(lighten(color,0.25))
        }
      }}
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
        contextualMenu={contextualMenu}
        activeActionIcon={<VisibilityIcon/>}
        inactiveActionIcon={<VisibilityOffIcon/>}
        onActionClick={toggleVisibility}
        onClick={onClick}
        onColorChange={onColorChange}
        onContextualMenuClick={handleContextualMenuClick}
        onNameChange={onNameChange}
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
          contextualMenu={contextualMenu}
          activeActionIcon={<VisibilityIcon/>}
          inactiveActionIcon={<VisibilityOffIcon/>}
          onActionClick={toggleVisibility}
          onClick={onClick}
          onColorChange={onColorChange}
          onContextualMenuClick={handleContextualMenuClick}
          onNameChange={onNameChange}
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


