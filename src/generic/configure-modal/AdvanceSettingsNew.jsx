// import React, { useState } from "react";
import ToggleItem from "./ToggleItem";
import { useIntl } from "@edx/frontend-platform/i18n";
import messages from './messages';
import { Form } from "@openedx/paragon";


const AdvanceSettingsNew = ({ initialValues = {}, setFieldValue = () => { }, fieldValue = {} }) => {
  const intl = useIntl();
  const onChangeEnableSubsectionGating = (e) => fieldValue['enable_subsection_gating'] ?? initialValues?.enableSubsectionGating?.value ? setFieldValue({ ...fieldValue, enable_subsection_gating: false }) : setFieldValue({ ...fieldValue, enable_subsection_gating: true })
  const onToggleMinimumTimeOnUnit = (e) => Boolean(typeof fieldValue['minimum_time_on_unit'] === 'number' ? fieldValue['minimum_time_on_unit'] > 0 : initialValues?.minimumTimeOnUnit?.value > 0) ? setFieldValue({ ...fieldValue, minimum_time_on_unit: 0 }) : setFieldValue({ ...fieldValue, minimum_time_on_unit: initialValues?.minimumTimeOnUnit?.value > 0 ? initialValues?.minimumTimeOnUnit?.value : 1 })
  const onChangeMinimumTimeOnUnit = (value) => {
    const intValue = parseInt(value.target.value, 10);
    const validValue = isNaN(intValue) ? 0 : intValue;
    validValue > 0  ? setFieldValue({ ...fieldValue, minimum_time_on_unit: validValue }) : setFieldValue({ ...fieldValue, minimum_time_on_unit: 1 })
  }
  return (
    <div>
      <ToggleItem
        label={intl.formatMessage(messages.sequentialCourseProgression)}
        description={intl.formatMessage(messages.sequentialCourseProgressionDesc)}
        checked={fieldValue['enable_subsection_gating'] ?? initialValues?.enableSubsectionGating?.value}
        onChange={onChangeEnableSubsectionGating}
      >
      </ToggleItem>
      <ToggleItem
        label={intl.formatMessage(messages.minimumTimeonUnit)}
        description={intl.formatMessage(messages.minimumTimeonUnitDesc)}
        checked={typeof fieldValue['minimum_time_on_unit'] === 'number' ? fieldValue['minimum_time_on_unit'] > 0 : Boolean(initialValues?.minimumTimeOnUnit?.value > 0)}
        onChange={onToggleMinimumTimeOnUnit}
      >
        {Boolean(typeof fieldValue['minimum_time_on_unit'] === 'number' ? fieldValue['minimum_time_on_unit'] > 0 : initialValues?.minimumTimeOnUnit?.value > 0)? <div className="mt-1 d-flex align-items-center gap-2">
          <span>Minimum time:</span>
          <Form.Group className="mx-2 mb-0">
            <Form.Control
                                    type="number"
                                    value={typeof fieldValue['minimum_time_on_unit'] === 'number' ? fieldValue['minimum_time_on_unit'] : initialValues?.minimumTimeOnUnit?.value}
                                    onChange={onChangeMinimumTimeOnUnit}
                                    style={{ height: '42px', borderRadius: '.75rem', border: '1px solid #0000001F',width: '80px' }}
                                    placeholder="00"
                                  />
          </Form.Group>
          <span>minutes</span>
        </div> : null}
      </ToggleItem>
    </div>
  );
};

export default AdvanceSettingsNew;
