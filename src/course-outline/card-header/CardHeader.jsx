// @ts-check
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { getConfig } from '@edx/frontend-platform';
import { useIntl } from '@edx/frontend-platform/i18n';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  Dropdown,
  Form,
  Hyperlink,
  Icon,
  IconButton,
  Stack,
  useToggle,
} from '@openedx/paragon';
import {
  Add as IconAdd,
  MoreVert as MoveVertIcon,
  EditOutline as EditIcon,
  // DeleteOutline as DeleteIcon,
  // CloudUpload as PublishIcon,
  Check
} from '@openedx/paragon/icons';
import { Close as CloseSmall } from '@openedx/paragon/icons';
import { useContentTagsCount } from '../../generic/data/apiHooks';
import { ContentTagsDrawerSheet } from '../../content-tags-drawer';
import TagCount from '../../generic/tag-count';
import { useEscapeClick } from '../../hooks';
import { ITEM_BADGE_STATUS } from '../constants';
import { scrollToElement } from '../utils';
import CardStatus from './CardStatus';
import messages from './messages';
import unitMessage from '../subsection-card/messages';
import DeleteIcon from '../../assets/images/deleteIcon.svg'
import PublishIcon from '../../assets/images/publishIcon.svg'
import SettingIcon from '../../assets/images/settingIcon.svg'
// import SolidSvgComponent from '../../_components/solid-svg/SolidSvgComponent';

