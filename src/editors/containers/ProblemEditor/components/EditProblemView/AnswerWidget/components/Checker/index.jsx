import React from 'react';
import PropTypes from 'prop-types';
import { Form } from '@openedx/paragon';

const Checker = ({
  hasSingleAnswer,
  answer,
  setAnswer,
  disabled,
}) => {
  // Decide between Radio or Checkbox
  const CheckerType = hasSingleAnswer ? Form.Radio : Form.Checkbox;

  return (
    <>
      <CheckerType
        id={`checker-${answer.id}`}
        className="pt-2.5"
        value={answer.id}
        onChange={(e) => setAnswer({ correct: e.target.checked })}
        checked={answer.correct}
        isValid={answer.correct}
        disabled={disabled}
        tabIndex={-1} 
        autoFocus={false}
      />
      <Form.Label
        className="pt-2 pl-2 _text-black-400"
        htmlFor={`checker-${answer.id}`}
        tabIndex={-1}   // ensures it won’t grab focus
      >
        {answer.id}
      </Form.Label>
    </>
  );
};

Checker.defaultProps = {
  disabled: false,
};

Checker.propTypes = {
  hasSingleAnswer: PropTypes.bool.isRequired,
  answer: PropTypes.shape({
    correct: PropTypes.bool,
    id: PropTypes.number,
  }).isRequired,
  setAnswer: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default Checker;
