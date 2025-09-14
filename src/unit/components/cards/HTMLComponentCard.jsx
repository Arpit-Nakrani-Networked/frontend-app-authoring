import { CardHeader } from '../CardHeader';
/* eslint-disable import/prefer-default-export */
import { ensureConfig, getConfig } from '@edx/frontend-platform';

ensureConfig([
  'STUDIO_BASE_URL',
], 'Course Apps API service');

function updateImageSrc(htmlData, courseURL) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlData, "text/html");

  doc.querySelectorAll("img").forEach(img => {
    if (img.getAttribute("src")?.startsWith("/assets/courseware")) {
      img.setAttribute("src", courseURL + img.getAttribute("src"));
    }
  });

  return doc.body.innerHTML;
}

export const HTMLComponentCard = ({ component, onEdit, onDelete }) => {
  const baseUrl = getConfig().LMS_BASE_URL;
  const updatedHtml = updateImageSrc(component.data, baseUrl);
  return (
    <div className="component-block-wrappper">
      <CardHeader component={component} onDelete={onDelete} />
      <div dangerouslySetInnerHTML={{ __html: updatedHtml }} />
    </div>
  );
}
