import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import { ASSIGNMENT_TYPES, DUPLICATE_ASSIGNMENT_NAME } from '../utils/enum';
import messages from '../messages';

const AssignmentTypeName = ({
  intl, value, errorEffort, onChange,className = '',isLabelShow,isFormOpen,isLoading
}) => {
  const initialAssignmentName = useRef(value);

  return (
    <li className={`course-grading-assignment-type-name ${className}`}>
      <Form.Group className={classNames('form-group-custom mb-0', {
        'form-group-custom_isInvalid': errorEffort,
      })}
      >
        {isLabelShow && <Form.Label className="grading-label">
          {intl.formatMessage(messages.assignmentTypeNameTitle)}
        </Form.Label>}
        {isFormOpen ? <Form.Control
          data-testid="assignment-type-name-input"
          type="text"
          name={ASSIGNMENT_TYPES.type}
          onChange={onChange}
          value={value}
          isInvalid={Boolean(errorEffort)}
          disabled={isLoading}
        /> :<div className='py-3 _text-black-400 _font-weight-medium _text-xl'>{value}</div>}
        {/* <Form.Control.Feedback className="grading-description">
          {intl.formatMessage(messages.assignmentTypeNameDescription)}
        </Form.Control.Feedback> */}
        {/* {errorEffort && errorEffort !== DUPLICATE_ASSIGNMENT_NAME && (
          <Form.Control.Feedback className="feedback-error" type="invalid">
            {intl.formatMessage(messages.assignmentTypeNameErrorMessage1)}
          </Form.Control.Feedback>
        )}
        {value !== initialAssignmentName.current && initialAssignmentName.current !== '' && (
          <Form.Control.Feedback className="feedback-error" type="invalid">
            {intl.formatMessage(messages.assignmentTypeNameErrorMessage2, {
              initialAssignmentName: initialAssignmentName.current,
              value,
            })}
          </Form.Control.Feedback>
        )}
        {errorEffort === DUPLICATE_ASSIGNMENT_NAME && (
          <Form.Control.Feedback className="feedback-error" type="invalid">
            {intl.formatMessage(messages.assignmentTypeNameErrorMessage3)}
          </Form.Control.Feedback>
        )} */}
      </Form.Group>
    </li>
  );
};

AssignmentTypeName.defaultProps = {
  errorEffort: false,
  isLabelShow: false,
  isFormOpen: false,
  isLoading: false,
};

AssignmentTypeName.propTypes = {
  intl: intlShape.isRequired,
  isLoading: PropTypes.bool,
  isFormOpen: PropTypes.bool,
  isLabelShow: PropTypes.bool,
  className: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  errorEffort: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]).isRequired,
};

export default injectIntl(AssignmentTypeName);
