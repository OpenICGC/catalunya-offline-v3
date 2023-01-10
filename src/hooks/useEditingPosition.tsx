import {useState} from 'react';
import {Position} from 'geojson';
import {useViewport} from './useViewport';
import {singletonHook} from 'react-singleton-hook';
import {MAP_PROPS} from '../config';

type acceptFn = (finalPosition?: Position) => void;
type cancelFn = (initialPosition?: Position) => void;

type startFn = (argument: {
  initialPosition: Position | undefined,
  onAccept?: acceptFn,
  onCancel?: cancelFn
}) => boolean;

type editingState = {
  isEditing: boolean,
  onAccept?: acceptFn,
  onCancel?: cancelFn,
  initialPosition?: Position
};

const initialState = {
  isEditing: false
};

const useEditingPositionImpl = () => {
  const {viewport, setViewport} = useViewport();
  const [state, setState] = useState<editingState>(initialState);

  const position: Position | undefined = state.isEditing ? [viewport.longitude, viewport.latitude] : undefined;

  const start: startFn = ({initialPosition, onAccept, onCancel}) => {
    if (state.isEditing) {
      console.error('Cannot edit position. Another position is being edited.');
      return false;
    } else {
      setViewport({
        ...(initialPosition ? {
          longitude: initialPosition[0],
          latitude: initialPosition[1],
        } : {}),
        zoom: MAP_PROPS.maxZoom
      });
      setState({
        isEditing: true,
        onAccept,
        onCancel,
        initialPosition
      });
      return true;
    }
  };

  const accept = () => {
    state.onAccept && state.onAccept(position);
    setState(initialState);
  };

  const cancel = () => {
    state.onCancel && state.onCancel(state.initialPosition);
    setState(initialState);
  };

  return {
    start,
    accept,
    cancel,
    position
  };
};

const trivialImpl = () => ({
  start: () => false,
  accept: () => undefined,
  cancel: () => undefined,
  position: undefined
});

const useEditingPosition = singletonHook(trivialImpl, useEditingPositionImpl);

export default useEditingPosition;
