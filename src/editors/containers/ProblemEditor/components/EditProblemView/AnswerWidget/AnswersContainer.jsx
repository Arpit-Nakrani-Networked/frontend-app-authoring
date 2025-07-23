import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import {
  Dropdown, Form, Icon, Stack,
} from '@openedx/paragon';
import { Add } from '@openedx/paragon/icons';
import messages from './messages';
import { useAnswerContainer, isSingleAnswerProblem } from './hooks';
import { actions, selectors } from '../../../../../data/redux';
import { answerOptionProps } from '../../../../../data/services/cms/types';
import AnswerOption from './AnswerOption';
import Button from '../../../../../sharedComponents/Button';
import { ProblemTypeKeys } from '../../../../../data/constants/problem';

const AnswersContainer = ({
  problemType,
  // Redux
  answers,
  addAnswer,
  addAnswerRange,
  updateField,
}) => {
  const hasSingleAnswer = isSingleAnswerProblem(problemType);

  useAnswerContainer({ answers, problemType, updateField });

  const isMultiSelect = ProblemTypeKeys.MULTISELECT === problemType;
  const handleQuestionTypeChange = (event) => {
    if (event.target.checked) {
      updateField({ problemType: ProblemTypeKeys.MULTISELECT });
    } else {
      updateField({ problemType: ProblemTypeKeys.SINGLESELECT });
    }
  };

  return (
    <div className="answers-container px-2">
      {answers.map((answer) => (
        <AnswerOption
          key={answer.id}
          hasSingleAnswer={hasSingleAnswer}
          answer={answer}
        />
      ))}

      {problemType !== ProblemTypeKeys.NUMERIC ? (
        <Stack direction="horizontal" className="justify-content-between mt-2">
          <Button
            variant="add"
            onClick={addAnswer}
            className={`text-primary btn btn-outline-third px-3`}
          >
            <FormattedMessage {...messages.addAnswerButtonText} />
            
          </Button>
          <div className="d-flex justify-content-center align-items-center"><Form.Switch checked={isMultiSelect} onChange={handleQuestionTypeChange} label="Allow Multiple Answer" /> <FormattedMessage {...messages.toggleAnswerInputLabel} /></div>
        </Stack>

      ) : (
        <Dropdown>
          <Dropdown.Toggle
            id="Add-Answer-Or-Answer-Range"
            variant="tertiary"
            className="px-3 text-primary btn btn-outline-third "
          >
            <Icon
              src={Add}
            />
            <FormattedMessage {...messages.addAnswerButtonText} />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              key="add-answer"
              onClick={addAnswer}
              className={`AddAnswerRange ${answers.length === 1 && answers[0].isAnswerRange ? 'disabled' : ''}`}
            >
              <FormattedMessage {...messages.addAnswerButtonText} />
            </Dropdown.Item>
            <Dropdown.Item
              key="add-answer-range"
              onClick={addAnswerRange}
              className={`AddAnswerRange ${answers.length > 1 || (answers.length === 1 && answers[0].isAnswerRange) ? 'disabled' : ''}`}
            >
              <FormattedMessage {...messages.addAnswerRangeButtonText} />
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      )}
    </div>
  );
};

AnswersContainer.propTypes = {
  problemType: PropTypes.string.isRequired,
  answers: PropTypes.arrayOf(answerOptionProps).isRequired,
  addAnswer: PropTypes.func.isRequired,
  addAnswerRange: PropTypes.func.isRequired,
  updateField: PropTypes.func.isRequired,
};

export const mapStateToProps = (state) => ({
  answers: selectors.problem.answers(state),
});

export const mapDispatchToProps = {
  addAnswer: actions.problem.addAnswer,
  addAnswerRange: actions.problem.addAnswerRange,
  updateField: actions.problem.updateField,
};

export const AnswersContainerInternal = AnswersContainer; // For testing only
export default connect(mapStateToProps, mapDispatchToProps)(AnswersContainer);
