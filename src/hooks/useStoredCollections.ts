import {Scope, ScopeTrack, ScopePoint, UUID} from '../types/commonTypes';
import usePersistenceData, {PersistenceStatus} from './usePersistenceData';
import {removePersistenceImpl} from '../utils/persistenceImpl';

type CollectionItem = {
  id: UUID
}

interface collectionStorage<ItemType extends CollectionItem> {
  list: () => Array<ItemType>;
  create: (created: ItemType) => void;
  retrieve: (id: UUID) => ItemType | undefined;
  update: (updated: ItemType) => void;
  delete: (id: UUID) => void;
  status: PersistenceStatus;
}

export const useLocalCollectionStore = <ItemType extends CollectionItem>(collectionId: string): collectionStorage<ItemType> => {
  const [items, setItems, persistenceStatus] = usePersistenceData<Array<ItemType>>(collectionId, []);

  return {
    list: () => items,
    create: created => setItems(prevData => [...prevData, created]),
    retrieve: (id: UUID) => items.find(item => item.id === id),
    update: updated => setItems(prevData => prevData.map(item => item.id === updated.id ? updated : item)),
    delete: id => setItems(prevData => prevData.filter(item => item.id !== id)),
    status: persistenceStatus
  };
};

export const useLocalCollectionStoreScopes = (collectionId: string): collectionStorage<Scope> => {
  const [items, setItems, persistenceStatus] = usePersistenceData<Array<Scope>>(collectionId, []);

  return {
    list: () => items,
    create: created => setItems(prevData => [...prevData, created]),
    retrieve: (id: UUID) => items.find(item => item.id === id),
    update: updated => setItems(prevData => prevData.map(item => item.id === updated.id ? updated : item)),
    delete: (id) => {
      removePersistenceImpl(`scopes/${id}/points`);
      removePersistenceImpl(`scopes/${id}/tracks`);
      setItems(prevData => prevData.filter(item => item.id !== id));
    },
    status: persistenceStatus
  };
};

export const useScopes = () => useLocalCollectionStoreScopes('scopes');
export const useScopePoints = (scopeId?: UUID) => useLocalCollectionStore<ScopePoint>(scopeId ? `scopes/${scopeId}/points` : '');
export const useScopeTracks = (scopeId?: UUID) => useLocalCollectionStore<ScopeTrack>(scopeId ? `scopes/${scopeId}/tracks` : '');
