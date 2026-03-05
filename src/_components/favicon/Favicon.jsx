import React from 'react';
import { Helmet } from 'react-helmet';
import { getConfig } from '@edx/frontend-platform';
import PropTypes from 'prop-types';

const Favicon = ({ communityImage }) => (
  <Helmet>
    <link rel="shortcut icon" href={communityImage || getConfig().LMS_BASE_URL+"/favicon.ico"} type="image/x-icon" />
  </Helmet>
);

Favicon.propTypes = {
  communityImage: PropTypes.string,
};

export default Favicon;
