import { CardHeader } from '../CardHeader';

export const HTMLComponentCard = ({ component, onEdit, onDelete }) => (
  <div className="component-block-wrappper">
    <CardHeader component={component} onDelete={onDelete} />
    <div dangerouslySetInnerHTML={{ __html: component.data }} />
  </div>
);
