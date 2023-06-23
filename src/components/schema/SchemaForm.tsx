import React, {FC} from 'react';

//MUI
import MuiList from '@mui/material/List';

//CATOFFLINE
import SchemaField from './SchemaField';

//UTILS
import {Schema, UUID} from '../../types/commonTypes';

export type SchemaFormProps = {
  schema: Schema,
  onDelete: (fieldId: UUID) => void,
  onNameChange: (fieldId: UUID, name: string) => void
  onPointToApplyChange: (fieldId: UUID) => void,
  onTrackToApplyChange: (fieldId: UUID) => void
};

const SchemaForm: FC<SchemaFormProps> = ({
  schema,
  onDelete,
  onNameChange,
  onPointToApplyChange,
  onTrackToApplyChange
}) => {

  return <><MuiList dense sx={{mx:1}}>
    {
      schema.map(schemaField => <SchemaField
        key={schemaField.id}
        schemaField={schemaField}
        onDelete={onDelete}
        onNameChange={onNameChange}
        onPointToApplyChange={onPointToApplyChange}
        onTrackToApplyChange={onTrackToApplyChange}
      />)          
    }
  </MuiList>
  </>;
};

export default SchemaForm;