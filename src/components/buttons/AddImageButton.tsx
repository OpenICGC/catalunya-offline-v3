import React, {FC} from 'react';

//MUI
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

export type AddImageButtonProps = {
    onAddImage: () => void,
}

const AddImageButton: FC<AddImageButtonProps> = ({
  onAddImage
}) => {

  //STYLES
  const height = 68;
  const buttonSx = {
    color: 'grey.500',
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: '4/3',
    borderRadius: 1,
    height: height,
    borderColor: 'grey.500',
    borderWidth: '2px',
    borderStyle: 'dashed',
    mt: 1,
    mr: 2.25
  };

  const handleClick = () => onAddImage();
  
  return <Button sx={buttonSx} onClick={handleClick}>
    <AddIcon sx={{fontSize: '36px'}}/>
  </Button>;
};

export default AddImageButton;