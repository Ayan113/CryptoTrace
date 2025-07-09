import { createTypedHooks } from 'easy-peasy';
import { Model } from './models';

const { useStoreActions, useStoreState, useStoreDispatch, useStore } = createTypedHooks<Model>();

export {
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore
}