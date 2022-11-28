import {Scope, ScopePath, ScopePoint, UUID} from '../types/commonTypes';
import {useEffect, useState} from 'react';

type CollectionItem = {
  id: UUID
}

interface collectionDataAccessor<ItemType extends CollectionItem> {
  list: Array<ItemType>;
  create: (created: ItemType) => void;
  retrieve: (id: UUID) => ItemType | undefined;
  update: (updated: ItemType) => void;
  delete: (id: UUID) => void;
}

interface datasetPersistor<DatasetType> {
  load: () => DatasetType,
  save: (data: DatasetType) => void
}

const localStoragePersistor = <DatasetType>(key: string): datasetPersistor<DatasetType> => {
  return {
    load: (): DatasetType => {
      const value = localStorage.getItem(key);
      return value === null ? null : JSON.parse(value);
    },
    save: (data: DatasetType) => localStorage.setItem(key, JSON.stringify(data))
  };
};

const usePersitedCollection = <ItemType extends CollectionItem>(collectionId: string): collectionDataAccessor<ItemType> => {
  const persistor = localStoragePersistor<Array<ItemType>>(collectionId);

  const [data, setData] = useState<Array<ItemType>>(persistor.load() || []);

  useEffect(() => {
    persistor.save(data);
  }, [data]);

  return {
    list: data,
    create: created => setData([...data, created]),
    retrieve: id => data.find(item => item.id === id),
    update: updated => setData(data.map(item => item.id === updated.id ? updated : item)),
    delete: id => setData(data.filter(item => item.id !== id))
  };
};

export default usePersitedCollection;

export const useScopes = () => usePersitedCollection<Scope>('scopes');
export const useScopePoints = (scopeId: UUID) => usePersitedCollection<ScopePoint>(`scopePoints_${scopeId}`);
export const useScopePaths = (scopeId: UUID) => usePersitedCollection<ScopePath>(`scopePaths_${scopeId}`);
