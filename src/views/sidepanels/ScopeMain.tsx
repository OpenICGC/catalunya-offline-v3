import React, {FC, useState} from 'react';

import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';

import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';

import {CatOfflineError, HEXColor, UUID} from '../../types/commonTypes';
import {useScopes} from '../../hooks/usePersistedCollections';
import MainPanel from '../../components/scope/MainPanel';
import ScopeFeatures from './ScopeFeatures';
import HandleExport from '../../components/scope/export/HandleExport';
import ScopeImporter from '../../components/importers/ScopeImporter';
import Notification from '../../components/notifications/Notification';
import useColorPalette from '../../hooks/settings/useColorPalette';
import ScopeSchemaEditor from './ScopeSchemaEditor';

export interface ScopeMainProps {
  selectedScope?: UUID,
  onScopeSelected: (scopeId: UUID) => void,
  selectedPoint?: UUID,
  onPointSelected: (pointId?: UUID) => void,
  selectedTrack?: UUID,
  onTrackSelected: (trackId?: UUID) => void
}

const ScopeMain: FC<ScopeMainProps> = ({
  selectedScope,
  onScopeSelected,
  selectedPoint,
  onPointSelected,
  selectedTrack,
  onTrackSelected
}) => {
  const {t} = useTranslation();
  const [colorPalette] = useColorPalette();
  const {hexColors: palette} = useColorRamp(colorPalette);

  const [sharingScopeId, setSharingScopeId] = useState<UUID|undefined>(undefined);
  const [editingSchemaScopeId, setEditingSchemaScopeId] = useState<UUID|undefined>(undefined);
  const [importingScopeId, setImportingScopeId] = useState<UUID|undefined>(undefined);

  const [importErrors, setImportErrors] = useState<CatOfflineError | undefined>(undefined);

  const scopeStore = useScopes();
  const unselectScope = () => onScopeSelected('');

  const scopeAdd = () => {
    scopeStore.create({
      id: uuid(),
      name: `${t('scope')} ${(scopeStore.list()?.length ?? 0) + 1}`,
      color: palette[(scopeStore.list()?.length ?? 0) % palette.length]
    });
  };

  const scopeColorChange = (scopeId: UUID, newColor: HEXColor) => {
    const existing = scopeStore.retrieve(scopeId);
    if (existing) {
      scopeStore.update({
        ...existing,
        color: newColor
      });
    }
  };

  const scopeRename = (scopeId: UUID, newName: string) => {
    const existing = scopeStore.retrieve(scopeId);
    if (existing) {
      scopeStore.update({
        ...existing,
        name: newName
      });
    }
  };

  const scopeDelete = (scopeId: UUID) => {
    const existing = scopeStore.retrieve(scopeId);
    if (existing) {
      scopeStore.delete(scopeId);
    }
  };

  const share = (scopeId: UUID) => {
    setSharingScopeId(scopeId);
  };

  const importFile = (scopeId: UUID) => {
    setImportingScopeId(scopeId);
  };

  /*const instamaps = (scopeId: UUID) => {
    console.log('Unimplemented Instamaps, Scope', scopeId); // TODO
  };*/

  const dataSchema = (scopeId: UUID) => {
    setEditingSchemaScopeId(scopeId);
  };

  const closeSchemaEditor = () => {
    setEditingSchemaScopeId(undefined);
  };

  const closeHandleExport = () => setSharingScopeId(undefined);
  const handleImportSuccess = () => {
    if (importingScopeId) {
      onScopeSelected(importingScopeId);
    }
    setImportingScopeId(undefined);
  };
  const handleImportError = (error: CatOfflineError) => {
    setImportingScopeId(undefined);
    setImportErrors(error);
  };

  return !selectedScope ?
    <>
      {editingSchemaScopeId ?
        <ScopeSchemaEditor
          scopeId={editingSchemaScopeId}
          onClose={closeSchemaEditor}
        /> :
        <MainPanel
          scopes={scopeStore.list() ?? []}
          onSelect={onScopeSelected}
          onAdd={scopeAdd}
          onColorChange={scopeColorChange}
          onRename={scopeRename}
          onDelete={scopeDelete}
          onShare={share}
          /*onInstamaps={instamaps}*/
          onDataSchema={dataSchema}
          onImport={importFile}
        />
      }
      {
        sharingScopeId &&
        <HandleExport
          scopeId={sharingScopeId}
          onSharedStarted={closeHandleExport}
          onSharedCancel={closeHandleExport}
        />
      }
      {
        importingScopeId &&
        <ScopeImporter
          scopeId={importingScopeId}
          onSuccess={handleImportSuccess}
          onError={handleImportError}
        />
      }
      {
        importErrors &&
        <Notification
          message={t(importErrors.code, importErrors.params)}
          isOpen={true}
          isPersistent={true}
          onClose={() => setImportErrors(undefined)} />
      }
    </>
    :
    <ScopeFeatures
      scopeId={selectedScope}
      onClose={unselectScope}
      selectedPoint={selectedPoint}
      onPointSelected={onPointSelected}
      selectedTrack={selectedTrack}
      onTrackSelected={onTrackSelected}
    />;
};

export default ScopeMain;
