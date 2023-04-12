import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

//MUI-ICONS
import CloseIcon from '@mui/icons-material/Close';

//UTILS
import styled from '@mui/material/styles/styled';
import grey from '@mui/material/colors/grey';
import {ImagePath} from '../../types/commonTypes';
import {Capacitor} from '@capacitor/core';
import {IS_WEB} from '../../config';

export type ThumbnailProps = {
  image: ImagePath,
  isDeletable: boolean,
  onDelete: (image: ImagePath) => void,
  onDownloadImage: (image: ImagePath) => void
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

  const url = IS_WEB ? image : Capacitor.convertFileSrc(image); // Convert a File path to URL so it can be accessed by JS

  return <Box display='flex' alignItems='flex-start' sx={{p: 0, my: 1, width: 110}}>
    <Image
      alt={''}
      height={68}
      src={url}
      onClick={() => onDownloadImage(image)}
    />
    {
      isDeletable &&
          <IconButton size='small' onClick={() => onDelete(image)} sx={deleteIconSx}>
            <CloseIcon style={{fontSize: 14}} color='inherit'/>
          </IconButton>
    }
  </Box>;
};

export default Thumbnail;