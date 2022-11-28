import React, {FC} from 'react';
import ManagerHeader from '../../components/common/ManagerHeader';
import LayersIcon from '@mui/icons-material/Layers';
import useTheme from '@mui/material/styles/useTheme';

export type LayersProps = {
  // TODO
};

const Layers: FC<LayersProps> = () => {
  const theme = useTheme();
  return <>
    <ManagerHeader
      name="layerManager"
      color={theme.palette.secondary.main}
      startIcon={<LayersIcon/>}
    />
    <div>TODO: Layer Manager</div>
  </>;
};

export default Layers;
