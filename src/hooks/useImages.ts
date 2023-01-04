import {ImagePath} from '../types/commonTypes';
import {useMemo, useState} from 'react';
import {deletePhoto, takePhoto} from '../utils/camera';

type ImagesState = {
  initial: Array<ImagePath>,
  created: Array<ImagePath>,
  deleted: Array<ImagePath>,
}

interface ImagesInterface {
  images: Array<ImagePath>;
  create: () => void;
  remove: (image: ImagePath) => void;
  discard: () => void;
  save: () => void;
}

const useImages = (images: Array<ImagePath>): ImagesInterface => {
  
  const [state, setState] = useState<ImagesState>({initial: images, created: [], deleted: []});

  const currentImages = useMemo(() => [
    ...state.initial,
    ...state.created
  ].filter(image => !state.deleted.includes(image)), [state]);
  
  const create = async () => {
    const path = await takePhoto();
    if (path) {
      setState({
        ...state,
        created: [
          ...state.created,
          path
        ]
      });
    }
  };
  
  const remove = (image: ImagePath) => {
    setState({
      ...state,
      deleted: [
        ...state.deleted,
        image
      ]
    });
  };
  
  const _deleteImages = async (images: Array<ImagePath>) => {
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

export default useImages;
