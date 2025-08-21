import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Alert, Button, Icon } from '@openedx/paragon';
import { NETWORKED_FRONTEND_URL } from '../helper/constants';
// import { LockFill } from '@openedx/paragon/icons';
import { Blocked } from '@openedx/paragon/icons';

const PermissionDenied = ({ courseId }) => {
  const handleBackToCourse = () => {
    window.location.href = `${NETWORKED_FRONTEND_URL}/courses/${courseId}`;
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: 'whitesmoke' }}>
      <div className="p-4 card" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="mb-4">
          <div className='d-flex align-items-center w-100 mb-3'><Icon src={Blocked} size='lg' className="text-danger" /> <span className='_text-xl ml-2 _font-weight-semibold'>You don't have access.</span></div>
          <div className='_text-lg _intialism'>
            <FormattedMessage
              id="authoring.alert.error.permission"
              defaultMessage="You are not authorized to view this page. If you feel you should have access, please reach out to your course team admin to be given access."
            />
          </div>
        </div>
        <Button variant="primary" onClick={handleBackToCourse}>
          <FormattedMessage
            id="authoring.button.back.to.course"
            defaultMessage="Back to Course"
          />
        </Button>
      </div>
    </div>
  );
};

PermissionDenied.propTypes = {
  courseId: PropTypes.string.isRequired,
};

export default PermissionDenied;
