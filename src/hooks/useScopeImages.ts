import {ScopeImage} from '../types/commonTypes';
import {useMemo, useState} from 'react';
import {deletePhoto, takePhoto} from '../utils/camera';



type ScopeImagesState = {
  initial: Array<ScopeImage>,
  created: Array<ScopeImage>,
  deleted: Array<ScopeImage>,
}

interface ScopeImagesInterface {
  images: Array<ScopeImage>;
  create: () => void;
  remove: (image: ScopeImage) => void;
  discard: () => void;
  save: () => void;
}

export const useScopeImages = (images: Array<ScopeImage>): ScopeImagesInterface => {
  
  const [state, setState] = useState<ScopeImagesState>({initial: images, created: [], deleted: []});

  const currentImages = useMemo(() => [
    ...state.initial,
    ...state.created
  ].filter(image => !state.deleted.map(({path}) => path).includes(image.path)), [state]);
  
  const create = async () => {
    const path = await takePhoto();
    if (path){
      const name = path.split('/').pop() || '';
      setState({
        ...state,
        created: [
          ...state.created,
          {path, name}
        ]
      });
    }
  };
  
  const remove = (image: ScopeImage) => {
    setState({
      ...state,
      deleted: [
        ...state.deleted,
        image
      ]
    });
  };
  
  const _deleteImages = async (images: Array<ScopeImage>) => {
    for (const image of images) {
      await deletePhoto(image);
    }
  };
  
  const discard = () => _deleteImages(state.created).then(() => setState({
    ...state, 
    created: [], 
    deleted: []}));
  
  const save = () => _deleteImages(state.deleted).then(() => setState({
    initial: currentImages,
    created: [],
    deleted: []
  }));
  
  
  return {
    images: currentImages,
    create,
    remove,
    discard,
    save
  };
};