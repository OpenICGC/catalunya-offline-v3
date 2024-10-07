import React, {FC, useCallback, useEffect, useState} from 'react';
import SchemaPanel from '../../components/schema/SchemaPanel';
import {Schema, SchemaFieldType, UUID} from '../../types/commonTypes';
import {useScopes} from '../../hooks/usePersistedCollections';
import {v4 as uuid} from 'uuid';
import {useTranslation} from 'react-i18next';

export interface ScopeSchemaEditorProps {
  scopeId: UUID,
  onClose: () => void
}

const ScopeSchemaEditor: FC<ScopeSchemaEditorProps> = ({scopeId, onClose}) => {
  const {t} = useTranslation();
  const scopeStore = useScopes();
  const scope = scopeStore.retrieve(scopeId);
  const [importingFieldsFromScope, setImportingFieldsFromScope] = useState<UUID>();
  const importingSchema = importingFieldsFromScope ? scopeStore.retrieve(importingFieldsFromScope)?.schema : undefined;
  const schema = scope?.schema;
  const scopes = scopeStore.list();

  const updateSchema = useCallback((newSchema: Schema) => {
    if (scope) {
      scopeStore.update({
        ...scope,
        schema: newSchema
      });
    }
  }, [scopeStore]);

  const handleAddField = () => {
    const field: SchemaFieldType = {
      id: uuid(),
      name: `${t('schema.field')} ${(schema?.length || 0) + 1}`,
      appliesToPoints: true,
      appliesToTracks: true
    };
    updateSchema(schema ? [...schema, field] : [field]);
  };

  const handleDelete = (fieldId: UUID) => {
    if (schema) {
      updateSchema(schema
        .filter(field => field.id !== fieldId)
      );
    }
  };

  const handleImportFieldsFromScope = (scopeId: UUID) => {
    setImportingFieldsFromScope(scopeId);
  };

  useEffect(() => {
    if (importingSchema) {
      updateSchema(importingSchema);
      setImportingFieldsFromScope(undefined);
    }
  }, [importingSchema]);

  const handleNameChange = (fieldId: UUID, name: string) => {
    if (schema) {
      updateSchema(schema
        .map(field => field.id === fieldId ? ({
          ...field,
          name: name
        }) : field)
      );
    }
  };

  const handlePointToApplyChanges = (fieldId: UUID) => {
    if (schema) {
      updateSchema(schema
        .map(field => field.id === fieldId ? ({
          ...field,
          appliesToPoints: !field.appliesToPoints
        }) : field)
      );
    }
  };

  const handleTrackToApplyChange = (fieldId: UUID) => {
    if (schema) {
      updateSchema(schema
        .map(field => field.id === fieldId ? ({
          ...field,
          appliesToTracks: !field.appliesToTracks
        }) : field)
      );
    }
  };

  return scope && scopes ? <SchemaPanel
    scope={scope}
    scopes={scopes}
    onBackButtonClick={onClose}
    onAddField={handleAddField}
    onDelete={handleDelete}
    onImportFieldsFromScope={handleImportFieldsFromScope}
    onNameChange={handleNameChange}
    onPointToApplyChange={handlePointToApplyChanges}
    onTrackToApplyChange={handleTrackToApplyChange}
  /> : null;
};

export default ScopeSchemaEditor;
