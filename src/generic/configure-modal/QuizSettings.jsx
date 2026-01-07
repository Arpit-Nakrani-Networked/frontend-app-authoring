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
      {/* <ToggleItem
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
      </ToggleItem> */}
      <ToggleItem
        label={intl.formatMessage(messages.makeUnitUnSkippable)}
        description={intl.formatMessage(messages.makeUnitUnSkippableDesc)}
        checked={values.showCorrectness === SHOWASSESMENTANSWERS.ALWAYS}
        onChange={onChangeAnswerVisibility}
      />
      <ToggleItem
        label={intl.formatMessage(messages.minimumTimeonUnit)}
        description={intl.formatMessage(messages.minimumTimeonUnitDesc)}
        checked={values.showCorrectness === SHOWASSESMENTANSWERS.ALWAYS}
        onChange={onChangeAnswerVisibility}
      >
 {Boolean(values.showCorrectness === SHOWASSESMENTANSWERS.ALWAYS)? <div className="mt-1 d-flex align-items-center gap-2">
          <span>Minimum time:</span>
          <Form.Group className="mx-2 mb-0">
            <Form.Control
                                    type="number"
                                    // value={}
                                    onChange={(e) => console.log(e.target.value)}
                                    style={{ height: '42px', borderRadius: '.75rem', border: '1px solid #0000001F',width: '80px' }}
                                    placeholder="00"
                                  />
          </Form.Group>
          <span>minutes</span>
        </div> : null}

      </ToggleItem>
      <div className="mb-3 mt-4 _text-black-400">{intl.formatMessage(messages.configureQuizTitle)}</div>
      <ToggleItem
        label={intl.formatMessage(messages.showAnserOnResultTitle)}
        description={intl.formatMessage(messages.showAnserOnResultDesc)}
        checked={values.showCorrectness === SHOWASSESMENTANSWERS.ALWAYS}
        onChange={onChangeAnswerVisibility}
      >
        {/* {showAnswers&& <div className="mt-1">
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
        </div>} */}
      </ToggleItem>
      <ToggleItem
        label={intl.formatMessage(messages.includeGradeTitle)}
        description={intl.formatMessage(messages.includeGradeDesc)}
        checked={showGrade}
        onChange={() => setShowGrade(!showGrade)}
      >
        {showGrade && <div className="mt-1">
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
