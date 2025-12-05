import { CardHeader } from '../CardHeader';
/* eslint-disable import/prefer-default-export */
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import './HTMLComponentCard.scss'

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
    <div className="component-block-wrappper html-component-container">
      <CardHeader component={component} onDelete={onDelete} />
      <div dangerouslySetInnerHTML={{ __html: updatedHtml }} />
    </div>
  );
}

export const buildScormAssetUrl = (blockId, assetPath) => {
  if (!blockId || !assetPath) {
    return null
  }
  const baseUrl = getConfig().STUDIO_BASE_URL
    // const encodedBlockId = encodeURIComponent(blockId);

  return `${baseUrl}/preview/xblock/${blockId}/handler/assets_proxy/${assetPath}`;
};

export const SCORMComponentCard = ({ component, onEdit, onDelete }) => {
  const url = buildScormAssetUrl(component?.id,component?.metadata?.indexPagePath)
  const height = component?.metadata?.height || 450
  const width = component?.metadata?.width || ''
  return (
    <div className="component-block-wrappper html-component-container">
      <CardHeader component={component} onDelete={onDelete} />
      {
        component?.metadata?.navigationMenu && <div dangerouslySetInnerHTML={{
          __html:component?.metadata?.navigationMenu
        }} />
      }
        {url && component?.metadata?.indexPagePath ? (
        <iframe
          src={url}
          style={{
            width:width ? String(width)?.replace(/px/g,'') +'px': "100%",
            height: height+"px",
            border: "none",
          }}
          allow="fullscreen"
        />
      ) : <p>Click 'Edit' to modify this module and upload a new SCORM package.</p>}
    </div>
  );
}
