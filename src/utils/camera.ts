import { Camera, CameraResultType, ImageOptions } from '@capacitor/camera';
import { deleteFile } from './filesystem';
import { ImagePath } from '../types/commonTypes';
import { Capacitor } from '@capacitor/core';
import i18n from 'i18next';
import type { Swiper as SwiperType } from 'swiper';
import type { SwiperOptions } from 'swiper/types';

import { Filesystem, Directory } from '@capacitor/filesystem';

export interface ViewerImage {
  url: string;
  title: string;
}

let currentImageSwiper: SwiperType | null = null;

// Crear carpeta para un punto si no existe
const ensurePointDirectory = async (pointId: string): Promise<void> => {
  try {
    const dirPath = `points/${pointId}`;
    await Filesystem.mkdir({
      path: dirPath,
      directory: Directory.Data,
      recursive: true
    });
  } catch (error) {
    // La carpeta ya existe o hay otro error, continuar
    console.log(`Directory for point ${pointId} already exists or error:`, error);
  }
};

// Hacer una foto con la cámara en carpeta específica del punto
export const takePhoto = async (language: string, pointId?: string) => {
  const imageOptions: ImageOptions = {
    allowEditing: false,
    resultType: CameraResultType.Base64,
    promptLabelHeader: i18n.t('camera.header', { lng: language }),
    promptLabelCancel: i18n.t('camera.cancel', { lng: language }),
    promptLabelPhoto: i18n.t('camera.photo', { lng: language }),
    promptLabelPicture: i18n.t('camera.picture', { lng: language }),
  };

  const photo = await Camera.getPhoto(imageOptions);

  if (!pointId) {
    // Fallback al comportamiento original si no hay pointId
    const fileName = `${Date.now()}.jpeg`;
    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: photo.base64String!,
      directory: Directory.Data,
    });
    return Capacitor.convertFileSrc(savedFile.uri);
  }

  // Crear carpeta del punto si no existe
  await ensurePointDirectory(pointId);

  // Crear nombre de archivo único
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substr(2, 9);
  const fileName = `${timestamp}_${randomSuffix}.jpeg`;
  const filePath = `points/${pointId}/${fileName}`;

  const savedFile = await Filesystem.writeFile({
    path: filePath,
    data: photo.base64String!,
    directory: Directory.Data,
  });

  console.log(`Foto guardada en: ${filePath}`);
  return Capacitor.convertFileSrc(savedFile.uri);
};

// Función para eliminar una foto específica
export const deletePhoto = async (image: ImagePath): Promise<void> => {
  try {
    await deleteFile(image);
  } catch (error) {
    console.error('Error deleting photo:', error);
  }
};

// Función para eliminar todas las fotos de un punto
export const deleteAllPhotosFromPoint = async (pointId: string): Promise<void> => {
  try {
    const dirPath = `points/${pointId}`;
    
    // Leer archivos del directorio
    const result = await Filesystem.readdir({
      path: dirPath,
      directory: Directory.Data
    });

    // Eliminar cada archivo
    for (const file of result.files) {
      if (file.type === 'file' && file.name.endsWith('.jpeg')) {
        await Filesystem.deleteFile({
          path: `${dirPath}/${file.name}`,
          directory: Directory.Data
        });
      }
    }

    console.log(`Todas las fotos del punto ${pointId} eliminadas`);
  } catch (error) {
    console.log(`Error eliminando fotos del punto ${pointId}:`, error);
  }
};

// Función para listar todas las fotos de un punto
export const listPhotosFromPoint = async (pointId: string): Promise<Array<string>> => {
  try {
    const dirPath = `points/${pointId}`;
    
    const result = await Filesystem.readdir({
      path: dirPath,
      directory: Directory.Data
    });

    const photoFiles = result.files
      .filter(file => file.type === 'file' && file.name.endsWith('.jpeg'))
      .map(file => {
        const fullPath = `${dirPath}/${file.name}`;
        return Capacitor.convertFileSrc(`${Directory.Data}/${fullPath}`);
      });

    return photoFiles;
  } catch (error) {
    console.log(`Error listando fotos del punto ${pointId}:`, error);
    return [];
  }
};

