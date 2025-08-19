import React from 'react';
import PropTypes from 'prop-types';
import { ActionRow } from '@openedx/paragon';

const SubHeader = ({
  title,
  subtitle,
  breadcrumbs,
  contentTitle,
  description,
  instruction,
  headerActions,
  titleActions,
  hideBorder,
  withSubHeaderContent,
}) => (
  <div className={`${!hideBorder && ''} mb-3 card px-4 py-2`}>
    {/* <header className="sub-header">
      <h2 className="sub-header-title m-0">
        <small className="sub-header-title-subtitle">{subtitle}</small>
        {breadcrumbs && (
          <div className="sub-header-breadcrumbs">{breadcrumbs}</div>
        )}
        {title}
        {titleActions && (
          <ActionRow className="ml-auto mt-2 justify-content-start">
            {titleActions}
          </ActionRow>
        )}
      </h2>
      {headerActions && (
        <ActionRow className="ml-auto flex-shrink-0 sub-header-actions m-0">
          {headerActions}
        </ActionRow>
      )}
    </header> */}
    {title && (
      <header className="sub-header-content m-0">
        <h2 className="sub-header-content-title _text-xl">{title}</h2>
        {
          Boolean(description || headerActions) && <div style={{ display: 'flex', alignItems: 'center',gap: '8px' }}>
            {description && <span className="small text-gray-700 py-3">{description}</span>}
            {headerActions && (
              <ActionRow className="ml-auto flex-shrink-0 sub-header-actions m-0">
                {headerActions}
              </ActionRow>
            )}
          </div>
        }
      </header>
    )}
    {/* {instruction && (
      <p className="sub-header-instructions mb-4">{instruction}</p>
    )} */}
  </div>
);

SubHeader.defaultProps = {
  instruction: '',
  description: '',
  subtitle: '',
  breadcrumbs: '',
  contentTitle: '',
  headerActions: null,
  titleActions: null,
  hideBorder: false,
  withSubHeaderContent: true,
};

SubHeader.propTypes = {
  title: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]).isRequired,
  subtitle: PropTypes.string,
  breadcrumbs: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
  ]),
  contentTitle: PropTypes.string,
  description: PropTypes.string,
  instruction: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.string,
  ]),
  headerActions: PropTypes.node,
  titleActions: PropTypes.node,
  hideBorder: PropTypes.bool,
  withSubHeaderContent: PropTypes.bool,
};
export default SubHeader;
