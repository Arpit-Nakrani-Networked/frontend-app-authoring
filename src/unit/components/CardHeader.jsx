import {
  Button, Dropdown, Icon, IconButton, Stack,
} from '@openedx/paragon';
import { MoreHoriz } from '@openedx/paragon/icons';
import { useNavigate } from 'react-router';

export const CardHeader = ({ component, onDelete }) => {
  const navigate = useNavigate();

  const getCardTitle = () => {
    switch (component.category) {
      case 'html':
        return 'TEXT'
      case 'video':
        return 'VIDEO'
      case 'problem':
        return 'QUESTION'
      default:
        return ''
    }
  }

  const handleEdit = () => {
    navigate(`editor/${component.category}/${component.id}`)
  };

  return (
    <Stack direction="horizontal" className="justify-content-between">
      <span className="text-secondory">{getCardTitle()}</span>
      <Stack direction="horizontal" className="justify-content-between" gap={3}>
        <Button variant="outline-third" className="text-primary" onClick={handleEdit}>Edit</Button>
        <Dropdown>
          <Dropdown.Toggle
            id="text-component-card-header__menu"
            data-testid="text-component-card-header__menu-button"
            as={IconButton}
            src={MoreHoriz}
            alt="text-component-card-header__menu"
            iconAs={Icon}
          />
          <Dropdown.Menu className='component-block-dropdown__menu'>
            <Dropdown.Item
              className='component-block-dropdown__menu-item'
              data-testid="text-component-card-header__menu-delete-button"
              onClick={() => onDelete(component.id)}
            >
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>
    </Stack>
  );
};
