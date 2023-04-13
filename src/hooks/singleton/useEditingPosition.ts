import {useState} from 'react';
import {Position} from 'geojson';
import {singletonHook} from 'react-singleton-hook';

type onAcceptFn = () => void;
type onCancelFn = (initialPosition?: Position) => void;

type startFn = (argument: {
  initialPosition?: Position,
  onAccept?: onAcceptFn,
  onCancel?: onCancelFn
}) => boolean;

type editingState = {
  isEditing: boolean,
  onAccept?: onAcceptFn,
  onCancel?: onCancelFn,
  initialPosition?: Position
};

type useEditingPositionType = {
  start: startFn,
  accept: () => void,
  cancel: () => void,
  isEditing: boolean
};

const useEditingPosition = (): useEditingPositionType => {
  const [state, setState] = useState<editingState>({isEditing: false});

  const start: startFn = ({initialPosition, onAccept, onCancel}) => {
    if (state.isEditing) {
      console.info('Cannot edit position. Another position is being edited.');
      return false;
    } else {
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
    state.onAccept && state.onAccept();
    setState({isEditing: false});
  };

  const cancel = () => {
    state.onCancel && state.onCancel(state.initialPosition);
    setState({isEditing: false});
  };

  return {
    start,
    accept,
    cancel,
    isEditing: state.isEditing
  };
};

const initialState: useEditingPositionType = {
  start: () => false,
  accept: () => undefined,
  cancel: () => undefined,
  isEditing: false
};

export default singletonHook<useEditingPositionType>(initialState, useEditingPosition);
