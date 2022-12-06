import React, {FC} from 'react';
import {UUID} from '../../types/commonTypes';

import {useScopePaths, useScopePoints, useScopes} from '../../hooks/usePersitedCollection';
import PathPanel from '../../components/scope/PathPanel';

export interface ScopePathProps {
  scopeId: UUID,
  pathId: UUID,
  onClose: () => void
}

const ScopePath: FC<ScopePathProps> = ({scopeId, pathId, onClose}) => {
  const scopeStore = useScopes();
  const pathStore = useScopePaths(scopeId);
  const pointStore = useScopePoints(scopeId);

  const selectedScope = scopeStore.retrieve(scopeId);
  const selectedPath = pathStore.retrieve(pathId);
  const numPoints = pointStore.list.length;
  const numPaths = pathStore.list.length;

  return selectedScope && selectedPath ? <PathPanel
    scope={selectedScope}
    initialPath={selectedPath}
    numPoints={numPoints}
    numPaths={numPaths}
    onBackButtonClick={onClose}
  /> : <div>Error: the selected path does not exist</div>;
};

export default ScopePath;
