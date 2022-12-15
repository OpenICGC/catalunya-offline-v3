import {renderHook, act} from '@testing-library/react-hooks/dom';
import {expect} from 'chai';
import {useScopes, useScopePoints, useScopeTracks} from './useLocalStores';
import {Scope, ScopeTrack, ScopePoint} from '../types/commonTypes';
import {v4 as uuidv4} from 'uuid';

describe('usePersitedCollection', () => {
  const scopeId = uuidv4();

  it('useScopes should list, create, retrieve, update and delete Scopes from localStorage', () => {

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

  it('useScopePoints should list, create, retrieve, update and delete ScopePoints from localStorage', () => {

    // GIVEN
    const samplePoint: ScopePoint = {
      type: 'Feature',
      id: uuidv4(),
      properties: {
        name: 'Point 1',
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      },
      geometry: {
        type: 'Point',
        coordinates: [0, 0]
      }
    };
    const modifiedPoint: ScopePoint = {
      ...samplePoint,
      properties: {
        ...samplePoint.properties,
        name: 'Point 1bis',
        timestamp: Date.now() + 1,
        isVisible: false
      },
      geometry: {
        type: 'Point',
        coordinates: [1, 1]
      }
    };
    const {result} = renderHook(() => useScopePoints(scopeId)());

    // WHEN
    act(() => result.current.create(samplePoint));

    // THEN
    expect(result.current.list).to.deep.equal([samplePoint]);
    expect(result.current.retrieve(samplePoint.id)).to.deep.equal(samplePoint);
    expect(localStorage.getItem(`${scopeId}:scopePoints`)).to.deep.equal(JSON.stringify([samplePoint]));

    // WHEN
    act(() => result.current.update(modifiedPoint));

    // THEN
    expect(result.current.list).to.deep.equal([modifiedPoint]);
    expect(localStorage.getItem(`${scopeId}:scopePoints`)).to.deep.equal(JSON.stringify([modifiedPoint]));

    // WHEN
    act(() => result.current.delete(modifiedPoint.id));

    // THEN
    expect(result.current.list).to.deep.equal([]);
    expect(localStorage.getItem(`${scopeId}:scopePoints`)).to.deep.equal(JSON.stringify([]));

  });

  it('useScopeTracks should list, create, retrieve, update and delete ScopeTracks from localStorage', () => {

    // GIVEN
    const sampleTrack: ScopeTrack = {
      type: 'Feature',
      id: uuidv4(),
      properties: {
        name: 'Track 1',
        timestamp: Date.now(),
        description: '',
        images: [],
        isVisible: true
      },
      geometry: {
        type: 'LineString',
        coordinates: [[0, 0], [1, 1]]
      }
    };
    const modifiedTrack: ScopeTrack = {
      ...sampleTrack,
      properties: {
        ...sampleTrack.properties,
        name: 'Track 1bis',
        timestamp: Date.now() + 1,
        isVisible: false
      },
      geometry: {
        type: 'LineString',
        coordinates: [[2, 2], [3, 3]]
      }
    };
    const {result} = renderHook(() => useScopeTracks(scopeId)());

    // WHEN
    act(() => result.current.create(sampleTrack));

    // THEN
    expect(result.current.list).to.deep.equal([sampleTrack]);
    expect(result.current.retrieve(sampleTrack.id)).to.deep.equal(sampleTrack);
    expect(localStorage.getItem(`${scopeId}:scopeTracks`)).to.deep.equal(JSON.stringify([sampleTrack]));

    // WHEN
    act(() => result.current.update(modifiedTrack));

    // THEN
    expect(result.current.list).to.deep.equal([modifiedTrack]);
    expect(localStorage.getItem(`${scopeId}:scopeTracks`)).to.deep.equal(JSON.stringify([modifiedTrack]));

    // WHEN
    act(() => result.current.delete(modifiedTrack.id));

    // THEN
    expect(result.current.list).to.deep.equal([]);
    expect(localStorage.getItem(`${scopeId}:scopeTracks`)).to.deep.equal(JSON.stringify([]));
  });
});
