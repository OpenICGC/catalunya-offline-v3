import React, {FC} from 'react';
import {Scope, ScopePath} from '../../types/commonTypes';
import Header from './Header';

export type PathPanelProps = {
  scope: Scope,
  initialPath: ScopePath,
  numPoints: number,
  numPaths: number,
  onBackButtonClick: () => void
};

const PathPanel: FC<PathPanelProps> = ({
  scope,
  initialPath,
  numPoints,
  numPaths,
  onBackButtonClick
}) => {
  return <>
    <Header
      name={scope.name}
      color={scope.color}
      numPoints={numPoints}
      numPaths={numPaths}
      onBackButtonClick={onBackButtonClick}
    />
    <p>PathPanel - TODO</p>
    <pre>{JSON.stringify(initialPath, null, 2)}</pre>
  </>;
};

export default PathPanel;
