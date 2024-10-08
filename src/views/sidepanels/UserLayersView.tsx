import React, {FC, useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import turfBBOX from '@turf/bbox';

//MUI
import useTheme from '@mui/material/styles/useTheme';
import LayersIcon from '@mui/icons-material/Layers';

//CATOFFLINE
import Header from '../../components/common/Header';
import UserLayerPanel from '../../components/common/UserLayerPanel';

import {CatOfflineError, HEXColor, UserLayer, UUID} from '../../types/commonTypes';
import {useUserLayers} from '../../hooks/usePersistedCollections';
import GeoJSON from 'geojson';
import {v4 as uuid} from 'uuid';
import UserLayerImporter from '../../components/importers/UserLayerImporter';
import Notification from '../../components/notifications/Notification';
import useViewport from '../../hooks/singleton/useViewport';
import {MAX_USER_LAYER_STORAGE} from '../../config';


type SampleLayersProperties = {
  n: string,
  m: string,
  t: number,
  l: string
};

const emptySampleUserLayer = (name: string, color: HEXColor): UserLayer => ({
  id: uuid(),
  name: name,
  color: color,
  isVisible: false,
  data: {
    type: 'FeatureCollection',
    features: [] as Array<GeoJSON.Feature<GeoJSON.Geometry, SampleLayersProperties>>
  }
});

const UserLayersView: FC = () => {
  const {t} = useTranslation();
  const theme = useTheme();

  const {fitBounds} = useViewport();

  const userLayersStore = useUserLayers();
  const userLayers = userLayersStore.list();

  const userLayersSize: number = useMemo(() => JSON.stringify(userLayers)?.length, [userLayers]);

  const [isImportingLayer, setImportingLayer] = useState<boolean>(false);
  const [importErrors, setImportErrors] = useState<CatOfflineError | undefined>(undefined);

  useEffect(() => {
    if (userLayers?.length === 0) {
      fetch('sampleUserLayers.json')
        .then(response => response.json())
        .then((json: GeoJSON.FeatureCollection<GeoJSON.Geometry, SampleLayersProperties>) => json.features.reduce(
          (layers, feature) => {
            const i = feature.properties.t;
            layers[i].data.features.push(feature);
            return layers;
          }, [
            emptySampleUserLayer(t('userLayers.sample.mountainHut'), '#D4121E'),
            emptySampleUserLayer(t('userLayers.sample.camping'), '#F1BE25'),
            emptySampleUserLayer(t('userLayers.sample.ruralAccommodation'), '#4A8A63'),
            emptySampleUserLayer(t('userLayers.sample.youthHostel'), '#1FA1E2')
          ]))
        .then(sampleUserLayers => userLayersStore.create(sampleUserLayers));
    }
  }, [userLayers, userLayersStore]);

  const onAdd = useCallback(() => {
    setImportingLayer(true);
  }, []);

  const handleImportSuccess = () => {
    setImportingLayer(false);
  };

  const handleImportError = (error: CatOfflineError) => {
    setImportingLayer(false);
    setImportErrors(error);
  };

  const handleFitBounds = useCallback((layerId: UUID) => {
    const existing = userLayersStore.retrieve(layerId);
    if (existing) {
      const [xMin, yMin, xMax, yMax] = turfBBOX(existing.data);
      fitBounds([xMin, yMin, xMax, yMax]);
      if (!existing.isVisible) {
        toggleLayerVisibility(layerId);
      }
    }
  }, [userLayersStore]);

  const handleColorChange = useCallback((layerId: UUID, newColor: HEXColor) => {
    const existing = userLayersStore.retrieve(layerId);
    if (existing) {
      userLayersStore.update({
        ...existing,
        color: newColor
      });
    }
  }, [userLayersStore]);

  const handleRename =  useCallback((layerId: UUID, newName: string) => {
    const existing = userLayersStore.retrieve(layerId);
    if (existing) {
      userLayersStore.update({
        ...existing,
        name: newName
      });
    }
  }, [userLayersStore]);

  const toggleLayerVisibility =  useCallback((layerId: UUID) => {
    const existing = userLayersStore.retrieve(layerId);
    if (existing) {
      userLayersStore.update({
        ...existing,
        isVisible: !existing.isVisible
      });
    }
  }, [userLayersStore]);

  const handleDelete = useCallback((layerId: UUID) => {
    const existing = userLayersStore.retrieve(layerId);
    if (existing) {
      userLayersStore.delete(layerId);
    }
  }, [userLayersStore]);

  return <>
    <Header
      startIcon={<LayersIcon/>}
      name={t('userLayers.title')}
      color={`#${theme.palette.secondary.main}`}
    />
    {userLayers !== undefined &&
      <UserLayerPanel
        userLayers={userLayers}
        onAdd={onAdd}
        onFitBounds={handleFitBounds}
        onColorChange={handleColorChange}
        onRename={handleRename}
        onToggleVisibility={toggleLayerVisibility}
        onDelete={handleDelete}
      />
    }
    {isImportingLayer &&
      <UserLayerImporter
        availableSpace={MAX_USER_LAYER_STORAGE - userLayersSize}
        onSuccess={handleImportSuccess}
        onError={handleImportError}
      />
    }
    {importErrors &&
      <Notification
        message={t(importErrors.code, importErrors.params)}
        isOpen={true}
        isPersistent={true}
        onClose={() => setImportErrors(undefined)}
      />
    }
  </>;
};

export default UserLayersView;
