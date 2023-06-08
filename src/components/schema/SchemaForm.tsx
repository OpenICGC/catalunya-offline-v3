import React, {FC} from 'react';

//MUI
import MuiList from '@mui/material/List';

//CATOFFLINE
import SchemaField from './SchemaField';

//UTILS
import {SchemaFieldType} from '../../types/commonTypes';

export type SchemaFormProps = {
  schemaFields: Array<SchemaFieldType>,
  onDelete: () => void,
  onNameChange: () => void
  onPointToApplyChange: () => void,
  onTrackToApplyChange: () => void
};

const SchemaForm: FC<SchemaFormProps> = ({
  schemaFields,
  onDelete,
  onNameChange,
  onPointToApplyChange,
  onTrackToApplyChange
}) => {

  return <><MuiList dense sx={{mx:1}}>
    {
      schemaFields.map(schemaField => <SchemaField
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