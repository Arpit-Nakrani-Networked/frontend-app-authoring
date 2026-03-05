import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import { Icon, IconButton, Truncate } from '@openedx/paragon';
import { EditOutline } from '@openedx/paragon/icons';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { selectors } from '../../../../data/redux';
import { localTitleHooks } from './hooks';
import messages from './messages';
import EditableHeader from './EditableHeader';

const TitleHeader = ({
  isInitialized,
  isNew,
  // injected
  intl,
}) => {
  if (!isInitialized) { return intl.formatMessage(messages.loading); }
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const dispatch = useDispatch();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const title = useSelector(selectors.app.displayTitle);
  const prefix = isNew ? 'Add' : 'Edit';

  const titleAsPerNetowkedRequirment = title.toLowerCase() === 'text' ? prefix +' Text' : title.toLowerCase() === 'video' ? prefix + ' Video' : title.toLowerCase() === 'scorm module' ? prefix + ' Scorm':prefix + ' Question';
  const {
    inputRef,
    isEditing,
    handleChange,
    handleKeyDown,
    localTitle,
    startEditing,
    cancelEdit,
    updateTitle,
  } = localTitleHooks({ dispatch });

  if (isEditing) {
    return (
      <EditableHeader
        {...{
          inputRef,
          handleChange,
          handleKeyDown,
          localTitle,
          updateTitle,
          cancelEdit,
        }}
      />
    );
  }
  return (
    titleAsPerNetowkedRequirment
  );
};
TitleHeader.defaultProps = {};
TitleHeader.propTypes = {
  isInitialized: PropTypes.bool.isRequired,
  isNew: PropTypes.bool.isRequired,
  // injected
  intl: intlShape.isRequired,
};

export const TitleHeaderInternal = TitleHeader; // For testing only
export default injectIntl(TitleHeader);
