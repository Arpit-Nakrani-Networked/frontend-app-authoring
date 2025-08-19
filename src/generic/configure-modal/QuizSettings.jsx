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
  const [showAnswers, setShowAnswers] = useState(values.showCorrectness === SHOWASSESMENTANSWERS.ALWAYS);
  const [showGrade, setShowGrade] = useState(values.graderType !== 'notgraded');
  const onChangeGraderType = (e) => setFieldValue('graderType', e.target.value);

  const createOptions = () => courseGraders.map((option) => (
    <option key={option} value={option}> {option} </option>
  ));

  const onChangeAnswerVisibility = (e) => values.showCorrectness === SHOWASSESMENTANSWERS.ALWAYS ? setFieldValue('showCorrectness', SHOWASSESMENTANSWERS.NEVER) : setFieldValue('showCorrectness', SHOWASSESMENTANSWERS.ALWAYS)
  return (
    <div>
      <ToggleItem
        label={intl.formatMessage(messages.includePassingScoreTitle)}
        description={intl.formatMessage(messages.includePassingScoreDesc)}
        checked={passingScore}
        onChange={() => setPassingScore(!passingScore)}
      >
        {passingScore&& <div className="mt-1">
          <Form.Group className="mb-0">
            <Form.Control
              as="select"
              defaultValue={values.graderType}
              onChange={onChangeGraderType}
              data-testid="grader-type-select"
            >
              <option key="notgraded" value="notgraded">
                {intl.formatMessage(messages.passingScoreLimit)}
              </option>
              {createOptions()}
            </Form.Control>
          </Form.Group>
        </div>}
      </ToggleItem>
      <ToggleItem
        label={intl.formatMessage(messages.showAnserOnResultTitle)}
        description={intl.formatMessage(messages.showAnserOnResultDesc)}
        checked={showAnswers}
        onChange={() => setShowAnswers(!showAnswers)}
      >
        {showAnswers&& <div className="mt-1">
          <Form.Group className="mb-0">
            <Form.Control
              as="select"
              defaultValue={values.graderType}
              onChange={onChangeGraderType}
              data-testid="grader-type-select"
            >
              <option key="notgraded" value="notgraded">
                {intl.formatMessage(messages.selectAnswer)}
              </option>
              {createOptions()}
            </Form.Control>
          </Form.Group>
        </div>}
      </ToggleItem>
      <ToggleItem
        label={intl.formatMessage(messages.includeGradeTitle)}
        description={intl.formatMessage(messages.includeGradeDesc)}
        checked={showGrade}
        onChange={() => setShowGrade(!showGrade)}
      >
       {showGrade&& <div className="mt-1">
          <Form.Group className="mb-0">
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
        </div>}
      </ToggleItem>
    </div>
  );
};

export default QuizSettings;
