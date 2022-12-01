import React, {FC, useState} from 'react';

import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';

import useColorRamp from '@geomatico/geocomponents/hooks/useColorRamp';

import {HEXColor, UUID} from '../../types/commonTypes';
import {useScopes} from '../../hooks/usePersitedCollection';
import MainPanel from '../../components/scope/MainPanel';
import ScopeFeatures from './ScopeFeatures';

const ScopeMain: FC = () => {
  const {t} = useTranslation();
  const {hexColors: palette} = useColorRamp('BrewerDark27');

  const scopeStore = useScopes();
  const [selectedScope, selectScope] = useState<UUID>();
  const unselectScope = () => selectScope(undefined);

  const scopeAdd = () => {
    scopeStore.create({
      id: uuid(),
      name: `${t('scope')} ${scopeStore.list.length + 1}`,
      color: palette[scopeStore.list.length % palette.length]
    });
  };

  const scopeColorChange = (newColor: HEXColor, scopeId: UUID) => {
    const existing = scopeStore.retrieve(scopeId);
    existing && scopeStore.update({
      ...existing,
      color: newColor
    });
  };

  const scopeRename = (newName: string, scopeId: UUID) => {
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
    console.log('Unimplemented Share, Scope', scopeId); // TODO
  };

  const instamaps = (scopeId: UUID) => {
    console.log('Unimplemented Instamaps, Scope', scopeId); // TODO
  };

  const dataSchema = (id: UUID) => {
    console.log('Unimplemented Data Schema, Scope', id); // TODO
  };

  return !selectedScope ?
    <MainPanel
      items={scopeStore.list}
      onSelect={selectScope}
      onAdd={scopeAdd}
      onColorChange={scopeColorChange}
      onRename={scopeRename}
      onDelete={scopeDelete}
      onShare={share}
      onInstamaps={instamaps}
      onDataSchema={dataSchema}
    />
    :
    <ScopeFeatures
      scopeId={selectedScope}
      onClose={unselectScope}
    />;
};

export default ScopeMain;
