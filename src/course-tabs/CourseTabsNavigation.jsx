import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

import messages from './messages';
import Tabs from '../generic/tabs/Tabs';
import { Link } from 'react-router-dom';
import './course-tabs-navigation.scss'

const CourseTabsNavigation = ({
 activeTabSlug,className, tabs, intl,
}) => {
  console.log("activeTabSlug",activeTabSlug,tabs);
  
  return (
    <div id="courseTabsNavigation" className={classNames('course-tabs-navigation', className)}>
      <div className="container-fluid">
        <div className="nav-bar">
          <div className="nav-menu">
            <Tabs
              className=""
              aria-label={intl.formatMessage(messages.courseMaterial)}
            >
              {tabs.map(({ title, slug }) => (
                <Link
                  key={slug}
                  className={classNames('nav-item flex-shrink-0 nav-link', { active: slug === activeTabSlug })}
                  to={slug}
                >
                  {title}
                </Link>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

CourseTabsNavigation.propTypes = {
  activeTabSlug: PropTypes.string,
  className: PropTypes.string,
  tabs: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
  })).isRequired,
  intl: intlShape.isRequired,
};

CourseTabsNavigation.defaultProps = {
  activeTabSlug: undefined,
  className: null,
};

export default injectIntl(CourseTabsNavigation);
