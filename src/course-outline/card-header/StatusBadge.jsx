import React from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@openedx/paragon';

const StatusBadge = ({
  text,
  icon,
  iconSize="sm",
  iconClassName,
  className= ''
}) => {
  if (text) {
    return (
      <div
        className={`px-2 py-1 mr-2 rounded bg-white align-self-center align-items-center d-flex border border-light-300 ${className}`}
        role="status"
      >
        {icon && (
          <Icon
            src={icon}
            size={iconSize}
            className={iconClassName}
          />
        )}
        <span className="small ml-1 text-nowrap">{text}</span>
      </div>
    );
  }
  return null;
};

StatusBadge.defaultProps = {
  text: '',
  icon: '',
  iconSize: 'sm',
  iconClassName: '',
  className: '',
};

StatusBadge.propTypes = {
  text: PropTypes.string,
  icon: PropTypes.func,
  iconSize: PropTypes.string,
  iconClassName: PropTypes.string,
  className: PropTypes.string,
};

export default StatusBadge;
