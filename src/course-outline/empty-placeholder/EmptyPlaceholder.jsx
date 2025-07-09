import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Add as IconAdd } from '@openedx/paragon/icons/es5';
import { Button, OverlayTrigger, Tooltip } from '@openedx/paragon';

import messages from './messages';

const EmptyPlaceholder = ({
  onCreateNewSection,
  childAddable,
}) => {
  const intl = useIntl();

  return (
    <div className="outline-empty-placeholder" data-testid="empty-placeholder">
      <h4 className="mb-0">{intl.formatMessage(messages.title)}</h4>
      <p className="mb-0">{intl.formatMessage(messages.description)}</p>
      {childAddable && (
        <OverlayTrigger
          placement="bottom"
          overlay={(
            <Tooltip id={intl.formatMessage(messages.tooltip)}>
              {intl.formatMessage(messages.tooltip)}
            </Tooltip>
          )}
        >
          <Button
            variant="primary"
            size="sm"
            iconBefore={IconAdd}
            onClick={onCreateNewSection}
          >
            {intl.formatMessage(messages.button)}
          </Button>
        </OverlayTrigger>
      )}
    </div>
  );
};

EmptyPlaceholder.propTypes = {
  onCreateNewSection: PropTypes.func.isRequired,
  childAddable: PropTypes.bool.isRequired,
};

export default EmptyPlaceholder;
