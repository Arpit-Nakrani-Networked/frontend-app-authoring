// @ts-check
import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { useToggle } from '@openedx/paragon';
import { isEmpty } from 'lodash';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getConfig } from '@edx/frontend-platform';
import { PageWrap } from '@edx/frontend-platform/react';
import { setCurrentItem, setCurrentSection, setCurrentSubsection, updateSectionList } from '../data/slice';
import { RequestStatus } from '../../data/constants';
import CardHeader from '../card-header/CardHeader';
import SortableItem from '../../generic/drag-helper/SortableItem';
import TitleLink from '../card-header/TitleLink';
import XBlockStatus from '../xblock-status/XBlockStatus';
import { getItemStatus, getItemStatusBorder, scrollToElement } from '../utils';
import { useClipboard } from '../../generic/clipboard';
import EditorPage from '../../editors/EditorPage';

const UnitCard = ({
  unit,
  subsection,
  section,
  isSelfPaced,
  isCustomRelativeDatesActive,
  index,
  getPossibleMoves,
  onOpenPublishModal,
  onOpenConfigureModal,
  onEditSubmit,
  savingStatus,
  onOpenDeleteModal,
  onDuplicateSubmit,
  getTitleLink,
  onOrderChange,
  discussionsSettings,
  handleCreateNewCourseXBlock,
}) => {
  const currentRef = useRef(null);
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const locatorId = searchParams.get('show');
  const isScrolledToElement = locatorId === unit.id;
  const [isFormOpen, openForm, closeForm] = useToggle(false);
  const [isOpenText, openText, closeText] = useToggle(false);
  const [blockId, setBlockId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const namePrefix = 'unit';

  const { copyToClipboard } = useClipboard();

  const {
    id,
    category,
    displayName,
    hasChanges,
    published,
    visibilityState,
    actions: unitActions,
    isHeaderVisible = true,
    enableCopyPasteUnits = false,
    discussionEnabled,
  } = unit;

  // re-create actions object for customizations
  const actions = { ...unitActions };
  // add actions to control display of move up & down menu buton.
  const moveUpDetails = getPossibleMoves(index, -1);
  const moveDownDetails = getPossibleMoves(index, 1);
  actions.allowMoveUp = !isEmpty(moveUpDetails);
  actions.allowMoveDown = !isEmpty(moveDownDetails);

  const parentInfo = {
    graded: subsection.graded,
    isTimeLimited: subsection.isTimeLimited,
  };

  const unitStatus = getItemStatus({
    published,
    visibilityState,
    hasChanges,
  });
  const borderStyle = getItemStatusBorder(unitStatus);

  const handleViewEdit = () => {
    if(!Boolean(isFormOpen || unit?.edit)){
      const url = getTitleLink(id)
      navigate(url)
    }
  }

  const handleClickMenuButton = () => {
    dispatch(setCurrentItem(subsection));
    dispatch(setCurrentSection(section));
    dispatch(setCurrentSubsection(subsection));
  };

  const handleEditSubmit = (titleValue) => {
    if (displayName !== titleValue) {
      onEditSubmit(id, section.id, titleValue);
      return;
    }

    closeForm();
  };

  const handleUnitMoveUp = () => {
    onOrderChange(section, moveUpDetails);
  };

  const handleUnitMoveDown = () => {
    onOrderChange(section, moveDownDetails);
  };

  const onCreateNewCourseXBlock = async () => {
    await handleCreateNewCourseXBlock({
      category: 'html',
      parentLocator: id,
    }, id, ({ locator, courseKey }) => {
      console.log('locator=xblockId====>>>>>>', locator);
      setCourseId(courseKey);
      setBlockId(locator);
      openText();
    });
  };

  const handleCopyClick = () => {
    copyToClipboard(id);
  };

  const closeTitleForm = () => {
    if (unit?.edit) {
      const newSection = structuredClone(section)
      
      const subSectionIndex = newSection.childInfo.children.findIndex((subsec) => subsec.id === subsection.id);
      
      const newsubsection = newSection.childInfo.children[subSectionIndex];
      const unitIndex = newsubsection.childInfo.children.findIndex((u) => u.id === id);
      newSection.childInfo.children[subSectionIndex].childInfo.children[unitIndex]['edit'] = false;
      dispatch(updateSectionList({
        [section?.id]: {
          ...newSection,
        }
      }));
    }
    closeForm();
  }

  const titleComponent = (
    <TitleLink
      title={displayName}
      titleLink={getTitleLink(id)}
      namePrefix={namePrefix}
    />
  );

  useEffect(() => {
    // If the locatorId is set/changed, we need to make sure that the section is expanded
    // if it contains the result, in order to scroll to it
    if (unit?.edit) {
      openForm();
    }
  }, [unit]);


  console.log("Unit---isFormOpen---->>>", isFormOpen, displayName);


  useEffect(() => {
    // if this items has been newly added, scroll to it.
    // we need to check section.shouldScroll as whole section is fetched when a
    // unit is duplicated under it.
    if (currentRef.current && (section.shouldScroll || unit.shouldScroll || isScrolledToElement)) {
      // Align element closer to the top of the screen if scrolling for search result
      const alignWithTop = !!isScrolledToElement;
      scrollToElement(currentRef.current, alignWithTop);
    }
  }, [isScrolledToElement]);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      closeForm();
    }
  }, [savingStatus]);

  if (!isHeaderVisible) {
    return null;
  }

  const isDraggable = false && actions.draggable && (actions.allowMoveUp || actions.allowMoveDown);

  return (
    <>
      <SortableItem
        id={id}
        category={category}
        key={id}
        isDraggable={isDraggable}
        isDroppable={actions.childAddable}
        componentStyle={{
          // background: '#f8f7f6',
          // display: 'flex',
          // flexDirection: 'row-reverse',
          backgroundColor: 'transparent',
          boxShadow: 'none',
          borderRadius: '0 0 16px 16px',
          // 'border-bottom-right-radius': '16px !important',
          // 'border-bottom-left-radius': '16px !important',
          marginBottom: '0',
          // : {
          //   backgroundColor: '#f0f0f0',
          // },
          // ...borderStyle,
        }}
      >
        <div
          className={`unit-card ${isScrolledToElement ? 'highlight' : ''}`}
          data-testid="unit-card"
          ref={currentRef}
          onClick={handleViewEdit}
        >
          <CardHeader
            title={displayName}
            status={unitStatus}
            hasChanges={hasChanges}
            cardId={id}
            onClickMenuButton={handleClickMenuButton}
            onClickPublish={onOpenPublishModal}
            onClickConfigure={onOpenConfigureModal}
            onClickEdit={openForm}
            onClickDelete={onOpenDeleteModal}
            onClickMoveUp={handleUnitMoveUp}
            onClickMoveDown={handleUnitMoveDown}
            isFormOpen={isFormOpen || unit?.edit}
            closeForm={closeTitleForm}
            onEditSubmit={handleEditSubmit}
            isDisabledEditField={savingStatus === RequestStatus.IN_PROGRESS}
            onClickDuplicate={onDuplicateSubmit}
            titleComponent={titleComponent}
            namePrefix={namePrefix}
            actions={actions}
            isVertical
            enableCopyPasteUnits={enableCopyPasteUnits}
            onClickCopy={handleCopyClick}
            discussionEnabled={discussionEnabled}
            discussionsSettings={discussionsSettings}
            parentInfo={parentInfo}
            showEditButton={true}
          />
          {/* <div className="unit-card__content item-children" data-testid="unit-card__content">
            <XBlockStatus
              isSelfPaced={isSelfPaced}
              isCustomRelativeDatesActive={isCustomRelativeDatesActive}
              blockData={unit}
            />
          </div> */}
        </div>
      </SortableItem>
      {/* This is for create block here. */}
      {/* <h1>Hello This is {displayName} + {category}</h1>
      <button onClick={onCreateNewCourseXBlock}>Textblock</button> */}
      {isOpenText && blockId && courseId && (
        <div
          className="pgn__modal-fullscreen h-100"
          role="dialog"
          aria-label="html"
        >
          <PageWrap>
            <EditorPage
              courseId={courseId}
              blockType="html"
              blockId={blockId}
              studioEndpointUrl={getConfig().STUDIO_BASE_URL}
              lmsEndpointUrl={getConfig().LMS_BASE_URL}
              onClose={() => {
                closeText();
                setBlockId(null);
              }}
            />
          </PageWrap>
        </div>
      )}
    </>
  );
};

