import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import { Stack } from '@openedx/paragon';
import messages from './messages';
import { ProblemTypes } from '../../../../../data/constants/problem';
import AnswersContainer from './AnswersContainer';

// This widget should be connected, grab all answers from store, update them as needed.
const AnswerWidget = ({
  // Redux
  problemType,
  // injected
  intl,
}) => {
  const problemStaticData = ProblemTypes[problemType];
  return (
    <Stack gap={2}>
      <div className="">
        <div className="_text-base mb-1 _text-black-400">
          <FormattedMessage {...messages.answerWidgetTitle} />
        </div>
        <div className="_text-sm text-gray-500">
          {intl.formatMessage(messages.answerHelperText, { helperText: problemStaticData.description })}
        </div>
      </div>
      <AnswersContainer problemType={problemType} />
    </Stack>
  );
};

AnswerWidget.propTypes = {
  problemType: PropTypes.string.isRequired,
  // injected
  intl: intlShape.isRequired,
};
export const AnswerWidgetInternal = AnswerWidget; // For testing only
export default injectIntl(AnswerWidget);
