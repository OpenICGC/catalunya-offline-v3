import React, {FC} from 'react';

//MUI
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';

//MUI-ICONS
import CloseIcon from '@mui/icons-material/Close';

//UTILS
import {styled} from '@mui/styles';
import {grey} from '@mui/material/colors';
import {ScopeImage, UUID} from '../../types/commonTypes';

export type ThumbnailProps = {
    image: ScopeImage,
    isDeletable: boolean,
  onDelete: (imageId: UUID) => void,
  onDownloadImage: (imageId: UUID, content_type: string) => void
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
    /*marginRight: !isDeletable || !image.isLoading ? '10px' : '0px'*/
  });

  const defaultImage = 'assets/defaultImage.jpg';
  const spinnerSx = {
    bgcolor: 'primary.main',
    borderRadius: '100%',
    color: grey[50],
    padding: '2px',
    border: `2px solid ${grey[50]}`,
    boxSizing: 'content-box',
    zIndex: 500,
    position: 'relative',
    left: -8,
    top: -8,
  };
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

  return <Box display='flex' alignItems='flex-start' sx={{p: 0, my: 1, width: 112}}>
    <Image
      alt={image.name}
      height={70}
      src={image.isLoading ? defaultImage : image.url}
      onClick={() => onDownloadImage(image.id, image.contentType)}
    />
    {
      image.isLoading ?
        <CircularProgress size={10} sx={spinnerSx}/> :
        isDeletable ?
          <IconButton size='small' onClick={() => onDelete(image.id)} sx={deleteIconSx}>
            <CloseIcon style={{fontSize: 14}} color='inherit'/>
          </IconButton> : undefined
    }
  </Box>;
};

export default Thumbnail;