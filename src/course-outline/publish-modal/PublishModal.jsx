/* eslint-disable import/named */
import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ModalDialog,
  Button,
  ActionRow,
} from '@openedx/paragon';
import { useSelector } from 'react-redux';

import { getCurrentItem } from '../data/selectors';
import { COURSE_BLOCK_NAMES } from '../constants';
import messages from './messages';

const PublishModal = ({
  isOpen,
  onClose,
  onPublishSubmit,
}) => {
  const intl = useIntl();
  const { displayName, childInfo, category } = useSelector(getCurrentItem);
  const categoryName = COURSE_BLOCK_NAMES[category]?.name.toLowerCase();
  // const children = childInfo?.children || [];

  return (
    <ModalDialog
      className=""
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      isFullscreenOnMobile
      isOverflowVisible={false}
    >
      <ModalDialog.Header className="">
        <ModalDialog.Title>
          {intl.formatMessage(messages.title)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <p className="">
          {intl.formatMessage(messages.description, { category: categoryName })}
        </p>
        {/* {children.filter(child => child.hasChanges).map((child) => {
          let grandChildren = child.childInfo?.children || [];
          grandChildren = grandChildren.filter(grandChild => grandChild.hasChanges);

          return grandChildren.length ? (
            <React.Fragment key={child.id}>
              <span className="small text-gray-400">{child.displayName}</span>
              {grandChildren.map((grandChild) => (
                <div
                  key={grandChild.id}
                  className="small border border-light-400 p-2 publish-modal__subsection"
                >
                  {grandChild.displayName}
                </div>
              ))}
            </React.Fragment>
          ) : (
            <div
              key={child.id}
              className="small border border-light-400 p-2 publish-modal__subsection"
            >
              {child.displayName}
            </div>
          );
        })} */}
      </ModalDialog.Body>
      <ModalDialog.Footer className="pt-1">
        <ActionRow>
          <ModalDialog.CloseButton variant="outline-third" size='sm' >
            {intl.formatMessage(messages.cancelButton)}
          </ModalDialog.CloseButton>
          <Button
            variant='outline-primary'
            size='sm'
            data-testid="publish-confirm-button"
            onClick={onPublishSubmit}
          >
            {intl.formatMessage(messages.publishButton)}
          </Button>
        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

PublishModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onPublishSubmit: PropTypes.func.isRequired,
};

export default PublishModal;
