import {
  Button, Dropdown, Icon, IconButton, Stack,
} from '@openedx/paragon';
import { MoreHoriz,MoreVert } from '@openedx/paragon/icons';
import { useNavigate } from 'react-router';
import DeleteIcon from '../../assets/images/deleteIcon.svg'
import EditIcon from '../../assets/images/editIcon.svg'
import SolidSvgComponent from '../../_components/solid-svg/SolidSvgComponent';

export const CardHeader = ({ component, onDelete }) => {
  const navigate = useNavigate();

  const getCardTitle = () => {
    switch (component.category) {
      case 'html':
        return 'TEXT';
      case 'video':
        return 'VIDEO';
      case 'problem':
        return 'QUESTION';
      default:
        return '';
    }
  };

  const handleEdit = () => {
    navigate(`editor/${component.category}/${component.id}`);
  };

  return (
    <Stack direction="horizontal" className="justify-content-between">
      <span className="text-secondory">{getCardTitle()}</span>
      <Stack direction="horizontal" className="justify-content-between" gap={3}>
        <span className="xblock-edit-icon btn-icon d-flex justify-content-center align-items-center" onClick={handleEdit}><SolidSvgComponent url={EditIcon} width={16} height={16} defaultClass={``} iconColor='#00000099' isIconColor /></span>
        <Dropdown>
          <Dropdown.Toggle
            className="item-card-header__menu xblock-delete-button"
            id={`text-component-card-header__menu`}
            data-testid={`text-component-card-header__menu-button`}
            as={IconButton}
            src={MoreVert}
            alt={`text-component-card-header__menu`}
            iconAs={Icon}
          />
          <Dropdown.Menu className="component-block-dropdown__menu">
            <Dropdown.Item
              className="component-block-dropdown__menu-item _text-delete align-items-center"
              data-testid="text-component-card-header__menu-delete-button"
              onClick={() => onDelete(component.id)}
            >
              <img src={DeleteIcon} alt="icon" className={`mr-2`} />
              Delete
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Stack>
    </Stack>
  );
};
