import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';
import { ITEM_BADGE_STATUS } from '../constants';
import { getItemStatusBadgeContent } from '../utils';
import messages from './messages';
import StatusBadge from './StatusBadge';

const CardStatus = ({
  status,
  showDiscussionsEnabledBadge,
}) => {
  const intl = useIntl();
  const { badgeTitle, badgeIcon } = getItemStatusBadgeContent(status, messages, intl);

  return (
    <>
      {/* {showDiscussionsEnabledBadge && (
        <StatusBadge
          text={intl.formatMessage(messages.discussionEnabledBadgeText)}
        />
      )} */}
      {badgeTitle && (
        <StatusBadge
          text={badgeTitle}
          icon={badgeIcon}
          iconSize="xs"
          iconClassName={classNames({ 'text-success-500': status === ITEM_BADGE_STATUS.live,'text-secondory': status === ITEM_BADGE_STATUS.draft})}
          className={classNames({'_bg-gray-50 _text-sm py-0 _text-black': status === ITEM_BADGE_STATUS.draft })}
        />
      )}
    </>
  );
};

CardStatus.propTypes = {
  status: PropTypes.string.isRequired,
  showDiscussionsEnabledBadge: PropTypes.bool.isRequired,
};

export default CardStatus;
