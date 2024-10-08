import {Scope, ScopeTrack, ScopePoint, UUID, UserLayer} from '../types/commonTypes';
import {useEffect, useMemo} from 'react';
import usePersistedState, {clear} from './usePersistedState';

type CollectionItem = {
  id: UUID
}

interface persistedCollectionInterface<ItemType extends CollectionItem> {
  list: () => Array<ItemType> | undefined;
  create: (created: ItemType | Array<ItemType>) => void;
  retrieve: (id: UUID) => ItemType | undefined;
  update: (updated: ItemType) => void;
  delete: (id: UUID) => void;
}

const usePersistedCollection = <ItemType extends CollectionItem>(collectionId: string): persistedCollectionInterface<ItemType> => {
  const [items, setItems, isLoaded] = usePersistedState<Array<ItemType> | undefined>(collectionId, undefined);

  useEffect(() => {
    if (isLoaded && collectionId && items === undefined) {
      setItems([]);
    }
  }, [isLoaded]);

  return useMemo(() => ({
    list: () => items,
    create: created => {
      if (items === undefined) throw new Error('Data not loaded. Cannot create items. Please check item list is not undefined before calling create.');
      if (Array.isArray(created)) {
        setItems(prevData => prevData ? [...prevData, ...created] : created);
      } else {
        setItems(prevData => prevData ? [...prevData, created] : [created]);
      }
    },
    retrieve: (id: UUID) => items?.find(item => item.id === id),
    update: updated => {
      if (items === undefined) throw new Error('Data not loaded. Cannot update items. Please check item list is not undefined before calling update.');
      setItems(prevData => prevData?.map(item => item.id === updated.id ? updated : item));
    },
    delete: id => {
      if (items === undefined) throw new Error('Data not loaded. Cannot delete items. Please check item list is not undefined before calling delete.');
      setItems(prevData => prevData?.filter(item => item.id !== id));
    }
  }), [items, setItems]);
};

export const useScopes = (): persistedCollectionInterface<Scope> => {
  const [items, setItems, isLoaded] = usePersistedState<Array<Scope> | undefined>('scopes', undefined);

  useEffect(() => {
    if (isLoaded && items === undefined) {
      setItems([]);
    }
  }, [isLoaded]);

  return useMemo(() => ({
    list: () => items,
    create: created => {
      if (items === undefined) throw new Error('Data not loaded. Cannot create items. Please check item list is not undefined before calling create.');
      if (Array.isArray(created)) {
        setItems(prevData => prevData ? [...prevData, ...created] : created);
      } else {
        setItems(prevData => prevData ? [...prevData, created] : [created]);
      }
    },
    retrieve: (id: UUID) => items?.find(item => item.id === id),
    update: updated => {
      if (items === undefined) throw new Error('Data not loaded. Cannot update items. Please check item list is not undefined before calling update.');
      setItems(prevData => prevData?.map(item => item.id === updated.id ? updated : item));
    },
    delete: (id) => {
      if (items === undefined) throw new Error('Data not loaded. Cannot delete items. Please check item list is not undefined before calling delete.');
      clear(`scopes/${id}/points`);
      clear(`scopes/${id}/tracks`);
      setItems(prevData => prevData?.filter(item => item.id !== id));
    }
  }), [items, setItems]);
};

export const useScopePoints = (scopeId?: UUID) => usePersistedCollection<ScopePoint>(scopeId ? `scopes/${scopeId}/points` : '');
export const useScopeTracks = (scopeId?: UUID) => usePersistedCollection<ScopeTrack>(scopeId ? `scopes/${scopeId}/tracks` : '');

export const useUserLayers = () => usePersistedCollection<UserLayer>('userLayers');
