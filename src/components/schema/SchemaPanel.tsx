import React, {FC, useMemo} from 'react';

//MUI
import Box from '@mui/material/Box';
import MuiList from '@mui/material/List';
import Typography from '@mui/material/Typography';

//MUI-ICONS
import SchemaIcon from '@mui/icons-material/AccountTree';
import BackIcon from '@mui/icons-material/DoubleArrow';
import AddIcon from '@mui/icons-material/AddBox';

//CATOFFLINE
import AddButton from '../buttons/AddButton';
import Header from '../common/Header';
import ListItem from '../scope/ListItem';
import SchemaForm from './SchemaForm';

//UTILS
import {Scope, UUID} from '../../types/commonTypes';
import {useTranslation} from 'react-i18next';
import styled from '@mui/material/styles/styled';
import useIsLargeSize from '../../hooks/settings/useIsLargeSize';

const titleSx = {
  color: 'grey.700'
};

const muiListSx = {
  ml: 0.75,
  my: 0,
  mr: 0
};

export type SchemaPanelProps = {
  scope: Scope,
  scopes: Array<Scope>;
  onAddField: () => void,
  onBackButtonClick: () => void,
  onImportFieldsFromScope: (scopeId: UUID) => void,
  onDelete: (fieldId: UUID) => void,
  onNameChange: (fieldId: UUID, name: string) => void
  onPointToApplyChange: (fieldId: UUID) => void,
  onTrackToApplyChange: (fieldId: UUID) => void
};


const SchemaPanel: FC<SchemaPanelProps> = ({
  scope,
  scopes,
  onAddField,
  onBackButtonClick,
  onDelete,
  onImportFieldsFromScope,
  onNameChange,
  onPointToApplyChange,
  onTrackToApplyChange
}) => {

  const {t} = useTranslation();
  const [isLargeSize] = useIsLargeSize();

  const scopesWithSchema = scopes.filter(scope => scope.schema);
  
  const ScrollableContent = useMemo(() => styled(Box)({
    overflow: 'auto',
    padding: '0px',
    marginBottom: isLargeSize ? '72px' : '64px'
  }), [isLargeSize]);

  return <><Header
    startIcon={<BackIcon sx={{transform: 'rotate(180deg)'}}/>}
    name={scope.name}
    color={scope.color}
    onStartIconClick={onBackButtonClick}
  />
  <Header
    startIcon={<SchemaIcon/>}
    name={t('schema.title')}
    color={`${scope.color}bf`}//scope color with 75% transparency
    onStartIconClick={onBackButtonClick}
  />

  <ScrollableContent>
    <Box mt={1} mb={1} ml={1} display="flex" flexDirection="column">
      <Typography variant="caption" sx={titleSx} gutterBottom>{t('schema.customFieldsTitle')}</Typography>
      {
        scopesWithSchema.length !== 0 && !scope.schema //There are scopes with schema and this scope hasn't schema
          ? <>
            <Typography variant="caption" sx={titleSx}>Puedes copiar los campos personalizados desde otro ámbito:</Typography>
            <MuiList dense sx={muiListSx}>
              {
                scopesWithSchema.map(scope => <ListItem key={scope.id} itemId={scope.id} name={scope.name} color={scope.color} onClick={onImportFieldsFromScope}/>)
              }
            </MuiList>
            <Typography variant="caption" sx={titleSx}>O añadirlos manualmente:</Typography>
          </>
          : scope.schema && <SchemaForm
            schema={scope.schema}
            onDelete={onDelete}
            onNameChange={onNameChange}
            onPointToApplyChange={onPointToApplyChange}
            onTrackToApplyChange={onTrackToApplyChange}
          />
      }
    </Box>
  </ScrollableContent>
  <Box sx={{width: '100%', height: 0}}>
    <AddButton onClick={onAddField}>
      <AddIcon/>
    </AddButton>
  </Box>
  </>;
};

export default SchemaPanel;