UnitCard.defaultProps = {
  discussionsSettings: {},
};

UnitCard.propTypes = {
  unit: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    visibilityState: PropTypes.string.isRequired,
    shouldScroll: PropTypes.bool,
    actions: PropTypes.shape({
      deletable: PropTypes.bool.isRequired,
      draggable: PropTypes.bool.isRequired,
      childAddable: PropTypes.bool.isRequired,
      duplicable: PropTypes.bool.isRequired,
    }).isRequired,
    isHeaderVisible: PropTypes.bool,
    enableCopyPasteUnits: PropTypes.bool,
    discussionEnabled: PropTypes.bool,
  }).isRequired,
  subsection: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    visibilityState: PropTypes.string.isRequired,
    shouldScroll: PropTypes.bool,
    isTimeLimited: PropTypes.bool,
    graded: PropTypes.bool,
  }).isRequired,
  section: PropTypes.shape({
    id: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    published: PropTypes.bool.isRequired,
    hasChanges: PropTypes.bool.isRequired,
    visibilityState: PropTypes.string.isRequired,
    shouldScroll: PropTypes.bool,
  }).isRequired,
  onOpenPublishModal: PropTypes.func.isRequired,
  onOpenConfigureModal: PropTypes.func.isRequired,
  onEditSubmit: PropTypes.func.isRequired,
  savingStatus: PropTypes.string.isRequired,
  onOpenDeleteModal: PropTypes.func.isRequired,
  onDuplicateSubmit: PropTypes.func.isRequired,
  getTitleLink: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  getPossibleMoves: PropTypes.func.isRequired,
  onOrderChange: PropTypes.func.isRequired,
  isSelfPaced: PropTypes.bool.isRequired,
  isCustomRelativeDatesActive: PropTypes.bool.isRequired,
  discussionsSettings: PropTypes.shape({
    providerType: PropTypes.string,
    enableGradedUnits: PropTypes.bool,
  }),
};

export default UnitCard;
