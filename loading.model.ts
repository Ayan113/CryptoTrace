
import { action, Action } from "easy-peasy";

export interface LoadingModel {
  isLoading: boolean;
  setLoading: Action<LoadingModel, boolean>;
}

const loadingModel: LoadingModel = {
  isLoading: false,
  setLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
};

export default loadingModel;