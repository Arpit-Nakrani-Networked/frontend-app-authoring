import { CardHeader } from '../CardHeader';

export const VideoComponentCard = ({ component, onEdit, onDelete }) => {
  const videoUrl = `https://www.youtube.com/embed/${component.metadata.youtubeId10}`;
  return (
    <div className="component-block-wrappper">
      <CardHeader component={component} onDelete={onDelete} />
      <iframe src={videoUrl} width={659} height={359} style={{ border: 'none', borderRadius: '1rem' }} />
    </div>
  );
};
