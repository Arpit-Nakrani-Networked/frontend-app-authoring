/* eslint-disable import/named */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  ModalDialog,
  Button,
  ActionRow,
  StatefulButton,
} from '@openedx/paragon';
import messages from './messages';
import { Form } from '@openedx/paragon';
import classNames from 'classnames';
import { STATEFUL_BUTTON_STATES } from '../../constants';
import { RequestStatus } from '../../data/constants';

const MIN_NUMBER_VALUE = 0;
const MAX_NUMBER_VALUE = 100;


const GradingModal = ({
  isOpen,
  onClose,
  onSubmit,
  eligibleGrade,
  setEligibleGrade,
  isLoading,
  isDisabled
}) => {
  const [errorEffort, setErrorEffort] = useState(false);
  const [grade, setGrade] = useState(eligibleGrade);
  const intl = useIntl();

  const handleGradeChange = (event) => {
    // Handle the change in grade input
    const { value } = event.target;
    // Logic to update the grade state can be added here
    if (value < MIN_NUMBER_VALUE || value > MAX_NUMBER_VALUE) {
      setErrorEffort(true);
    } else {
      setErrorEffort(false);
      setGrade(value)
      setEligibleGrade(value);
    }
  };

  const updateValuesButtonState = {
    labels: {
      default: intl.formatMessage(messages.buttonSaveText),
      pending: intl.formatMessage(messages.buttonSavingText),
    },
    disabledStates: [RequestStatus.PENDING],
  };
  return (
    <ModalDialog
      className="gradings-modal"
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      isFullscreenOnMobile
      isOverflowVisible={false}
    >
      <ModalDialog.Header className="publish-modal__header">
        <ModalDialog.Title>
          {intl.formatMessage(messages.title)}
        </ModalDialog.Title>
      </ModalDialog.Header>
      <ModalDialog.Body>
        <Form.Group
          className={classNames('form-group-custom w-100', {
            'form-group-custom_isInvalid': errorEffort,
          })}
        >
          <Form.Label className="grading-label">
            {intl.formatMessage(messages.gradingLabel)}
          </Form.Label>
          <Form.Control
            data-testid="minimum-grade-credit-input"
            type="number"
            value={grade}
            name="grade_weight"
            onChange={handleGradeChange}
            min={MIN_NUMBER_VALUE}
            max={MAX_NUMBER_VALUE}
            trailingElement="%"
            disabled={isLoading}
          />
          <Form.Control.Feedback className="grading-description">
            {intl.formatMessage(messages.gradingDescription)}
          </Form.Control.Feedback>
          {errorEffort && (
            <Form.Control.Feedback className="feedback-error" type="invalid">
              {intl.formatMessage(messages.creditEligibilityErrorMsg, {
                min: MIN_NUMBER_VALUE,
                max: MAX_NUMBER_VALUE
              })}.
            </Form.Control.Feedback>
          )}
        </Form.Group>
      </ModalDialog.Body>
      <ModalDialog.Footer className="pt-1">
        <ActionRow>
          {!isLoading && <ModalDialog.CloseButton variant="tertiary" className="btn-sm btn-outline-third">
            {intl.formatMessage(messages.cancelButton)}
          </ModalDialog.CloseButton>}
          <StatefulButton
            key="statefulBtn"
            className="btn btn-sm"
            onClick={onSubmit}
            disabled={isDisabled}
            state={isLoading ? STATEFUL_BUTTON_STATES.pending : STATEFUL_BUTTON_STATES.default}
            {...updateValuesButtonState}
          />

        </ActionRow>
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

GradingModal.propTypes = {
  isDisabled: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default GradingModal;
