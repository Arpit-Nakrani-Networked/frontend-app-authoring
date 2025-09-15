import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Spinner,
} from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';

import { selectors } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';

import { EditorComponent } from '../../EditorComponent';
import EditorContainer from '../EditorContainer';
import VideoEditorModal from './components/VideoEditorModal';
import { ErrorContext, errorsHook, fetchVideoContent, state as errorState } from './hooks';
import messages from './messages';
import { parseYoutubeId } from '../../../editors/data/services/cms/api';

const VideoEditor: React.FC<EditorComponent> = ({
  onClose,
  returnFunction,
  deleteBlock
}) => {
  const dispatch = useDispatch()
  const intl = useIntl();
  const [videoSourceErrors, setVideoSourceErrors] = errorState.videoSourceErrors({});
  const studioViewFinished = useSelector(
    (state) => selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchStudioView }),
  );
  const isLibrary = useSelector(selectors.app.isLibrary) as boolean;
  const {
    error,
    // validateEntry,
  } = errorsHook();

  return (
    <ErrorContext.Provider value={{ ...error, videoSource: [videoSourceErrors, setVideoSourceErrors] }}>
      <EditorContainer
        getContent={fetchVideoContent()}
        isDirty={/* istanbul ignore next */ () => true}
        onClose={onClose}
        returnFunction={returnFunction}
        validateEntry={() => {
          const videoState = fetchVideoContent();
          const videoData = videoState && videoState({ dispatch })
          const videoId = parseYoutubeId(videoData?.videoSource)
          if (!Boolean(videoId && videoId)) {
            setVideoSourceErrors("Invalid Url")
            return false
          } else {
            setVideoSourceErrors('')
            return true
          }
          return videoId && videoId
        }}
        deleteBlock={() => deleteBlock && deleteBlock()}
      >
        {studioViewFinished ? (
          <div className="video-editor">
            <VideoEditorModal {...{ isLibrary }} />
          </div>
        ) : (
          <div style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
          >
            <Spinner
              animation="border"
              className="m-3"
              screenreadertext={intl.formatMessage(messages.spinnerScreenReaderText)}
            />
          </div>
        )}
      </EditorContainer>
    </ErrorContext.Provider>
  );
};

export default VideoEditor;
