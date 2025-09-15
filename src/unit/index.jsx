import { injectIntl } from '@edx/frontend-platform/i18n';
import { Button, Container, Spinner } from '@openedx/paragon';
import { Outlet, useMatch, useNavigate, useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { deleteComponentBlock, getVerticalBlock, updateVerticleBlock } from './data/api';
import { HTMLComponentCard } from './components/cards/HTMLComponentCard';
import { VideoComponentCard } from './components/cards/VideoComponentCard';
import { ProblemComponentCard } from './components/cards/ProblemComponentCard';
import { availableComponents } from './data/constant';
import { NoContent } from './components/NoContent';
import { DraggableComponent } from './components/DraggableComponent';
import { AvailableComponentCard } from './components/AvailableComponentCard';
import { UnitContextWrapper } from './data/context/UnitContext';
import { useDispatch, useSelector } from 'react-redux';
import { publishCourseItemQuery } from '../course-outline/data/thunk';
import { getProcessingNotification } from '../generic/processing-notification/data/selectors';
import ProcessingNotification from '../generic/processing-notification';
import SolidSvgComponent from '../_components/solid-svg/SolidSvgComponent';
import ViewIcon from '../assets/images/viewIcon.svg'
import messages from './messages';
import DeleteModal from '../generic/delete-modal/DeleteModal';

const Unit = ({ courseId, intl }) => {
  const { unitId } = useParams();
  const [loading, setLoading] = useState(false);
  const [components, setComponents] = useState([]);
  const [verticleBlock, setVerticleBlock] = useState(null);
  const [isDeleteBlock, setDeleteBlock] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isEditorOpen = useMatch("course/:courseId/container/:unitId/editor/:blockType/:blockId?");


  const handleDeleteComponentBlock = (componentBlockId) => {
    const currentComponent = components.find((component) => component.id === componentBlockId);
    setDeleteBlock(currentComponent)
  };
  const handleDeleteBlock = () => {
    setComponents((components) => components.filter((component) => component.id !== isDeleteBlock?.id));
    deleteComponentBlock(isDeleteBlock?.id);
  };

  const selectComponent = (component) => {
    switch (component.category) {
      case 'html':
        return <HTMLComponentCard component={component} onDelete={handleDeleteComponentBlock} />;
      case 'video':
        return <VideoComponentCard component={component} onDelete={handleDeleteComponentBlock} />;
      case 'problem':
        return <ProblemComponentCard component={component} onDelete={handleDeleteComponentBlock} />;
      default:
        return null;
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const {
    isShow: isShowProcessingNotification,
    title: processingNotificationTitle,
  } = useSelector(getProcessingNotification);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!active || !over) {
      return;
    }

    const { id } = active;
    const { id: overId } = over;

    const activeIndex = components.findIndex((component) => component.id === id);
    const overIndex = components.findIndex((component) => component.id === overId);

    const currentComponents = [...components];
    const [movedItem] = currentComponents.splice(activeIndex, 1);
    currentComponents.splice(overIndex, 0, movedItem);

    setComponents(currentComponents);

    const newOrder = currentComponents.map((component) => component.id);
    // api call for update children order
    updateVerticleBlock(unitId, {
      children: newOrder,
    });
  };

  const onSuccessComponentBlockCreate = ({ componentBlockCategory, componentBlockId }) => {
    const baseComponent = {
      id: componentBlockId,
      category: componentBlockCategory,
      isNew: true,
    };

    const defaultsByCategory = {
      video: { metadata: {} },
      html: { data: '' },
      problem: { data: '' },
    };

    const newComponent = {
      ...baseComponent,
      ...(defaultsByCategory[componentBlockCategory] || {}),
      isNew: false,
    };

    setComponents(prev => [...prev, newComponent]);
    getComponents(true)
    navigate(`/course/${courseId}/container/${unitId}/editor/${componentBlockCategory}/${componentBlockId}`);
  };

  const handleComponentUpdate = (updatedComponent) => {
    setComponents((components) => components.map((component) => {
      if (component.id === updatedComponent.id) {
        getComponents(true)
        return {
          ...component,
          ...updatedComponent,
        };
      }

      return component;
    }));
  };

  const getComponents = async (silent = false) => {
    if (unitId) {
      if (!silent) setLoading(true);
      getVerticalBlock(unitId).then(((response) => {
        setComponents(response.components);
        setVerticleBlock(response.verticalBlock);
      })).finally(() => { setLoading(false); });
    }
  };
  useEffect(() => {
    getComponents();
  }, []);

  const publishLessonContent = async () => {
    await dispatch(publishCourseItemQuery(unitId, null, false, []))
    getComponents(true)
  }
  console.log("verticleBlock", verticleBlock);

  return (
    <Container size="xl" className="px-4 rounded p-4">
      <div className="bg-white _rounded-lg border border-light unit-xblocks-add-container">
        {!loading && <div className="bg-white d-flex justify-content-between align-items-center sub-header-container border-bottom border-bottom border-light">
          <h2 className="sub-header-title">{verticleBlock?.displayName}</h2>
          {verticleBlock && <div className='actions-btns'>
            <Button
              // iconBefore={Search}
              // data-testid="course-reindex"
              variant="outline-secondary"
              href={verticleBlock?.lmsUrl}
              target="_blank"
              size='sm'
              className='mr-3'

            >
              <SolidSvgComponent url={ViewIcon} width={16} height={16} defaultClass={`mr-1`} isIconColor /> {intl.formatMessage(messages.viewBtnText)}
            </Button>
            <Button
              type="button"
              onClick={publishLessonContent}
              data-testid="course-reindex"
              variant="outline-primary"
              disabled={!verticleBlock?.hasChanges || isShowProcessingNotification || loading}
              size='sm'
              loading={loading}
            >
              {intl.formatMessage(messages.saveBtnText)}
            </Button>
          </div>}
        </div>}
        <div className="bg-white p-4" style={{ minHeight: '200px' }}>
          {loading && <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '150px' }}> <Spinner animation="border" className="mie-3" screenReaderText="loading" /> </div>}
          {!loading && components.length === 0 && <NoContent />}
          {!loading && components.length !== 0 && (
            <DndContext
              modifiers={[restrictToVerticalAxis]}
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragOver={() => console.log('drag over')}
              onDragStart={(event) => console.log(event, 'drag start')}
              onDragEnd={handleDragEnd}
            >
              <SortableContext id="root" strategy={verticalListSortingStrategy} items={components}>
                {
                  components.map((component, i) => <DraggableComponent id={component.id} category={component.category} children={selectComponent(component)} isDraggable isDroppable style={i === 0 ? {} : { borderTop: "1px solid #0000001F",paddingTop: '1.5rem', }} />)
                }
              </SortableContext>
            </DndContext>
          )}
        </div>
        <div className="_bg-gray-50 p-4 d-flex flex-column align-items-center justify-content-between _rounded-b-lg unit-xblock-add-component">
          <h2 className="sub-header-title">Add Content</h2>
          <span className="text-gray-500 _font-weight-light mt-2">Please select the one of the below type</span>
          <div className="d-flex justify-content-between w-100 mt-4" style={{ gap: '1rem' }}>
            {
              availableComponents.map((component, index) => <AvailableComponentCard key={index} {...component} onSuccess={onSuccessComponentBlockCreate} />)
            }
          </div>
        </div>
      </div>
      <ProcessingNotification
        isShow={isShowProcessingNotification}
        title={processingNotificationTitle}
      />
      <DeleteModal
        category={intl.formatMessage(messages.deleteCategory, { category: "Block" })}
        isOpen={Boolean(isDeleteBlock?.id)}
        close={() => setDeleteBlock(null)}
        onDeleteSubmit={() => {
          handleDeleteBlock();
          setDeleteBlock(null);
        }}
        description={intl.formatMessage(messages.deleteDescription)}
        btnDefaultLabel={intl.formatMessage(messages.deleteSave)}
      />
      <UnitContextWrapper updateComponent={handleComponentUpdate} componentBlocks={components} handleDeleteComponentBlock={handleDeleteComponentBlock}>
        <Outlet />
      </UnitContextWrapper>
    </Container>
  );
};

export default injectIntl(Unit);
