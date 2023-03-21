import React, {FC, useState} from 'react';

import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';

import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';

import {Error, HEXColor, UUID} from '../../types/commonTypes';
import {useScopes} from '../../hooks/useStoredCollections';
import MainPanel from '../../components/scope/MainPanel';
import ScopeFeatures from './ScopeFeatures';
import HandleExport from '../../components/scope/export/HandleExport';
import HandleImport from '../../components/scope/import/HandleImport';
import Notification from '../../components/notifications/Notification';

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
  const {hexColors: palette} = useColorRamp('BrewerDark27');
  
  const [sharingScopeId, setSharingScopeId] = useState<UUID|undefined>(undefined);
  const [importingScopeId, setImportingScopeId] = useState<UUID|undefined>(undefined);
  const [importErrors, setImportErrors] = useState<Error | undefined>(undefined);

  const scopeStore = useScopes();
  const unselectScope = () => onScopeSelected('');

  const scopeAdd = () => {
    scopeStore.create({
      id: uuid(),
      name: `${t('scope')} ${scopeStore.list().length + 1}`,
      color: palette[scopeStore.list().length % palette.length]
    });
  };

  const scopeColorChange = (scopeId: UUID, newColor: HEXColor) => {
    const existing = scopeStore.retrieve(scopeId);
    existing && scopeStore.update({
      ...existing,
      color: newColor
    });
  };

  const scopeRename = (scopeId: UUID, newName: string) => {
    const existing = scopeStore.retrieve(scopeId);
    existing && scopeStore.update({
      ...existing,
      name: newName
    });
  };

  const scopeDelete = (scopeId: UUID) => {
    const existing = scopeStore.retrieve(scopeId);
    existing && scopeStore.delete(scopeId);
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

  /*const dataSchema = (id: UUID) => {
    console.log('Unimplemented Data Schema, Scope', id); // TODO
  };*/

  const closeHandleExport = () => setSharingScopeId(undefined);
  const closeHandleImport = () => setImportingScopeId(undefined);
  const handleImportError = (error: Error) => {
    closeHandleImport();
    setImportErrors(error);
  };

  return !selectedScope ?
    <>
      <MainPanel
        scopes={scopeStore.list()}
        onSelect={onScopeSelected}
        onAdd={scopeAdd}
        onColorChange={scopeColorChange}
        onRename={scopeRename}
        onDelete={scopeDelete}
        onShare={share}
        /*onInstamaps={instamaps}*/
        /*onDataSchema={dataSchema}*/
        onImport={importFile}
      />
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
        <HandleImport
          scopeId={importingScopeId}
          onImportEnds={closeHandleImport}
          onError={handleImportError}
        />
      }
      {
        importErrors &&
        <Notification
          message={importErrors.message}
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