// Abrir el visor de fotos
export const openPhoto = (images: Array<ImagePath>, selectedImage: ImagePath) => {
  const index = images.findIndex(image => image === selectedImage);

  const viewerImages: Array<ViewerImage> = images.map(image => ({
    url: Capacitor.convertFileSrc(image),
    title: ''
  }));

  showImageViewer(viewerImages, index);
};

// Mostrar visor de imagen con Swiper
const showImageViewer = (images: Array<ViewerImage>, startIndex: number): void => {
  const modal = document.createElement('div');
  modal.id = 'image-viewer-modal';
  modal.className = 'image-viewer-modal';

  const generateSlides = () => {
    return images.map((image) => {
      const imageUrl = image.url || '';
      const imageTitle = image.title || 'Image';
      return `
        <div class='swiper-slide'>
          <div class='swiper-zoom-container'>
            <img src='${imageUrl}' alt='${imageTitle}' />
          </div>
        </div>
      `;
    }).join('');
  };

  const navigationHtml = images.length > 1
    ? `<div class='swiper-button-next'></div><div class='swiper-button-prev'></div>` : '';

  const paginationHtml = images.length > 1
    ? `<div class='swiper-pagination'></div>` : '';

  const counterHtml = images.length > 1
    ? `<div class='image-counter'><span id='current-image-index'>${startIndex + 1}</span> / ${images.length}</div>` : '';

  modal.innerHTML = `
    <div class='image-viewer-backdrop'></div>
    <div class='image-viewer-content'>
      <button class='image-viewer-close' type='button'>
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'>
          <line x1='18' y1='6' x2='6' y2='18'></line>
          <line x1='6' y1='6' x2='18' y2='18'></line>
        </svg>
      </button>
      <div class='swiper image-viewer-swiper'>
        <div class='swiper-wrapper'>
          ${generateSlides()}
        </div>
        ${navigationHtml}
        ${paginationHtml}
      </div>
      ${counterHtml}
    </div>
  `;

  document.body.appendChild(modal);

  const backdrop = modal.querySelector('.image-viewer-backdrop');
  const closeBtn = modal.querySelector('.image-viewer-close');

  const closeModalHandler = () => closeImageViewer();

  if (backdrop) backdrop.addEventListener('click', closeModalHandler);
  if (closeBtn) closeBtn.addEventListener('click', closeModalHandler);

  import('swiper').then(async (swiperModule) => {
    const { Swiper } = swiperModule;
    const { Navigation } = await import('swiper/modules');
    const { Pagination } = await import('swiper/modules');
    const { Zoom } = await import('swiper/modules');

    const swiperConfig: SwiperOptions = {
      modules: [Navigation, Pagination, Zoom],
      initialSlide: startIndex,
      spaceBetween: 0,
      slidesPerView: 1,
      loop: images.length > 1,
      zoom: {
        maxRatio: 3,
        minRatio: 1,
        toggle: true,
        containerClass: 'swiper-zoom-container',
        zoomedSlideClass: 'swiper-slide-zoomed',
      },
      keyboard: {
        enabled: true,
        onlyInViewport: true,
      },
      on: {
        slideChange(this: SwiperType) {
          const counter = document.getElementById('current-image-index');
          if (counter) {
            counter.textContent = (this.realIndex + 1).toString();
          }
        },
      }
    };

    if (images.length > 1) {
      swiperConfig.navigation = {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      };
      swiperConfig.pagination = {
        el: '.swiper-pagination',
        type: 'bullets',
        clickable: true,
      };
    }

    currentImageSwiper = new Swiper('.image-viewer-swiper', swiperConfig);
  }).catch(error => {
    console.error('Error loading Swiper:', error);
  });

  document.body.style.overflow = 'hidden';
};

// Cierra el visor
const closeImageViewer = (): void => {
  const modal = document.getElementById('image-viewer-modal');
  if (modal) {
    if (currentImageSwiper) {
      currentImageSwiper.destroy(true, true);
      currentImageSwiper = null;
    }

    modal.remove();
    document.body.style.overflow = 'auto';
  }
};

// ESC para cerrar el visor
const handleKeyDown = (e: KeyboardEvent): void => {
  if (e.key === 'Escape' && document.getElementById('image-viewer-modal')) {
    closeImageViewer();
  }
};

document.addEventListener('keydown', handleKeyDown);