const CardHeader = ({
  title,
  status,
  cardId,
  hasChanges,
  onClickPublish,
  onClickConfigure,
  onClickMenuButton,
  onClickEdit,
  isFormOpen,
  onEditSubmit,
  closeForm,
  isDisabledEditField,
  onClickDelete,
  onClickDuplicate,
  onClickMoveUp,
  onClickMoveDown,
  onClickCopy,
  titleComponent,
  namePrefix,
  actions,
  enableCopyPasteUnits,
  isChapter = false,
  isVertical = false,
  isSequential = false,
  proctoringExamConfigurationLink,
  discussionEnabled,
  discussionsSettings,
  handleNewButtonClick = () => { },
  showNewButton = false,
  showEditButton = false,
  showConfigure = true,
  parentInfo,
}) => {
  const intl = useIntl();
  const [searchParams] = useSearchParams();
  const [titleValue, setTitleValue] = useState(title);
  const cardHeaderRef = useRef(null);
  const [isManageTagsDrawerOpen, openManageTagsDrawer, closeManageTagsDrawer] = useToggle(false);

  // Use studio url as base if proctoringExamConfigurationLink is a relative link
  const fullProctoringExamConfigurationLink = () => (
    proctoringExamConfigurationLink && new URL(proctoringExamConfigurationLink, getConfig().STUDIO_BASE_URL).href
  );

  const isDisabledPublish = (status === ITEM_BADGE_STATUS.live
    || status === ITEM_BADGE_STATUS.publishedNotLive) && !hasChanges;

  const { data: contentTagCount } = useContentTagsCount(cardId);

  useEffect(() => {
    const locatorId = searchParams.get('show');
    if (!locatorId) {
      return;
    }

    if (cardHeaderRef.current && locatorId === cardId) {
      scrollToElement(cardHeaderRef.current);
    }
  }, []);

  const showDiscussionsEnabledBadge = (
    isVertical
    && !parentInfo?.isTimeLimited
    && discussionEnabled
    && discussionsSettings?.providerType === 'openedx'
    && (
      discussionsSettings?.enableGradedUnits
      || (!discussionsSettings?.enableGradedUnits && !parentInfo.graded)
    )
  );

  useEscapeClick({
    onEscape: () => {
      setTitleValue(title);
      closeForm();
    },
    dependency: title,
  });

  return (
    <>
      <div
        className="item-card-header"
        data-testid={`${namePrefix}-card-header`}
        ref={cardHeaderRef}
      >
        {isFormOpen ? (
          <Form.Group className="m-0 w-75 position-relative flex-1">
            <Form.Control
              data-testid={`${namePrefix}-edit-field`}
              ref={(e) => e && e.focus()}
              value={titleValue}
              name="displayName"
              onChange={(e) => setTitleValue(e.target.value)}
              aria-label="edit field"
              // onBlur={() => onEditSubmit(titleValue)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onEditSubmit(titleValue);
                }
              }}
              disabled={isDisabledEditField}
            />
            <Stack gap={2} direction="horizontal" className="btn-icon__icon-container d-flex" style={{
              position: "absolute",
              right: '15px',
              top: "50%",
              transform: "translateY(-50%)"
            }}>
              <span className='pgn__icon btn-icon__icon rounded _cursor-pointer d-flex justify-content-center align-items-center' onClick={(e) => {
                e?.stopPropagation()
                setTitleValue(title)
                closeForm();
              }}><Icon src={CloseSmall} size='sm' /></span>
              <span className='pgn__icon btn-icon__icon _bg-gray-50 rounded _cursor-pointer d-flex justify-content-center align-items-center' onClick={(e) => {
                e?.stopPropagation()
                onEditSubmit(titleValue)
                if(title === titleValue){
                  closeForm();
                }
              }}><Icon src={Check} size='sm' /></span>
            </Stack>
          </Form.Group>
        ) : (
          <>
            {titleComponent}
            <IconButton
              className="item-card-edit-icon mr-2"
              data-testid={`${namePrefix}-edit-button`}
              alt={intl.formatMessage(messages.altButtonEdit)}
              iconAs={EditIcon}
              onClick={(e) => {
                e?.stopPropagation()
                onClickEdit()
              }}
            />
          </>
        )}
        <div className="ml-auto d-flex align-items-center">
          {showNewButton && (
            <Button
              data-testid="new-unit-button"
              className="mr-3 bg-white btn-sm"
              variant="outline-third"
              iconBefore={IconAdd}
              size='sm'
              block
              onClick={(e) => {
                e?.stopPropagation()
                handleNewButtonClick && handleNewButtonClick()
              }}
            >
              {intl.formatMessage(unitMessage.newUnitButton)}
            </Button>
          )}
          {(isVertical || isSequential) && (
            <CardStatus status={status} showDiscussionsEnabledBadge={showDiscussionsEnabledBadge} />
          )}
          {getConfig().ENABLE_TAGGING_TAXONOMY_PAGES === 'true' && !!contentTagCount && (
            <TagCount count={contentTagCount} onClick={openManageTagsDrawer} />
          )}
          {showEditButton && (
            <Button
              data-testid="edit-unit-button"
              className="mr-3 _bg-white btn-sm"
              variant="outline-third"
              iconBefore={EditIcon}
              block
              size='sm'
            //  onClick={(e)=>{
            //   e?.stopPropagation()
            //   // handleNewButtonClick && handleNewButtonClick()
            // }}
            >
              {intl.formatMessage(unitMessage.editUnitButton)}
            </Button>
          )}
          <Dropdown data-testid={`${namePrefix}-card-header__menu`} onClick={(e) => {
            e?.stopPropagation()
            onClickMenuButton()
          }}>
            <Dropdown.Toggle
              className="item-card-header__menu"
              id={`${namePrefix}-card-header__menu`}
              data-testid={`${namePrefix}-card-header__menu-button`}
              as={IconButton}
              src={MoveVertIcon}
              alt={`${namePrefix}-card-header__menu`}
              iconAs={Icon}
            />
            <Dropdown.Menu className="card p-3" style={{ width: '217px', maxWidth: "217px", minWidth: "217px" }}>
              {isVertical && proctoringExamConfigurationLink && (
                <Dropdown.Item
                  as={Hyperlink}
                  target="_blank"
                  destination={fullProctoringExamConfigurationLink()}
                  href={fullProctoringExamConfigurationLink()}
                  externalLinkTitle={intl.formatMessage(messages.proctoringLinkTooltip)}
                >
                  {intl.formatMessage(messages.menuProctoringLinkText)}
                </Dropdown.Item>
              )}
              <Dropdown.Item
                data-testid={`${namePrefix}-card-header__menu-publish-button`}
                disabled={isDisabledPublish}
                onClick={onClickPublish}
              >
                {/* <SolidSvgComponent url={PublishIcon} width={20} height={20} iconColor='#000' defaultClass={`mr-2`} /> */}
                <img src={PublishIcon} alt="icon" className={`mr-2`}  />
                {intl.formatMessage(messages.menuPublish, { type: isVertical ? "Lesson" : 'Section' })}
              </Dropdown.Item>
              {showConfigure && <Dropdown.Item
                data-testid={`${namePrefix}-card-header__menu-configure-button`}
                onClick={onClickConfigure}
                iconBefore={IconAdd}
              >
                <img src={SettingIcon} alt="icon" className={`mr-2`}  />
                {/* <SolidSvgComponent url={SettingIcon} width={20} height={20} iconColor='#000' defaultClass={`mr-2`} />  */}
                {intl.formatMessage(messages.menuConfigure)}
              </Dropdown.Item>}
              {/* {getConfig().ENABLE_TAGGING_TAXONOMY_PAGES === 'true' && (
                <Dropdown.Item
                  data-testid={`${namePrefix}-card-header__menu-manage-tags-button`}
                  onClick={openManageTagsDrawer}
                >
                  {intl.formatMessage(messages.menuManageTags)}
                </Dropdown.Item>
              )} */}

              {/* {isVertical && enableCopyPasteUnits && (
                <Dropdown.Item onClick={onClickCopy}>
                  {intl.formatMessage(messages.menuCopy)}
                </Dropdown.Item>
              )} */}
              {/* {actions.duplicable && (
                <Dropdown.Item
                  data-testid={`${namePrefix}-card-header__menu-duplicate-button`}
                  onClick={onClickDuplicate}
                >
                  {intl.formatMessage(messages.menuDuplicate)}
                </Dropdown.Item>
              )} */}
              {/* {actions.draggable && (
                <>
                  <Dropdown.Item
                    data-testid={`${namePrefix}-card-header__menu-move-up-button`}
                    onClick={onClickMoveUp}
                    disabled={!actions.allowMoveUp}
                  >
                    {intl.formatMessage(messages.menuMoveUp)}
                  </Dropdown.Item>
                  <Dropdown.Item
                    data-testid={`${namePrefix}-card-header__menu-move-down-button`}
                    onClick={onClickMoveDown}
                    disabled={!actions.allowMoveDown}
                  >
                    {intl.formatMessage(messages.menuMoveDown)}
                  </Dropdown.Item>
                </>
              )} */}
              {
                isChapter && <hr />
              }
              {actions.deletable && (
                <Dropdown.Item
                  className="_text-delete align-items-center"
                  data-testid={`${namePrefix}-card-header__menu-delete-button`}
                  onClick={onClickDelete}
                  iconBefore={IconAdd}
                >
                  <img src={DeleteIcon} alt="icon" className={`mr-2`}  />
                  {/* <SolidSvgComponent url={DeleteIcon} width={20} height={20} iconColor='#E13737' defaultClass={`mr-2`} />  */}
                  {intl.formatMessage(messages.menuDelete, { type: isVertical ? "Lesson" : 'Section' })}
                </Dropdown.Item>
              )}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <ContentTagsDrawerSheet
        id={cardId}
        onClose={() => closeManageTagsDrawer()}
        showSheet={isManageTagsDrawerOpen}
      />
    </>
  );
};

