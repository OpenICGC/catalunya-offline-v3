import React, {FC, SyntheticEvent, useMemo, useState} from 'react';

//MUI
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import ArrowBackIcon from '@mui/icons-material/DoubleArrow';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RouteIcon from '@mui/icons-material/Route';
import ShareIcon from '@mui/icons-material/Share';
import SwipeRightAltIcon from '@mui/icons-material/SwipeRightAlt';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import AddTrack from '../icons/AddTrack';

//CATOFFLINE
import AddButton from '../buttons/AddButton';
import DeleteDialog, {FEATURE_DELETED} from '../common/DeleteDialog';
import Header from '../common/Header';
import List, {listItemType} from './List';
import FeaturesSummary from './FeaturesSummary';

//UTILS
import {HEXColor, Scope, ScopeTrack, ScopePoint, UUID, SCOPE_FEATURES_PANEL_TAB} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';

import useIsLargeSize from '../../hooks/settings/useIsLargeSize';
import {Theme} from '@mui/material/styles/createTheme';

const actionIcons = [{id: 'visibility', activeIcon: <VisibilityIcon/>, inactiveIcon: <VisibilityOffIcon/>}];

export type FeaturesPanelProps = {
  scope: Scope,
  scopePoints: Array<ScopePoint>,
  scopeTracks: Array<ScopeTrack>,
  onBackButtonClick: () => void,
  onAddPoint: () => void,
  onSelectPoint: (pointId: UUID) => void,
  onColorChangePoint: (pointId: UUID, color: HEXColor) => void,
  onGoToPoint: (pointId: UUID) => void,
  onDeletePoint: (pointId: UUID) => void,
  onExportPoint: (pointId: UUID) => void,
  onNameChangePoint: (pointId: UUID, name: string) => void
  onToggleVisibilityPoint: (pointId: UUID) => void,
  onAddTrack: () => void,
  onSelectTrack: (trackId: UUID) => void,
  onColorChangeTrack: (trackId: UUID, color: HEXColor) => void,
  onGoToTrack: (trackId: UUID) => void,
  onDeleteTrack: (trackId: UUID) => void,
  onExportTrack: (trackId: UUID) => void,
  onNameChangeTrack: (trackId: UUID, name: string) => void
  onToggleVisibilityTrack: (trackId: UUID) => void,
  tabValue: SCOPE_FEATURES_PANEL_TAB,
  setTabValue: (newValue: SCOPE_FEATURES_PANEL_TAB) => void
};

