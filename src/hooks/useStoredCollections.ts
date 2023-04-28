import {Scope, ScopeTrack, ScopePoint, UUID} from '../types/commonTypes';
import {removePersistenceImpl} from '../utils/persistenceImpl';
import {useMemo} from 'react';
import usePersistedState from './usePersistedState';

type CollectionItem = {
  id: UUID
}

interface collectionStorage<ItemType extends CollectionItem> {
  list: () => Array<ItemType> | undefined;
  create: (created: ItemType | Array<ItemType>) => void;
  retrieve: (id: UUID) => ItemType | undefined;
  update: (updated: ItemType) => void;
  delete: (id: UUID) => void;
}

export const useLocalCollectionStore = <ItemType extends CollectionItem>(collectionId: string): collectionStorage<ItemType> => {
  const [items, setItems] = usePersistedState<Array<ItemType>>(collectionId, []);

  return useMemo(() => ({
    list: () => items,
    create: created => Array.isArray(created) ?
      setItems(prevData => [...prevData, ...created ]) :
      setItems(prevData => [...prevData, created ]),
    retrieve: (id: UUID) => items?.find(item => item.id === id),
    update: updated => setItems(prevData => prevData.map(item => item.id === updated.id ? updated : item)),
    delete: id => setItems(prevData => prevData.filter(item => item.id !== id))
  }), [items, setItems]);
};

export const useLocalCollectionStoreScopes = (scopeId: string): collectionStorage<Scope> => {
  const [items, setItems] = usePersistedState<Array<Scope>>(scopeId, []);

  return useMemo(() => ({
    list: () => items,
    create: created => Array.isArray(created) ?
      setItems(prevData => [...prevData, ...created ]) :
      setItems(prevData => [...prevData, created ]),
    retrieve: (id: UUID) => items?.find(item => item.id === id),
    update: updated => setItems(prevData => prevData.map(item => item.id === updated.id ? updated : item)),
    delete: (id) => {
      removePersistenceImpl(`scopes/${id}/points`); // TODO this is low-level, no notification
      removePersistenceImpl(`scopes/${id}/tracks`); // TODO this is low-level, no notification
      setItems(prevData => prevData.filter(item => item.id !== id));
    }
  }), [items, setItems]);
};

export const useScopes = () => useLocalCollectionStoreScopes('scopes');
export const useScopePoints = (scopeId?: UUID) => useLocalCollectionStore<ScopePoint>(scopeId ? `scopes/${scopeId}/points` : '');
export const useScopeTracks = (scopeId?: UUID) => useLocalCollectionStore<ScopeTrack>(scopeId ? `scopes/${scopeId}/tracks` : '');
