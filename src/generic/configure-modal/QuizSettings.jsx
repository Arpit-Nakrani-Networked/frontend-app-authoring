import React, { useState } from "react";
import ToggleItem from "./ToggleItem";
import { useIntl } from "@edx/frontend-platform/i18n";
import messages from './messages';
import { Form } from "@openedx/paragon";

const SHOWASSESMENTANSWERS = {
  ALWAYS: 'always',
  NEVER: 'never',
}

const QuizSettings = ({ setFieldValue, values, courseGraders }) => {
  const intl = useIntl();
  const [passingScore, setPassingScore] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const onChangeGraderType = (e) => setFieldValue('graderType', e.target.value);

  const createOptions = () => courseGraders.map((option) => (
    <option key={option} value={option}> {option} </option>
  ));
  return (
    <div>
      <ToggleItem
        label={intl.formatMessage(messages.includePassingScoreTitle)}
        description={intl.formatMessage(messages.includePassingScoreDesc)}
        checked={passingScore}
        onChange={() => setPassingScore(!passingScore)}
      />
      <ToggleItem
        label={intl.formatMessage(messages.showAnserOnResultTitle)}
        description={intl.formatMessage(messages.showAnserOnResultDesc)}
        checked={values.showCorrectness === SHOWASSESMENTANSWERS.ALWAYS}
        onChange={() => values.showCorrectness === SHOWASSESMENTANSWERS.ALWAYS ? setFieldValue('showCorrectness', SHOWASSESMENTANSWERS.NEVER) : setFieldValue('showCorrectness', SHOWASSESMENTANSWERS.ALWAYS)}
      />
      <ToggleItem
        label={intl.formatMessage(messages.includeGradeTitle)}
        description={intl.formatMessage(messages.includeGradeDesc)}
        checked={values.graderType !== 'notgraded'}
        onChange={() => setShowAnswers(!showAnswers)}
      >
        <div className="mt-1">
          <Form.Group>
            <Form.Control
              as="select"
              defaultValue={values.graderType}
              onChange={onChangeGraderType}
              data-testid="grader-type-select"
            >
              <option key="notgraded" value="notgraded">
                {intl.formatMessage(messages.notGradedTypeOption)}
              </option>
              {createOptions()}
            </Form.Control>
          </Form.Group>
        </div>
      </ToggleItem>
    </div>
  );
};

export default QuizSettings;
