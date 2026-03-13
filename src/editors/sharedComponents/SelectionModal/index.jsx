import React from 'react';
import PropTypes from 'prop-types';

import { Button, Stack } from '@openedx/paragon';
import { Add } from '@openedx/paragon/icons';
import {
  FormattedMessage,
  useIntl,
} from '@edx/frontend-platform/i18n';

import BaseModal from '../BaseModal';
import SearchSort from './SearchSort';
import Gallery from './Gallery';
import { FileInput } from '../FileInput';
import ErrorAlert from '../ErrorAlerts/ErrorAlert';
import FetchErrorAlert from '../ErrorAlerts/FetchErrorAlert';
import UploadErrorAlert from '../ErrorAlerts/UploadErrorAlert';

import './index.scss';

const SelectionModal = ({
  isOpen,
  close,
  size,
  isFullscreenScroll,
  galleryError,
  inputError,
  fileInput,
  galleryProps,
  searchSortProps,
  selectBtnProps,
  acceptedFiles,
  modalMessages,
  isLoaded,
  isFetchError,
  isUploadError,
}) => {
  const intl = useIntl();
  const {
    confirmMsg,
    uploadButtonMsg,
    titleMsg,
    fetchError,
    uploadError,
  } = modalMessages;

  let background = '#FFFFFF';
  let showGallery = true;
  if (isLoaded && !isFetchError && !isUploadError && !inputError.show) {
    background = '#FFFFFF';
  } else if (isLoaded) {
    showGallery = false;
  }

  const galleryPropsValues = {
    isLoaded,
    ...galleryProps,
  };

  return (
    <BaseModal
      close={close}
      confirmAction={(
        <Button {...selectBtnProps} variant="primary btn-sm">
          <FormattedMessage {...confirmMsg} />
        </Button>
      )}
      isOpen={isOpen}
      size={size}
      isFullscreenScroll={isFullscreenScroll}
      footerAction={(
        <Button
          className="mr-2 bg-white btn-block"
          iconBefore={Add}
          onClick={fileInput.click}
          variant="outline-third"
          size='sm'
          style={{
            textDecoration: 'none',
          }}
        >
          <FormattedMessage {...uploadButtonMsg} />
        </Button>
      )}
      title={intl.formatMessage(titleMsg)}
      bodyStyle={{ }}
      headerComponent={null}
      className="selection-modal _rounded-md"
    >
      {/*
        If the modal dialog content is zero height, it shows a bottom shadow
        as if there was content to scroll to, so make the min-height 1px.
      */}
      <Stack gap={2} style={{ minHeight: '1px' }}>
        {/* Error Alerts */}
        <FetchErrorAlert isFetchError={isFetchError} message={fetchError} />
        <UploadErrorAlert isUploadError={isUploadError} message={uploadError} />
        <ErrorAlert
          dismissError={inputError.dismiss}
          hideHeading
          isError={inputError.show}
        >
          <FormattedMessage {...inputError.message} />
        </ErrorAlert>

        {/* User Feedback Alerts */}
        <ErrorAlert
          dismissError={galleryError.dismiss}
          hideHeading
          isError={galleryError.show}
        >
          <FormattedMessage {...galleryError.message} />
        </ErrorAlert>
        {showGallery && <Gallery {...galleryPropsValues} />}
        <FileInput fileInput={fileInput} acceptedFiles={Object.values(acceptedFiles).join()} />
      </Stack>
    </BaseModal>
  );
};

SelectionModal.defaultProps = {
  size: 'lg',
  isFullscreenScroll: true,
};

SelectionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  size: PropTypes.string,
  isFullscreenScroll: PropTypes.bool,
  galleryError: PropTypes.shape({
    dismiss: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    set: PropTypes.func.isRequired,
    message: PropTypes.shape({}).isRequired,
  }).isRequired,
  inputError: PropTypes.shape({
    dismiss: PropTypes.func.isRequired,
    show: PropTypes.bool.isRequired,
    set: PropTypes.func.isRequired,
    message: PropTypes.shape({}).isRequired,
  }).isRequired,
  fileInput: PropTypes.shape({
    click: PropTypes.func.isRequired,
  }).isRequired,
  galleryProps: PropTypes.shape({}).isRequired,
  searchSortProps: PropTypes.shape({}).isRequired,
  selectBtnProps: PropTypes.shape({}).isRequired,
  acceptedFiles: PropTypes.shape({}).isRequired,
  modalMessages: PropTypes.shape({
    confirmMsg: PropTypes.shape({}).isRequired,
    uploadButtonMsg: PropTypes.shape({}).isRequired,
    titleMsg: PropTypes.shape({}).isRequired,
    fetchError: PropTypes.shape({}).isRequired,
    uploadError: PropTypes.shape({}).isRequired,
  }).isRequired,
  isLoaded: PropTypes.bool.isRequired,
  isFetchError: PropTypes.bool.isRequired,
  isUploadError: PropTypes.bool.isRequired,
};

export default SelectionModal;
