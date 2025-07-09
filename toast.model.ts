import { action, Action, Thunk, thunk } from "easy-peasy";

export interface Toast {
  message: string;
  type: "success" | "error" | "info";
}

export interface ToastModel {
  toast: Toast | null;
  setToast: Action<ToastModel, Toast | null>;
  showToast: Thunk<ToastModel, Toast>;
}

const toastModel: ToastModel = {
  toast: null,
  setToast: action((state, payload) => {
    state.toast = payload;
  }),
  showToast: thunk((actions, payload) => {
    actions.setToast(payload);
    setTimeout(() => {
      actions.setToast(null);
    }, 3000);
  }),
};

export default toastModel;