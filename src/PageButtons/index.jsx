import React from 'react';

import { Button } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import messages from './messages';

export const PageButtons = ({
  prev = {
    disabled: true,
    onClick: () => { }
  },
  next = {
    disabled: true,
    onClick: () => { }
  },
}) => {
  const intl = useIntl();

  if (prev.disabled && next.disabled) {
    return null;
  }
  return (
    <div
      className="d-flex justify-content-center"
      style={{ paddingBottom: '20px' }}
    >
      <Button
        style={{ margin: '20px' }}
        variant="outline-primary"
        disabled={prev.disabled}
        onClick={prev.onClick}
      >
        {intl.formatMessage(messages.prevPage)}
      </Button>
      <Button
        style={{ margin: '20px' }}
        variant="outline-primary"
        disabled={next.disabled}
        onClick={next.onClick}
      >
        {intl.formatMessage(messages.nextPage)}
      </Button>
    </div>
  );
};

PageButtons.propTypes = {};

export default PageButtons;
