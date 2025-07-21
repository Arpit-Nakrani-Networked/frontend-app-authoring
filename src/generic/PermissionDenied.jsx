import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from '@edx/frontend-platform/i18n';
import { Alert, Button } from '@openedx/paragon';
import { NETWORKED_FRONTEND_URL } from '../helper/constants';
// import { LockFill } from '@openedx/paragon/icons';

const PermissionDenied = ({ courseId }) => {
  const handleBackToCourse = () => {
    window.location.href = `${NETWORKED_FRONTEND_URL}/courses/${courseId}`;
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 bg-white shadow rounded text-center" style={{ maxWidth: '500px', width: '100%' }}>
        <Alert variant="danger" className="mb-4 d-flex align-items-center justify-content-start">
          {/* <Icon src={LockFill} className="me-2 text-danger" /> */}
          <div>
            <FormattedMessage
              id="authoring.alert.error.permission"
              defaultMessage="You are not authorized to view this page. If you feel you should have access, please reach out to your course team admin to be given access."
            />
          </div>
        </Alert>
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
