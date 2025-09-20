import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getToastNotification } from './data/selectors';
import CustomToast from '../../_components/toast/Toast';
import { hideToast } from './data/slice';
import { Icon } from '@openedx/paragon';
import { CheckCircle } from '@openedx/paragon/icons';
import { Error } from '@openedx/paragon/icons';

const ToastRenderer = () => {
  const dispatch = useDispatch();
  const {
    isShow,message,status,action
  } = useSelector(
    getToastNotification
  );


  if (!isShow || !message) return null;

  return (
    <CustomToast
      show={isShow || true}
      onClose={() => dispatch(hideToast())}
      status={status}
    >
      {status==="success" ? <Icon src={CheckCircle} className="mr-2 text-success-500" /> : null}
      {status==="error" ? <Icon src={Error} className="mr-2 _text-error" /> : null}
      {message}
      {action && (
        <button
          onClick={action.onClick}
          className="ml-2 underline"
        >
          {action.label}
        </button>
      )}
    </CustomToast>
  );
};

export default ToastRenderer;
