import React, {FC, useState} from 'react';

import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';

import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';

import {HEXColor, UUID} from '../../types/commonTypes';
import {useScopes} from '../../hooks/usePersitedCollection';
import MainPanel from '../../components/scope/MainPanel';
import ScopeHeader from '../../components/scope/Header';

const Scopes: FC = () => {
  const {t} = useTranslation();
  const {hexColors: palette} = useColorRamp('BrewerDark27');
  const {list, retrieve, create, update, delete: remove} = useScopes();

  const [selectedScopeId, setSelectedScopeId] = useState<UUID>();
  const selectedScope = selectedScopeId ? retrieve(selectedScopeId) : undefined;

  const handleAdd = () => {
    create({
      id: uuid(),
      name: `${t('scope')} ${list.length + 1}`,
      color: palette[list.length % palette.length]
    });
  };

  const handleColorChange = (color: HEXColor, id: UUID) => {
    const existing = retrieve(id);
    existing && update({
      ...existing,
      color
    });
  };

  const handleRename = (name: string, id: UUID) => {
    const existing = retrieve(id);
    existing && update({
      ...existing,
      name
    });
  };

  const handleShare = (id: UUID) => {
    console.log('Unimplemented Share, Scope', id); // TODO
  };

  const handleDelete = (id: UUID) => {
    const existing = retrieve(id);
    existing && remove(id);
  };

  const handleInstamaps = (id: UUID) => {
    console.log('Unimplemented Instamaps, Scope', id); // TODO
  };

  const handleDataSchema = (id: UUID) => {
    console.log('Unimplemented Data Schema, Scope', id); // TODO
  };

  const handleScopeBackButton = () => {
    setSelectedScopeId(undefined);
  };

  return <>{
    selectedScope ?
      <ScopeHeader
        color={selectedScope.color}
        name={selectedScope.name}
        onBackButtonClick={handleScopeBackButton}/>
      :
      <MainPanel
        items={list}
        onAdd={handleAdd}
        onSelect={setSelectedScopeId}
        onColorChange={handleColorChange}
        onRename={handleRename}
        onShare={handleShare}
        onDelete={handleDelete}
        onInstamaps={handleInstamaps}
        onDataSchema={handleDataSchema}
      />
  }
  </>;
};

export default Scopes;
