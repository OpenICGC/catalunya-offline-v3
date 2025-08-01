import {ImagePath} from '../types/commonTypes';
import {useMemo, useState} from 'react';
import {deletePhoto, takePhoto} from '../utils/camera';
import i18n from 'i18next';

type ImagesState = {
  initial: Array<ImagePath>,
  created: Array<ImagePath>,
  deleted: Array<ImagePath>,
}

interface ImagesInterface {
  images: Array<ImagePath>;
  create: () => Promise<void>;
  remove: (image: ImagePath) => void;
  discard: () => Promise<void>;
  save: () => Promise<void>;
}

const useImages = (images: Array<ImagePath>, pointId: string): ImagesInterface => {
  
  const [state, setState] = useState<ImagesState>(() => ({
    initial: [...images], // Crear una copia para evitar mutaciones
    created: [], 
    deleted: []
  }));

  const currentImages = useMemo(() => [
    ...state.initial,
    ...state.created
  ].filter(image => !state.deleted.includes(image)), [state]);
  
  const create = async (): Promise<void> => {
    try {
      
      const path = await takePhoto(i18n.language, pointId);
      
      if (path) {
   
        setState(prevState => ({
          ...prevState,
          created: [
            ...prevState.created,
            path
          ]
        }));
      }
    } catch (error) {
      console.error(`[${pointId}] Error taking photo:`, error);
    }
  };
  
  const remove = (image: ImagePath) => {
 
    setState(prevState => ({
      ...prevState,
      deleted: [
        ...prevState.deleted,
        image
      ]
    }));
  };
  
  const _deleteImages = async (images: Array<ImagePath>): Promise<void> => {
    try {
      for (const image of images) {
        await deletePhoto(image);
      }
    } catch (error) {
      console.error(`[${pointId}] Error deleting images:`, error);
    }
  };
  
  const discard = async (): Promise<void> => {
    try {
      
      await _deleteImages(state.created);
      setState(prevState => ({
        ...prevState, 
        created: [], 
        deleted: []
      }));
    } catch (error) {
      console.error(`[${pointId}] Error discarding images:`, error);
    }
  };
  
  const save = async (): Promise<void> => {
    try {
      
      await _deleteImages(state.deleted);
      setState({
        initial: [...currentImages], // Crear una copia
        created: [],
        deleted: []
      });
    } catch (error) {
      console.error(`[${pointId}] Error saving images:`, error);
    }
  };
  
  return {
    images: currentImages,
    create,
    remove,
    discard,
    save
  };
};

export default useImages;