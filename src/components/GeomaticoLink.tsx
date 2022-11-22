import React, {FC} from 'react';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import LogoHorizontalColor from '../logos/LogoHorizontalColor';

const stackSx = {display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexGrow: 2, minHeight: 25, mt: 1, mb: 0};
const linkSx = {display: 'flex', alignItems: 'flex-end', mr: 1, mb: 1};

const GeomaticoLink: FC = () => <Stack sx={stackSx}>
  <Link sx={linkSx} href="https://geomatico.es" target="_blank">
    <LogoHorizontalColor width={80}/>
  </Link>
</Stack>;

export default GeomaticoLink;
