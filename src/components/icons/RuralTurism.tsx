import React, {FC} from 'react';
import SvgIcon  from '@mui/material/SvgIcon';
import {SvgIconProps} from '@mui/material/SvgIcon/SvgIcon';

// Derived from MUI's "Route" icon
const RuralTurism: FC<SvgIconProps> = (props) => {
  return <SvgIcon {...props}>
    <path d="M23.965 9.619H22.22v11.942h1.674v1.125h-6.437v-5.625l-.072-.191c-.048-.096-.159-.238-.335-.43a2.266 2.266 0 0 0-.551-.479c-.271-.158-.63-.297-1.076-.406a4.83 4.83 0 0 0-1.388-.191c-.75 0-1.389.109-1.916.334-.478.225-.813.455-1.004.693-.223.271-.343.463-.359.574l-.048.096v5.625H.154v-1.125H1.71V9.619H.035V7.681l3.686-1.794V1.315h4.882v2.322l3.375-1.579L23.965 7.56v2.059zm-13.808 2.704.072-2.824c-.015-.016-.023-.038-.023-.071l-.216-.431a1.487 1.487 0 0 0-.622-.502 2.588 2.588 0 0 0-1.077-.238c-.287 0-.55.056-.79.166-.24.096-.423.217-.551.36-.27.333-.421.604-.454.813l-.023.143v2.584h3.684z" />
  </SvgIcon>;
};

export default RuralTurism;