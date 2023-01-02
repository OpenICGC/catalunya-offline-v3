import {Camera, CameraResultType, ImageOptions} from '@capacitor/camera';
import {Image, PhotoViewer} from '@capacitor-community/photoviewer';

export const takePhoto = () => {

  const imageOptions: ImageOptions = {
    allowEditing: false,
    resultType: CameraResultType.Uri
  };

  return Camera.getPhoto(imageOptions)
    .then(photo => photo.path);
};

export const deletePhoto = (path: string) => {
  console.log('Unimplemented', path);
};

export const openPhoto = (url: string, title: string) => {
  const image: Image = {
    url,
    title
  };

  PhotoViewer.show({
    images: [image]
  });
};
