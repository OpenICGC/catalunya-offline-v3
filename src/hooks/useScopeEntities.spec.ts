import {renderHook, act} from '@testing-library/react-hooks/dom';
import {expect} from 'chai';
import {useScopes, useScopePoints, useScopePaths} from './useScopeEntities';
import {Scope, ScopePath, ScopePoint} from '../types/commonTypes';
import {v4 as uuidv4} from 'uuid';

describe('useScopeEntities', () => {
  const scopeId = uuidv4();

  it('useScopes should list, create, retrieve, update and delete Scopes', () => {

    // GIVEN
    const sampleScope: Scope = {
      id: scopeId,
      name: 'Scope 1',
      color: '#FABADA'
    };
    const modifiedScope: Scope = {
      ...sampleScope,
      name: 'Scope 1bis',
      color: '#FEBEDE'
    };
    const {result} = renderHook(() => useScopes());

    // WHEN
    act(() => result.current.create(sampleScope));

    // THEN
    expect(result.current.list).to.deep.equal([sampleScope]);
    expect(result.current.retrieve(sampleScope.id)).to.deep.equal(sampleScope);
    expect(localStorage.getItem('scopes')).to.deep.equal(JSON.stringify([sampleScope]));

    // WHEN
    act(() => result.current.update(modifiedScope));

    // THEN
    expect(result.current.list).to.deep.equal([modifiedScope]);
    expect(localStorage.getItem('scopes')).to.deep.equal(JSON.stringify([modifiedScope]));

    // WHEN
    act(() => result.current.delete(modifiedScope.id));

    // THEN
    expect(result.current.list).to.deep.equal([]);
    expect(localStorage.getItem('scopes')).to.deep.equal(JSON.stringify([]));
  });

  it('useScopePoints should list, create, retrieve, update and delete ScopePoints', () => {

    // GIVEN
    const samplePoint: ScopePoint = {
      id: uuidv4(),
      name: 'Point 1',
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      },
      timestamp: Date.now(),
      description: '',
      images: [],
      isVisible: true
    };
    const modifiedPoint: ScopePoint = {
      ...samplePoint,
      name: 'Point 1bis',
      geometry: {
        type: 'Point',
        coordinates: [1, 1]
      },
      timestamp: Date.now() + 1,
      isVisible: false
    };
    const {result} = renderHook(() => useScopePoints(scopeId));

    // WHEN
    act(() => result.current.create(samplePoint));

    // THEN
    expect(result.current.list).to.deep.equal([samplePoint]);
    expect(result.current.retrieve(samplePoint.id)).to.deep.equal(samplePoint);
    expect(localStorage.getItem(`scopePoints_${scopeId}`)).to.deep.equal(JSON.stringify([samplePoint]));

    // WHEN
    act(() => result.current.update(modifiedPoint));

    // THEN
    expect(result.current.list).to.deep.equal([modifiedPoint]);
    expect(localStorage.getItem(`scopePoints_${scopeId}`)).to.deep.equal(JSON.stringify([modifiedPoint]));

    // WHEN
    act(() => result.current.delete(modifiedPoint.id));

    // THEN
    expect(result.current.list).to.deep.equal([]);
    expect(localStorage.getItem(`scopePoints_${scopeId}`)).to.deep.equal(JSON.stringify([]));

  });

  it('useScopePaths should list, create, retrieve, update and delete ScopePaths', () => {

    // GIVEN
    const samplePath: ScopePath = {
      id: uuidv4(),
      name: 'Path 1',
      geometry: {
        type: 'LineString',
        coordinates: [[0, 0], [1, 1]]
      },
      timestamp: Date.now(),
      description: '',
      images: [],
      isVisible: true
    };
    const modifiedPath: ScopePath = {
      ...samplePath,
      name: 'Path 1bis',
      geometry: {
        type: 'LineString',
        coordinates: [[2, 2], [3, 3]]
      },
      timestamp: Date.now() + 1,
      isVisible: false
    };
    const {result} = renderHook(() => useScopePaths(scopeId));

    // WHEN
    act(() => result.current.create(samplePath));

    // THEN
    expect(result.current.list).to.deep.equal([samplePath]);
    expect(result.current.retrieve(samplePath.id)).to.deep.equal(samplePath);
    expect(localStorage.getItem(`scopePaths_${scopeId}`)).to.deep.equal(JSON.stringify([samplePath]));

    // WHEN
    act(() => result.current.update(modifiedPath));

    // THEN
    expect(result.current.list).to.deep.equal([modifiedPath]);
    expect(localStorage.getItem(`scopePaths_${scopeId}`)).to.deep.equal(JSON.stringify([modifiedPath]));

    // WHEN
    act(() => result.current.delete(modifiedPath.id));

    // THEN
    expect(result.current.list).to.deep.equal([]);
    expect(localStorage.getItem(`scopePaths_${scopeId}`)).to.deep.equal(JSON.stringify([]));
  });
});
