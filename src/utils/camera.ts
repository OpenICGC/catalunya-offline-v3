import {Camera, CameraResultType, ImageOptions} from '@capacitor/camera';
import {Image, PhotoViewer} from '@capacitor-community/photoviewer';
import {deleteFile} from './filesystem';
import {ImagePath} from '../types/commonTypes';
import {Capacitor} from '@capacitor/core';
import i18n from 'i18next';

export const takePhoto = (language: string) => {

  const imageOptions: ImageOptions = {
    allowEditing: false,
    resultType: CameraResultType.Uri,
    promptLabelHeader: i18n.t('camera.header', {lng: language }),
    promptLabelCancel: i18n.t('camera.cancel', {lng: language }),
    promptLabelPhoto: i18n.t('camera.photo', {lng: language }),
    promptLabelPicture: i18n.t('camera.picture', {lng: language })
  };

  return Camera.getPhoto(imageOptions)
    .then(photo => photo.path);
};

export const deletePhoto = (image: ImagePath) => deleteFile(image);

export const openPhoto = (images: Array<ImagePath>, selectedImage: ImagePath) => {
  const index = images.findIndex(image => image === selectedImage);

  const viewerImages: Array<Image> = images.map(image => ({
    url: Capacitor.convertFileSrc(image),
    title: ''
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
