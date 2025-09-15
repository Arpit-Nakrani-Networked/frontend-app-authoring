import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  ActionRow,
  Button,
  Icon,
  IconButton,
  ModalDialog,
  Spinner,
  Toast,
} from '@openedx/paragon';
import { Close } from '@openedx/paragon/icons';
import { useIntl, FormattedMessage } from '@edx/frontend-platform/i18n';

import { EditorComponent } from '../../EditorComponent';
import { useEditorContext } from '../../EditorContext';
import BaseModal from '../../sharedComponents/BaseModal';
import TitleHeader from './components/TitleHeader';
import * as hooks from './hooks';
import messages from './messages';
import './index.scss';
import usePromptIfDirty from '../../../generic/promptIfDirty/usePromptIfDirty';
import { selectors } from '../../data/redux';

interface WrapperProps {
  children: React.ReactNode;
}

export const EditorModalWrapper: React.FC<WrapperProps & { onClose: () => void }> = ({ children, onClose }) => {
  const intl = useIntl();
  const title = intl.formatMessage(messages.modalTitle);
  return (
    <ModalDialog isOpen size="lg" className="_rounded-md" isOverflowVisible={false} onClose={onClose} title={title} hasCloseButton isBlocking={true}>{children}</ModalDialog>
  );
};

export const EditorModalBody: React.FC<WrapperProps> = ({ children }) => <ModalDialog.Body className="pb-0 editor-modal-body">{children}</ModalDialog.Body>;

export const FooterWrapper: React.FC<WrapperProps> = ({ children }) => {
  const { fullScreen } = useEditorContext();
  if (fullScreen) {
    return <div className="editor-footer fixed-bottom">{children}</div>;
  }
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};

interface Props extends EditorComponent {
  children: React.ReactNode;
  getContent: Function;
  isDirty: () => boolean;
  hideFooter?: boolean;
  disabled?: boolean;
  saveText?: any;
  validateEntry?: Function | null;
}

const EditorContainer: React.FC<Props> = ({
  children,
  getContent,
  isDirty,
  onClose = null,
  validateEntry = null,
  returnFunction = null,
  deleteBlock,
  hideFooter = false,
  saveText,
  disabled
}) => {
  const intl = useIntl();
  const dispatch = useDispatch();
  //@ts-ignore
  const isLoading = useSelector(state => state?.app?.isLoading);
  // Required to mark data as not dirty on save
  const [saved, setSaved] = React.useState(false);
  const isInitialized = hooks.isInitialized();
  const { isCancelConfirmOpen, openCancelConfirmModal, closeCancelConfirmModal } = hooks.cancelConfirmModalToggle();
  const handleCancel = hooks.handleCancel({ onClose, returnFunction });
  const disableSave = !isInitialized || isLoading;
  const saveFailed = hooks.saveFailed();
  const clearSaveFailed = hooks.clearSaveError({ dispatch });
  const handleSave = hooks.handleSaveClicked({
    dispatch,
    getContent,
    validateEntry,
    returnFunction,
  });
  
  const onSave = () => {
    setSaved(true);
    handleSave();
  };
  // Stops user from navigating away if they have unsaved changes.
  usePromptIfDirty(() => {
    // Do not block if cancel modal is used or data is saved.
    if (isCancelConfirmOpen || saved) {
      return false;
    }
    return isDirty();
  });

  const deleteBlockFunc = () => {
    if (!deleteBlock) return;
    const content = getContent();
    
    if (!content || content?.length === 0) {
      deleteBlock()
    }
  }

  const confirmCancelIfDirty = () => {
    if (isDirty()) {
      openCancelConfirmModal();
    } else {
      deleteBlockFunc()
      handleCancel();
    }
  };
  return (
    <EditorModalWrapper onClose={confirmCancelIfDirty}>
      {saveFailed && (
        <Toast show onClose={clearSaveFailed}>
          <FormattedMessage {...messages.contentSaveFailed} />
        </Toast>
      )}
      <BaseModal
        size="md"
        confirmAction={(
          <Button
            variant="primary btn-sm"
            onClick={() => {
              handleCancel();
              if (returnFunction) {
                closeCancelConfirmModal();
              }
            }}
          >
            <FormattedMessage {...messages.okButtonLabel} />
          </Button>
        )}
        isOpen={isCancelConfirmOpen}
        close={() => {
          closeCancelConfirmModal();
        }}
        title={intl.formatMessage(messages.cancelConfirmTitle)}
      >
        <FormattedMessage {...messages.cancelConfirmDescription} />
      </BaseModal>
      <ModalDialog.Header className="editor-container_header">
        {/* <div className="d-flex flex-row justify-content-between"> */}
          {/* <span className="col pl-0 _font-weight-semibold"> */}
            <TitleHeader isInitialized={isInitialized} />
          {/* </span> */}
          {/* <IconButton
            src={Close}
            iconAs={Icon}
            size="sm"
            onClick={confirmCancelIfDirty}
            alt={intl.formatMessage(messages.exitButtonAlt)}
          /> */}
        {/* </div> */}
      </ModalDialog.Header>
      <EditorModalBody>
        {children}
      </EditorModalBody>
      {isInitialized && !hideFooter && <ModalDialog.Footer className="shadow-sm px-4 pb-3 pt-0">
        <ActionRow>
          <Button
            aria-label={intl.formatMessage(messages.cancelButtonAriaLabel)}
            variant="outline-third btn-sm"
            // style={{ padding: '6px  16px' }}
            onClick={confirmCancelIfDirty}
          >
            <FormattedMessage {...messages.cancelButtonLabel} />
          </Button>
          <Button
            aria-label={intl.formatMessage(messages.saveButtonAriaLabel)}
            onClick={onSave}
            variant="outline-primary btn-sm"
            // style={{ padding: '6px  16px' }}
            disabled={disableSave || isLoading || disabled}
          >
            {isLoading
              ? <Spinner animation="border" className="d-flex justify-content-center" style={{ width: '1rem', height: '1rem' }} />
              : (saveText || <FormattedMessage {...messages.saveButtonLabel} />)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>}
    </EditorModalWrapper>
  );
};

export default EditorContainer;
