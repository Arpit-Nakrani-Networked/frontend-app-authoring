import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Form } from '@openedx/paragon';

import { defaultAssignmentsPropTypes } from '../utils/enum';

const AssignmentItem = ({
  title,
  descriptions,
  type,
  min,
  max,
  errorMsg,
  className,
  name,
  onChange,
  value,
  errorEffort,
  secondErrorMsg,
  gradeField,
  trailingElement,
  isLabelShow,
  isFormOpen,
  isLoading
}) => (
  <li className={className}>
    <Form.Group className={classNames('form-group-custom m-0', {
      'form-group-custom_isInvalid': errorEffort,
    })}
    >
      {isLabelShow &&<Form.Label className="grading-label">{title}</Form.Label>}
      {isFormOpen ? <Form.Control
        data-testid={`assignment-${name}-input`}
        type={type}
        min={min}
        max={max}
        name={name}
        onChange={onChange}
        value={value}
        isInvalid={errorEffort}
        trailingElement={trailingElement}
         disabled={isLoading}
      />: <div className='py-3 _text-black-400 _font-weight-medium _text-xl'>{value}{trailingElement}</div>}
      {/* <Form.Control.Feedback className="grading-description">
        {descriptions}
      </Form.Control.Feedback> */}
      {/* {errorEffort && (
        <Form.Control.Feedback className="feedback-error" type="invalid">
          {errorMsg}
        </Form.Control.Feedback>
      )} */}
      {/* {gradeField?.dropCount !== 0 && gradeField?.dropCount > gradeField?.minCount && (
        <Form.Control.Feedback className="feedback-error" type="invalid">
          {secondErrorMsg}
        </Form.Control.Feedback>
      )} */}
    </Form.Group>
  </li>
);

AssignmentItem.defaultProps = {
  max: undefined,
  errorMsg: undefined,
  min: undefined,
  value: '',
  secondErrorMsg: undefined,
  isLoading: false,
  isFormOpen: false,
  errorEffort: false,
  isLabelShow: false,
  gradeField: undefined,
  trailingElement: undefined,
};

AssignmentItem.propTypes = {
  title: PropTypes.string.isRequired,
  descriptions: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  isLabelShow: PropTypes.bool,
  isLoading: PropTypes.bool,
  isFormOpen: PropTypes.bool,
  min: PropTypes.number,
  max: PropTypes.number,
  errorMsg: PropTypes.string,
  name: PropTypes.string.isRequired,
  className: PropTypes.string.isRequired,
  secondErrorMsg: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  errorEffort: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  gradeField: PropTypes.shape(defaultAssignmentsPropTypes),
  trailingElement: PropTypes.string,
};

export default AssignmentItem;
