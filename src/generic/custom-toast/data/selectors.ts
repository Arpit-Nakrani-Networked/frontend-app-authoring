// eslint-disable-next-line import/prefer-default-export
export const getToastNotification = (state) => ({
  isShow: state.toast.isShow,
  status: state.toast.status,
  message: state.toast.message,
  action: state.toast.action,
});
