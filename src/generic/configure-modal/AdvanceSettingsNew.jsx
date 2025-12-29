// import React, { useState } from "react";
import ToggleItem from "./ToggleItem";
import { useIntl } from "@edx/frontend-platform/i18n";
import messages from './messages';
// import { Form } from "@openedx/paragon";


const AdvanceSettingsNew = ({ initialValues = {}, setFieldValue = () => { }, fieldValue = {} }) => {
    const intl = useIntl();
    //   const [passingScore, setPassingScore] = useState(false);
    //   const [showAnswers, setShowAnswers] = useState(values.showCorrectness === SHOWASSESMENTANSWERS.ALWAYS);
    //   const [showGrade, setShowGrade] = useState(values.graderType !== 'notgraded');
    //   const onChangeGraderType = (e) => setFieldValue('graderType', e.target.value);

    //   const createOptions = () => courseGraders.map((option) => (
    //     <option key={option} value={option}> {option} </option>
    //   ));
    
    //   const onChangeAnswerVisibility = (e) => values.showCorrectness === SHOWASSESMENTANSWERS.ALWAYS ? setFieldValue('showCorrectness', SHOWASSESMENTANSWERS.NEVER) : setFieldValue('showCorrectness', SHOWASSESMENTANSWERS.ALWAYS)
      const onChangeEnableSubsectionGating = (e) => fieldValue['enable_subsection_gating']?.value ?? initialValues?.enableSubsectionGating?.value ? setFieldValue({...fieldValue,enable_subsection_gating : { value : false }}) :setFieldValue({...fieldValue,enable_subsection_gating : { value : true }}) 
    return (
        <div>
            <ToggleItem
                label={intl.formatMessage(messages.sequentialCourseProgression)}
                description={intl.formatMessage(messages.sequentialCourseProgressionDesc)}
                checked={fieldValue['enable_subsection_gating']?.value ?? initialValues?.enableSubsectionGating?.value}
            onChange={onChangeEnableSubsectionGating}
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
                label={intl.formatMessage(messages.minimumTimeonUnit)}
                description={intl.formatMessage(messages.minimumTimeonUnitDesc)}
            // checked={showGrade}
            // onChange={() => setShowGrade(!showGrade)}
            >
                {/* {showGrade&& <div className="mt-1">
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
        </div>} */}
            </ToggleItem>
        </div>
    );
};

export default AdvanceSettingsNew;
