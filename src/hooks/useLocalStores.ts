import {useCallback, useEffect, useState} from 'react';
import { singletonHook } from 'react-singleton-hook';

import {Scope, ScopeTrack, ScopePoint, UUID} from '../types/commonTypes';

type CollectionItem = {
  id: UUID
}

interface collectionStorage<ItemType extends CollectionItem> {
  list: Array<ItemType>;
  create: (created: ItemType) => void;
  retrieve: (id: UUID) => ItemType | undefined;
  update: (updated: ItemType) => void;
  delete: (id: UUID) => void;
}

interface persistence<DatasetType> {
  load: () => DatasetType,
  save: (data: DatasetType) => void
}

const getLocalPersistor = <DatasetType>(key: string): persistence<DatasetType> => {
  return {
    load: (): DatasetType => {
      const value = localStorage.getItem(key);
      return value === null ? null : JSON.parse(value);
    },
    save: (data: DatasetType) => localStorage.setItem(key, JSON.stringify(data))
  };
};

const useLocalCollectionStore = <ItemType extends CollectionItem>(collectionId: string): () => collectionStorage<ItemType> => () => {
  const persistor = getLocalPersistor<Array<ItemType>>(collectionId);

  const [data, setData] = useState<Array<ItemType>>(persistor.load() || []);

  useEffect(() => {
    persistor.save(data);
  }, [data]);

  const create = useCallback(created => setData(prevData => [...prevData, created]), []);
  const retrieve = (id: UUID) => data.find(item => item.id === id);
  const update = useCallback(updated => setData(prevData => prevData.map(item => item.id === updated.id ? updated : item)), []);
  const remove = useCallback(id => setData(prevData => prevData.filter(item => item.id !== id)), []);

  return {
    list: data,
    create,
    retrieve,
    update,
    delete: remove
  };
};

const nullStore = () => ({
  list: [],
  create: () => undefined,
  retrieve: () => undefined,
  update: () => undefined,
  delete: () => undefined
});

const getHookFactory = <ItemType extends CollectionItem>(namespace: string) => {
  const hooks = new Map<UUID, () => collectionStorage<ItemType>>();
  return (scopeId: UUID) => {
    if (!hooks.get(scopeId)) {
      const hook = singletonHook(nullStore, useLocalCollectionStore<ItemType>(`${scopeId}:${namespace}`));
      hooks.set(scopeId, hook);
    }
    return hooks.get(scopeId) || nullStore;
  };
};

export const useScopes = singletonHook(nullStore, useLocalCollectionStore<Scope>('scopes'));
export const useScopePoints = getHookFactory<ScopePoint>('scopePoints');
export const useScopeTracks = getHookFactory<ScopeTrack>('scopeTracks');
