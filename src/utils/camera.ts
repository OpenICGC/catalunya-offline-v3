import {Camera, CameraResultType, ImageOptions} from '@capacitor/camera';
import {Image, PhotoViewer} from '@capacitor-community/photoviewer';
import {deleteFile} from './filesystem';
import {ScopeImage} from '../types/commonTypes';
import {Capacitor} from '@capacitor/core';

export const takePhoto = () => {

  const imageOptions: ImageOptions = {
    allowEditing: false,
    resultType: CameraResultType.Uri
  };

  return Camera.getPhoto(imageOptions)
    .then(photo => photo.path);
};

export const deletePhoto = (image: ScopeImage) => deleteFile(image.path);

export const openPhoto = (images: Array<ScopeImage>, selectedImage: ScopeImage) => {
  const index = images.findIndex(({path}) => path === selectedImage.path);

  const viewerImages: Array<Image> = images.map(image => ({
    url: Capacitor.convertFileSrc(image.path),
    title: image.name
  }));

  PhotoViewer.show({
    images: viewerImages,
    mode: images.length > 1 ? 'slider' : 'one',
    startFrom: index,
    options: {
      share: false
    }
  });
};
