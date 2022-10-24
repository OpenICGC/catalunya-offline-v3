import React from 'react';
import Link from '@mui/material/Link';
import Logo_geomatico from '../img/Logo_geomatico.png';
import Stack from '@mui/material/Stack';

const Geomatico = () => {
  return <Stack sx={{display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexGrow: 2, minHeight: 25, my: 1}}>
    <Link href="https://geomatico.es" target="_blank" sx={{display: 'flex', alignItems: 'flex-end'}}>
      <img src={Logo_geomatico} width={80} alt="geomatico.es"/>
    </Link>
  </Stack>;
};

export default Geomatico;