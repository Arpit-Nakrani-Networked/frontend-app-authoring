import { injectIntl } from '@edx/frontend-platform/i18n';
import { Container, Spinner } from '@openedx/paragon';
import { Outlet, useNavigate, useParams } from 'react-router';
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
import { useDispatch } from 'react-redux';
import { fetchCourseOutlineIndexQuery } from '../course-outline/data/thunk';

const Unit = ({ courseId }) => {
  const { unitId } = useParams();
  const [loading, setLoading] = useState(false);
  const [components, setComponents] = useState([]);
  const [verticleBlock, setVerticleBlock] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDeleteComponentBlock = (componentBlockId) => {
    setComponents((components) => components.filter((component) => component.id !== componentBlockId));
    deleteComponentBlock(componentBlockId);
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
    };

    const defaultsByCategory = {
      video: { metadata: {} },
      html: { data: '' },
      problem: { data: '' },
    };

    const newComponent = {
      ...baseComponent,
      ...(defaultsByCategory[componentBlockCategory] || {}),
    };

    setComponents(prev => [...prev, newComponent]);
    setHasChangesSection()
    navigate(`/course/${courseId}/container/${unitId}/editor/${componentBlockCategory}/${componentBlockId}`);
  };

  const setHasChangesSection = () => {
    dispatch(fetchCourseOutlineIndexQuery(courseId,true));
  }

  const handleComponentUpdate = (updatedComponent) => {
    setComponents((components) => components.map((component) => {
      if (component.id === updatedComponent.id) {
        setHasChangesSection()
        return {
          ...component,
          ...updatedComponent,
        };
      }

      return component;
    }));
  };

  useEffect(() => {
    const getComponents = async () => {
      if (unitId) {
        setLoading(true);
        getVerticalBlock(unitId).then(((response) => {
          setComponents(response.components);
          setVerticleBlock(response.verticalBlock);
        })).finally(() => { setLoading(false); });
      }
    };
    getComponents();
  }, []);

  return (
    <Container size="xl" className="px-4 rounded p-4">
      <div className="bg-white _rounded-lg border border-light">
        <div className="d-flex justify-content-between align-items-center">
          <h2 className="sub-header-title p-4">{verticleBlock?.displayName}</h2>
        </div>
        <div className="bg-white p-4 border-top border-bottom border-light" style={{ minHeight: '200px' }}>
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
                  components.map((component) => <DraggableComponent id={component.id} category={component.category} children={selectComponent(component)} isDraggable isDroppable />)
                }
              </SortableContext>
            </DndContext>
          )}
        </div>
        <div className="_bg-gray-50 p-4 d-flex flex-column align-items-center justify-content-between _rounded-b-lg">
          <h2 className="sub-header-title">Add Content</h2>
          <span className="text-gray-500 _font-weight-light">Please select the one of the below type</span>
          <div className="d-flex justify-content-between w-100 mt-4" style={{ gap: '1rem' }}>
            {
              availableComponents.map((component, index) => <AvailableComponentCard key={index} {...component} onSuccess={onSuccessComponentBlockCreate} />)
            }
          </div>
        </div>
      </div>
      <UnitContextWrapper updateComponent={handleComponentUpdate} componentBlocks={components} handleDeleteComponentBlock={handleDeleteComponentBlock}>
        <Outlet />
      </UnitContextWrapper>
    </Container>
  );
};

export default injectIntl(Unit);