CardHeader.defaultProps = {
  enableCopyPasteUnits: false,
  isVertical: false,
  isSequential: false,
  onClickCopy: null,
  proctoringExamConfigurationLink: null,
  discussionEnabled: false,
  discussionsSettings: {},
  parentInfo: {},
  cardId: '',
};

CardHeader.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  cardId: PropTypes.string,
  hasChanges: PropTypes.bool.isRequired,
  onClickPublish: PropTypes.func.isRequired,
  onClickConfigure: PropTypes.func.isRequired,
  onClickMenuButton: PropTypes.func.isRequired,
  onClickEdit: PropTypes.func.isRequired,
  isFormOpen: PropTypes.bool.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  closeForm: PropTypes.func.isRequired,
  isDisabledEditField: PropTypes.bool.isRequired,
  onClickDelete: PropTypes.func.isRequired,
  onClickDuplicate: PropTypes.func.isRequired,
  onClickMoveUp: PropTypes.func.isRequired,
  onClickMoveDown: PropTypes.func.isRequired,
  onClickCopy: PropTypes.func,
  titleComponent: PropTypes.node.isRequired,
  namePrefix: PropTypes.string.isRequired,
  proctoringExamConfigurationLink: PropTypes.string,
  actions: PropTypes.shape({
    deletable: PropTypes.bool.isRequired,
    draggable: PropTypes.bool.isRequired,
    childAddable: PropTypes.bool.isRequired,
    duplicable: PropTypes.bool.isRequired,
    allowMoveUp: PropTypes.bool,
    allowMoveDown: PropTypes.bool,
  }).isRequired,
  enableCopyPasteUnits: PropTypes.bool,
  isChapter: PropTypes.bool,
  isVertical: PropTypes.bool,
  isSequential: PropTypes.bool,
  discussionEnabled: PropTypes.bool,
  discussionsSettings: PropTypes.shape({
    providerType: PropTypes.string,
    enableGradedUnits: PropTypes.bool,
  }),
  parentInfo: PropTypes.shape({
    isTimeLimited: PropTypes.bool,
    graded: PropTypes.bool,
  }),
};

export default CardHeader;
