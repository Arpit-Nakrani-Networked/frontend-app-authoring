import { CardHeader } from '../CardHeader';

export const VideoComponentCard = ({ component, onEdit, onDelete }) => {
  const idOrUrl = component?.metadata?.youtubeId10 || component?.metadata?.html5Sources?.length > 0 ? component?.metadata?.html5Sources[0] : "";

  // Check if it's a full Vimeo URL
  const isVimeo = idOrUrl && idOrUrl?.startsWith("http");

  const videoUrl = isVimeo
    ? idOrUrl
    : `https://www.youtube.com/embed/${idOrUrl}`;
  return (
    <div className="component-block-wrappper">
      <CardHeader component={component} onDelete={onDelete} />
      <iframe src={videoUrl} width={659} height={359} style={{ border: 'none', borderRadius: '1rem' }} />
    </div>
  );
};
