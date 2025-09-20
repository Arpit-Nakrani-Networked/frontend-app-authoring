import { useDispatch, useSelector } from 'react-redux';
import { hideToast, showToast } from './data/slice';
import { getToastNotification } from './data/selectors';

export const useCustomToast = () => {
  const dispatch = useDispatch();

   const {
      isShow,message,status,action
    } = useSelector(
      getToastNotification
    );

  const triggerToast = (
    message: string,
    status: 'success' | 'error' | 'info' | 'warning' = 'success',
    action?: { label: string; onClick: () => void },
    duration = 5000
  ) => {
    dispatch(showToast({ message, status, action }));

    if (duration > 0) {
      setTimeout(() => {
        dispatch(hideToast());
      }, duration);
    }
  };

  const closeToast = () => dispatch(hideToast());

  return {
    message,
    status,
    isShow,
    action,
    showToast: triggerToast,
    closeToast,
  };
};
