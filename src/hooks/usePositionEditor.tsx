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

const usePositionEditorImpl = () => {
  const {viewport, setViewport} = useViewport();
  const [isEditing, setEditing] = useState<boolean>(false);
  const [onAccept, setOnAccept] = useState<acceptFn>();
  const [onCancel, setOnCancel] =  useState<cancelFn>();

  const currentPosition: Position | undefined = isEditing ? [viewport.longitude, viewport.latitude] : undefined;

  const start: startFn = ({initialPosition, onAccept, onCancel}) => {
    if (isEditing) {
      console.error('Cannot edit position. Another position is being edited.');
      return false;
    } else {

      if (onAccept) {
        setOnAccept(onAccept);
      } else {
        setOnAccept(undefined);
      }

      if (onCancel) {
        setOnCancel(onCancel);
      } else {
        setOnCancel(undefined);
      }

      if (initialPosition) {
        setViewport({
          longitude: initialPosition[0],
          latitude: initialPosition[1],
          zoom: MAP_PROPS.maxZoom
        });
      } else {
        setViewport({
          zoom: MAP_PROPS.maxZoom
        });
      }

      setEditing(true);
      return true;
    }
  };

  const accept = () => {
    onAccept && onAccept(currentPosition);
    setEditing(false);
    setOnAccept(undefined);
    setOnCancel(undefined);
  };

  const cancel = () => {
    onCancel && onCancel(); // initialPosition?
    setEditing(false);
    setOnAccept(undefined);
    setOnCancel(undefined);
  };

  return {
    start,
    accept,
    cancel,
    position: currentPosition
  };
};

const initialState = () => ({
  start: () => false,
  accept: () => undefined,
  cancel: () => undefined,
  position: undefined
});

export const usePositionEditor = singletonHook(initialState, usePositionEditorImpl);