const FeaturesPanel: FC<FeaturesPanelProps> = ({
  scope,
  scopePoints,
  scopeTracks,
  onBackButtonClick,
  onAddPoint,
  onSelectPoint,
  onColorChangePoint,
  onGoToPoint,
  onDeletePoint,
  onExportPoint,
  onNameChangePoint,
  onToggleVisibilityPoint,
  onAddTrack,
  onSelectTrack,
  onColorChangeTrack,
  onGoToTrack,
  onDeleteTrack,
  onExportTrack,
  onNameChangeTrack,
  onToggleVisibilityTrack,
  tabValue,
  setTabValue
}) => {
  const {t} = useTranslation();
  const [isLargeSize] = useIsLargeSize();
  const [deleteRequestId, setDeleteRequestId] = useState <UUID> ();
  
  const handleTabChange = (e: SyntheticEvent<Element, Event>, value: number) => setTabValue(value);

  const handleActionPointClick = (pointId: UUID) => {
    onToggleVisibilityPoint(pointId);
  };

  const handleContextualMenuPointClick = (itemId: UUID, menuId: string) => {
    const menuEntry = contextualMenu.point.find(({id}) => id === menuId);
    if (menuEntry?.callbackProp) {
      menuEntry.callbackProp(itemId);
    }
  };

  const handleActionTrackClick = (trackId: UUID) => {
    onToggleVisibilityTrack(trackId);
  };

  const handleContextualMenuTrackClick = (itemId: UUID, menuId: string) => {
    const menuEntry = contextualMenu.track.find(({id}) => id === menuId);
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
        id: 'edit',
        label: t('actions.edit'),
        icon: <EditIcon/>
      },        
      {
        id: 'delete',
        label: t('actions.delete'),
        icon: <DeleteIcon/>,
        callbackProp: setDeleteRequestId
      }
      ,
      {
        id: 'share',
        label: t('actions.share'),
        icon: <ShareIcon/>,
        callbackProp: onExportPoint
      }
    ],
    track: [
      {
        id: 'goTo',
        label: t('actions.goTo'),
        icon: <SwipeRightAltIcon/>,
        callbackProp: onGoToTrack
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
        callbackProp: setDeleteRequestId
      },
      {
        id: 'export',
        label: t('actions.share'),
        icon: <ShareIcon/>,
        callbackProp: onExportTrack
      }
    ]
  };
  
  const tabsSx = {
    color: (theme: Theme) => theme.palette.getContrastText(scope.color),
    bgcolor: scope.color,
    '& .Mui-selected': {
      bgcolor: 'common.white',
      color: 'grey.800',
      fontWeight: 900,
      boxShadow: 3
    },
    '& .MuiTabs-indicator': {
      bgcolor: 'common.white'
    }
  };

  const pointItems: Array<listItemType> = useMemo(() => scopePoints.map(scopePoint => ({
    id: scopePoint.id,
    name: scopePoint.properties.name,
    color: scopePoint.properties.color || scope.color, // Inherits color from scope
    isVisible: scopePoint.properties.isVisible
  })), [scopePoints, scope.color]);

  const trackItems: Array<listItemType> = useMemo(() => scopeTracks.map(scopeTrack => ({
    id: scopeTrack.id,
    name: scopeTrack.properties.name,
    color: scopeTrack.properties.color || scope.color, // Inherits color from scope
    isVisible: scopeTrack.properties.isVisible
  })), [scopeTracks, scope.color]);

  const handleDeletePointAccept = () => {
    deleteRequestId && onDeletePoint(deleteRequestId);
    setDeleteRequestId(undefined);
  };
  
  const handleDeleteTrackAccept = () => {
    deleteRequestId && onDeleteTrack(deleteRequestId);
    setDeleteRequestId(undefined);
  };

  const handleDeleteCancel = () => setDeleteRequestId(undefined);
  
  return <>
    <Header
      startIcon={<ArrowBackIcon sx={{transform: 'rotate(180deg)'}}/>}
      name={scope.name}
      color={scope.color}
      onStartIconClick={onBackButtonClick}
    >
      <FeaturesSummary numPoints={scopePoints.length} numTracks={scopeTracks.length} colorContrastFrom={scope.color}/>
    </Header>
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
          <Typography>{t('features.tracks')}</Typography>
        </Stack>
      } value={1}/>
    </Tabs>
    {
      tabValue === SCOPE_FEATURES_PANEL_TAB.POINTS && <><List
        isLargeSize={isLargeSize}
        items={pointItems}
        contextualMenu={contextualMenu.point}
        actionIcons={actionIcons}
        onActionClick={handleActionPointClick}
        onClick={onSelectPoint}
        onColorChange={onColorChangePoint}
        onContextualMenuClick={handleContextualMenuPointClick}
        onNameChange={onNameChangePoint}
      />
      <Box sx={{width: '100%', height: 0}}>
        <AddButton onClick={onAddPoint}>
          <AddLocationAltIcon/>
        </AddButton>
      </Box>
      {
        deleteRequestId !== undefined && <DeleteDialog featureDeleted={FEATURE_DELETED.POINT} onAccept={handleDeletePointAccept} onCancel={handleDeleteCancel}/>
      }
      </>
    }
    {
      tabValue === SCOPE_FEATURES_PANEL_TAB.TRACKS && <>
        <List
          isLargeSize={isLargeSize}
          items={trackItems}
          contextualMenu={contextualMenu.track}
          actionIcons={actionIcons}
          onActionClick={handleActionTrackClick}
          onClick={onSelectTrack}
          onColorChange={onColorChangeTrack}
          onContextualMenuClick={handleContextualMenuTrackClick}
          onNameChange={onNameChangeTrack}
        />
        <Box sx={{width: '100%', height: 0}}>
          <AddButton onClick={onAddTrack}>
            <AddTrack/>
          </AddButton>
        </Box>
        {
          deleteRequestId !== undefined && <DeleteDialog featureDeleted={FEATURE_DELETED.TRACK} onAccept={handleDeleteTrackAccept} onCancel={handleDeleteCancel}/>
        }
      </>
    }
  </>;
};

export default React.memo(FeaturesPanel);
