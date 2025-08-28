// Note: there is no Editor.test.tsx. This component only works together with
// <EditorPage> as its parent, so they are tested together in EditorPage.test.tsx
import React from 'react';
import { useDispatch } from 'react-redux';
import { FormattedMessage } from '@edx/frontend-platform/i18n';

import messages from './messages';
import * as hooks from './hooks';

import supportedEditors from './supportedEditors';
import type { EditorComponent } from './EditorComponent';

export interface Props extends EditorComponent {
  blockType: string;
  blockId: string | null;
  learningContextId: string | null;
  lmsEndpointUrl: string | null;
  studioEndpointUrl: string | null;
  fullScreen?: boolean;
  handleDeleteComponentBlock?: any;
}

const Editor: React.FC<Props> = ({
  learningContextId,
  blockType,
  blockId,
  lmsEndpointUrl,
  studioEndpointUrl,
  onClose = null,
  returnFunction = null,
  handleDeleteComponentBlock = null,
}) => {
  const dispatch = useDispatch();
  hooks.initializeApp({
    dispatch,
    data: {
      blockId,
      blockType,
      learningContextId,
      lmsEndpointUrl,
      studioEndpointUrl,
    },
  });

  const EditorComponent = supportedEditors[blockType];
  const innerEditor = (EditorComponent !== undefined)
    ? <EditorComponent {...{ onClose, returnFunction, deleteBlock: handleDeleteComponentBlock }} />
    : <FormattedMessage {...messages.couldNotFindEditor} />;

  return innerEditor;
};

export default Editor;
