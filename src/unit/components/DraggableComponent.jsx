import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Col, Icon, Row } from '@openedx/paragon';
import { DragIndicator } from '@openedx/paragon/icons';

export const DraggableComponent = ({
  id, category, isDraggable, isDroppable, children,style={}
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    setActivatorNodeRef,
  } = useSortable({
    id,
    data: {
      category,
    },
    disabled: {
      draggable: !isDraggable,
      droppable: !isDroppable,
    },
    animateLayoutChanges: () => false,
  });

  const customStyle = {
    position: 'relative',
    zIndex: isDragging ? 200 : undefined,
    transform: CSS.Translate.toString(transform),
    transition,
    background: 'white',
    marginBottom: '1.5rem',
    gap: '1rem',
    flexWrap: 'no-wrap',
    ...style
  };

  return (
    <Row className="mx-0" ref={setNodeRef} style={customStyle}>
      <div className="d-flex align-items-center rounded _bg-gray-50">
        <button
          ref={setActivatorNodeRef}
          key="drag-to-reorder-icon"
          className="btn-icon btn-icon-secondary btn-icon-md"
          {...attributes}
          {...listeners}
        >
          <span className="btn-icon__icon-container">
            <Icon src={DragIndicator} />
          </span>
        </button>
      </div>
      <Col className="extend-margin px-0">
        {children}
      </Col>
    </Row>
  );
};
