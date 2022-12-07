import {Scope, ScopePath, ScopePoint, UUID} from '../types/commonTypes';
import useLocalStorage from './useLocalStorage';

type CollectionItem = {
  id: UUID
}

interface collectionStorage<ItemType extends CollectionItem> {
  list: () => Array<ItemType>;
  create: (created: ItemType) => void;
  retrieve: (id: UUID) => ItemType | undefined;
  update: (updated: ItemType) => void;
  delete: (id: UUID) => void;
}

export const useLocalCollectionStore = <ItemType extends CollectionItem>(collectionId: string): collectionStorage<ItemType> => {
  const [items, setItems] = useLocalStorage<Array<ItemType>>(collectionId, []);

  return {
    list: () => items,
    create: created => setItems(prevData => [...prevData, created]),
    retrieve: (id: UUID) => items.find(item => item.id === id),
    update: updated => setItems(prevData => prevData.map(item => item.id === updated.id ? updated : item)),
    delete: id => setItems(prevData => prevData.filter(item => item.id !== id))
  };
};

export const useScopes = () => useLocalCollectionStore<Scope>('scopes');
export const useScopePoints = (scopeId?: UUID) => useLocalCollectionStore<ScopePoint>(scopeId ? `scopes/${scopeId}/points` : '');
export const useScopePaths = (scopeId?: UUID) => useLocalCollectionStore<ScopePath>(scopeId ? `scopes/${scopeId}/paths` : '');
