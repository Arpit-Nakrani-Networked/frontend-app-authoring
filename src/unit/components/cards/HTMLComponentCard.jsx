import { CardHeader } from '../CardHeader';
/* eslint-disable import/prefer-default-export */
import { ensureConfig, getConfig } from '@edx/frontend-platform';
import './HTMLComponentCard.scss'
import React from 'react';
// import { LoadingSpinner } from '../../../generic/Loading';

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
  const baseUrl = getConfig().LMS_BASE_URL
  return `${baseUrl}/xblock_particular/${blockId}?exam_access=&jumpToId&recheck_access=1&show_bookmark=0&show_title=0&view=student_view`;
};

export const SCORMComponentCard = ({ component, onEdit, onDelete }) => {
  const url = buildScormAssetUrl(component?.id, component?.metadata?.indexPagePath);
  // console.log("component---->>>>>>",component);
  
  const popupOnLaunch = component?.metadata?.popupOnLaunch
  const height = popupOnLaunch ? 300 : (component?.metadata?.height || 450) + 160;
  const width = component?.metadata?.width || '';
  // const [iframeLoaded, setIframeLoaded] = React.useState(false);
  return (
    <div className="component-block-wrappper html-component-container">
      <CardHeader component={component} onDelete={onDelete} />
      {/* {
        component?.metadata?.navigationMenu && <div dangerouslySetInnerHTML={{
          __html:component?.metadata?.navigationMenu
        }} />
      } */}
      {url && component?.metadata?.indexPagePath ? (
        <>
          {/* {!iframeLoaded && (
            <div className="scorm-loader" style={{ textAlign: 'center', padding: '2em' }}>
              <LoadingSpinner />
            </div>
          )} */}
          <iframe
            src={url}
            style={{
              width: width ? String(width)?.replace(/px/g, '') + 'px' : '100%',
              minHeight: height + 'px',
              border: 'none',
              // display: iframeLoaded ? 'block' : 'none',
            }}
            allow="fullscreen"
            // onLoad={() => setIframeLoaded(true)}
          />
        </>
      ) : (
        <p>Click 'Edit' to modify this module and upload a new SCORM package.</p>
      )}
    </div>
  );
}
