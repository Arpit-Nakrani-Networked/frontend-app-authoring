import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Button, Icon, OverlayTrigger, Tooltip } from '@openedx/paragon';
import {
  Add as IconAdd,
  AddCircleOutline as IconAddCircle,
  ArrowDropDown as ArrowDownIcon,
  ArrowDropUp as ArrowUpIcon,
} from '@openedx/paragon/icons';
import { AddCircleOutline } from '@openedx/paragon/icons';

import messages from './messages';

const HeaderNavigations = ({
  headerNavigationsActions,
  isReIndexShow,
  isSectionsExpanded,
  isDisabledReindexButton,
  hasSections,
  courseActions,
  errors,
}) => {
  const intl = useIntl();
  const {
    handleNewSection, handleReIndex, handleExpandAll, lmsLink,
  } = headerNavigationsActions;

  return (
    <nav className="header-navigations ml-auto">
      {hasSections && (
        <Button
          variant="outline-secondary"
          onClick={handleExpandAll}
           size='sm'
           id="expand-all-button"
           className='hide-after-360'
        >
          {isSectionsExpanded
            ? intl.formatMessage(messages.collapseAllButton)
            : intl.formatMessage(messages.expandAllButton)}
        </Button>
      )}
      {hasSections && (
        <Button
          onClick={handleExpandAll}
           size='sm'
           variant="muted"
            style={{width:'36px'}}
           id="expand-all-button-mobile"
           className='show-after-360 px-1'
        >
          {isSectionsExpanded
            ? <Icon src={IconAddCircle} />
            : <Icon src={IconAddCircle} />}
        </Button>
      )}
      {courseActions.childAddable && (
        <OverlayTrigger
          placement="bottom"
          overlay={(
            <Tooltip id={intl.formatMessage(messages.newSectionButtonTooltip)}>
              {intl.formatMessage(messages.newSectionButtonTooltip)}
            </Tooltip>
          )}
          
        >
          <Button
            iconBefore={IconAdd}
            onClick={handleNewSection}
            size='xs'
            className={hasSections ? 'hide-after-360' : ''}
            // disabled={errors?.outlineIndexApi}
          >
            {intl.formatMessage(messages.newSectionButton)}
          </Button>
        </OverlayTrigger>
      )}
      {courseActions.childAddable && (
        <OverlayTrigger
          placement="bottom"
          overlay={(
            <Tooltip id={intl.formatMessage(messages.newSectionButtonTooltip)}>
              {intl.formatMessage(messages.newSectionButtonTooltip)}
            </Tooltip>
          )}
          
        >
          <Button
            onClick={handleNewSection}
            size='xs'
            className={hasSections ? 'show-after-360 px-1' : 'hide-after-360'}
            variant="muted"
            style={{width:'36px'}}
          >
            <Icon src={IconAddCircle} />
          </Button>
        </OverlayTrigger>
      )}
      {isReIndexShow && (
        <OverlayTrigger
          placement="bottom"
          overlay={!isDisabledReindexButton ? (
            <Tooltip id={intl.formatMessage(messages.reindexButtonTooltip)}>
              {intl.formatMessage(messages.reindexButtonTooltip)}
            </Tooltip>
          ) : <React.Fragment key="reindex close" />}
        >
          <Button
            onClick={handleReIndex}
            data-testid="course-reindex"
            variant="outline-primary"
            disabled={isDisabledReindexButton}
             size='sm'
          >
            {intl.formatMessage(messages.reindexButton)}
          </Button>
        </OverlayTrigger>
      )}

      {/* <OverlayTrigger
        placement="bottom"
        overlay={(
          <Tooltip id={intl.formatMessage(messages.viewLiveButtonTooltip)}>
            {intl.formatMessage(messages.viewLiveButtonTooltip)}
          </Tooltip>
        )}
      >
        <Button
          href={lmsLink}
          target="_blank"
          variant="outline-primary"
        >
          {intl.formatMessage(messages.viewLiveButton)}
        </Button>
      </OverlayTrigger> */}
    </nav>
  );
};

HeaderNavigations.defaultProps = {
  errors: {},
};

HeaderNavigations.propTypes = {
  isReIndexShow: PropTypes.bool.isRequired,
  isSectionsExpanded: PropTypes.bool.isRequired,
  isDisabledReindexButton: PropTypes.bool.isRequired,
  headerNavigationsActions: PropTypes.shape({
    handleNewSection: PropTypes.func.isRequired,
    handleReIndex: PropTypes.func.isRequired,
    handleExpandAll: PropTypes.func.isRequired,
    lmsLink: PropTypes.string.isRequired,
  }).isRequired,
  hasSections: PropTypes.bool.isRequired,
  courseActions: PropTypes.shape({
    deletable: PropTypes.bool.isRequired,
    draggable: PropTypes.bool.isRequired,
    childAddable: PropTypes.bool.isRequired,
    duplicable: PropTypes.bool.isRequired,
  }).isRequired,
  errors: PropTypes.shape({
    outlineIndexApi: PropTypes.shape({
      data: PropTypes.string,
      type: PropTypes.string.isRequired,
    }),
    reindexApi: PropTypes.shape({
      data: PropTypes.string,
      type: PropTypes.string.isRequired,
    }),
    sectionLoadingApi: PropTypes.shape({
      data: PropTypes.string,
      type: PropTypes.string.isRequired,
    }),
    courseLaunchApi: PropTypes.shape({
      data: PropTypes.string,
      type: PropTypes.string.isRequired,
    }),
  }),
};

export default HeaderNavigations;
