import {ScopePoint, ScopeTrack} from '../../types/commonTypes';
import {dataUrl} from '../loaders/types';

export type ScopeImporterResult = {
  points: Array<ScopePoint>
  tracks: Array<ScopeTrack>
  numberOfErrors: number
}

export type ScopeImporter = (data: dataUrl | Blob) => Promise<ScopeImporterResult>
