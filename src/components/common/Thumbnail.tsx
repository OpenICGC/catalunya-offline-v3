import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

//MUI-ICONS
import CloseIcon from '@mui/icons-material/Close';

//UTILS
import {styled} from '@mui/styles';
import {grey} from '@mui/material/colors';
import {ScopeImage, UUID} from '../../types/commonTypes';
import {Capacitor} from '@capacitor/core';

export type ThumbnailProps = {
  image: ScopeImage,
  isDeletable: boolean,
  onDelete: (imageId: UUID) => void,
  onDownloadImage: (url: string, title: string) => void
};

const Thumbnail : FC<ThumbnailProps> = ({
  image,
  isDeletable,
  onDelete, 
  onDownloadImage
}) => {

  const Image = styled('img')({
    aspectRatio: '4/3',
    objectFit: 'cover',
  });

  const deleteIconSx = {
    visibility: isDeletable ? 'collapsed' : 'visible',
    color: grey[50],
    height: 18,
    width: 18,
    position: 'relative',
    left: -8,
    top: -8,
    border: `2px solid ${grey[50]}`,
    backgroundColor: 'error.main',
    zIndex: 500,
    '&:hover': {
      backgroundColor: grey[50],
      color: 'primary.main',
    }
  };
  
  const url = Capacitor.convertFileSrc(image.path);

  return <Box display='flex' alignItems='flex-start' sx={{p: 0, my: 1, width: 110}}>
    <Image
      alt={image.name}
      height={68}
      src={url}
      onClick={() => onDownloadImage(url, image.name)}
    />
    {
      isDeletable &&
          <IconButton size='small' onClick={() => onDelete(image.path)} sx={deleteIconSx}>
            <CloseIcon style={{fontSize: 14}} color='inherit'/>
          </IconButton>
    }
  </Box>;
};

export default Thumbnail;