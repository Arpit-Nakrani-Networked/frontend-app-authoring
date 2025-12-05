/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
/**
 * This is an example component for an xblock Editor
 * It uses pre-existing components to handle the saving of a the result of a function into the xblock's data.
 * To use run npm run-script addXblock <your>
 */

import React, { useState, useRef, useEffect } from 'react';
import { connect, useSelector, useDispatch, shallowEqual } from 'react-redux';
import PropTypes from 'prop-types';

import {
  Spinner,
  Form,
  Button,
  Card,
  Container,
  Row,
  Col,
} from '@openedx/paragon';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';

import EditorContainer from '../EditorContainer';
// This 'module' self-import hack enables mocking during tests.
// See src/editors/decisions/0005-internal-editor-testability-decisions.md. The whole approach to how hooks are tested
// should be re-thought and cleaned up to avoid this pattern.
// eslint-disable-next-line import/no-self-import
import * as module from '.';
import { actions, selectors } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';

export const hooks = {
  getContent: () => { },
};

export const scormEditor = ({
  onClose,
  // redux
  lmsEndpointUrl,
  blockFailed,
  blockFinished,
  initializeEditor,
  scormState,
  // inject
  intl,
  returnFunction,
  deleteBlock,
  isNew
}) => {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const studioViewFinished = useSelector(
    (state) => selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchStudioView }),
  );

  const scorm = useSelector((state) => state.scorm);
  const blockValue = useSelector((state) => state?.app?.blockValue?.data);
  console.log("State SCORM", blockValue);

  // Local state for checkboxes for immediate UI feedback
  const [checkboxStates, setCheckboxStates] = useState({
    has_score: Boolean(scorm?.has_score),
    enable_navigation_menu: Boolean(scorm?.enable_navigation_menu),
    enable_fullscreen_button: Boolean(scorm?.enable_fullscreen_button),
    popup_on_launch: Boolean(scorm?.popup_on_launch),
  });

  // Sync local state with Redux state when Redux state changes
  useEffect(() => {
    setCheckboxStates(prev => {
      prev['has_score'] = Boolean(scorm?.has_score)
      prev['enable_navigation_menu'] = Boolean(scorm?.enable_navigation_menu)
      prev['enable_fullscreen_button'] = Boolean(scorm?.enable_fullscreen_button)
      prev['popup_on_launch'] = Boolean(scorm?.popup_on_launch)
      return prev
    });
  }, [scorm]);

  // Handle field changes
  const handleFieldChange = (fieldName, value) => {
    console.log("handle field changes -->>> ", fieldName, value);

    dispatch(actions.scorm.updateField({ [fieldName]: value }));
  };

  // Handle checkbox changes with immediate local state update
  const handleCheckboxChange = (fieldName, checked) => {
    // Update local state immediately for instant UI feedback
    setCheckboxStates(prev => {
      prev[fieldName] = checked
      return prev
    });
    // Also update Redux state
    dispatch(actions.scorm.updateField({ [fieldName]: checked ? 1 : 0 }));
  };

  // Handle file upload
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(actions.scorm.setFile(file));
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  console.log("has_score", scorm?.weight);
  return (
    <EditorContainer
      isDirty={() => false}
      getContent={() => {
        console.log("scorm -->>",scorm)
        return scorm
      }}
      onClose={onClose}
      returnFunction={returnFunction}
      isNew={isNew}
      className="scorm-module-modal"
    >
      <div className="editor-body h-75 overflow-auto">
        {!studioViewFinished
          ? (
            <div className="text-center p-6">
              <Spinner
                animation="border"
                className="m-3"
                screenreadertext="Loading"
              />
            </div>
          )
          : (
            <Card className="pt-2" border={0} style={{ border: "none" }}>
              <Card.Body>
                {/* Display Name */}
                {/* <Form.Group className="mb-4">
                    <Form.Control
                      type="text"
                      value={scorm?.display_name || ''}
                      onChange={(e) => handleFieldChange('display_name', e.target.value)}
                      floatingLabel="Display Name"
                    />
                    <Form.Control.Feedback>
                      The display name for this SCORM module
                    </Form.Control.Feedback>
                  </Form.Group> */}

                {/* File Upload */}
                <Form.Group className="mb-4">
                  <Form.Label>SCORM Package File ( <small>Upload a SCORM package (.zip file)</small> )</Form.Label>
                  <div className="d-flex align-items-center gap-3 mb-1">
                    <Button
                      variant="outline-primary"
                      onClick={handleFileButtonClick}
                    >
                      {scorm?.file ? 'Change File' : 'Choose File'}
                    </Button>
                    <span className="text-muted ml-2">
                      {scorm?.file ? scorm.file.name || 'File selected' : 'No file chosen'}
                    </span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".zip"
                    onChange={handleFileChange}
                    className="d-none"
                  />
                  {/* <Form.Control.Feedback>
                      Upload a SCORM package (.zip file)
                    </Form.Control.Feedback> */}
                </Form.Group>

                <Row>
                  {/* Weight */}
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Control
                        type="number"
                        min={0}
                        step={0.1}
                        value={scorm?.weight ?? 10.0}
                        onChange={(e) => handleFieldChange('weight', parseFloat(e.target.value))}
                        floatingLabel="Weight"
                      />
                      <Form.Control.Feedback>
                        Weight for grading (default: 10.0)
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Height */}
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Control
                        type="number"
                        min={0}
                        value={scorm?.height ?? 450}
                        onChange={(e) => handleFieldChange('height', parseInt(e.target.value, 10))}
                        floatingLabel="Height (px)"
                      />
                      <Form.Control.Feedback>
                        Display height in pixels (default: 450)
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  {/* Width */}
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Control
                        type="text"
                        value={scorm?.width || ''}
                        onChange={(e) => handleFieldChange('width', e.target.value)}
                        floatingLabel="Width (px)"
                      />
                      <Form.Control.Feedback>
                        Display width (e.g., 100%, 800px, or leave empty for auto)
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  {/* Navigation Menu Width */}
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Control
                        type="text"
                        value={scorm?.navigation_menu_width || ''}
                        onChange={(e) => handleFieldChange('navigation_menu_width', e.target.value)}
                        floatingLabel="Navigation Menu Width"
                      />
                      <Form.Control.Feedback>
                        Width of navigation menu (e.g., 20%, 200px)
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  {/* Width */}
                  <Col md={6}>
                    <Form.Checkbox
                      key={checkboxStates.has_score}
                      name="has_score"
                      className="mb-3"
                      checked={checkboxStates.has_score}
                      onChange={(e) => handleCheckboxChange('has_score', e.target.checked)}
                    >
                      <div>
                        <strong>Has Score</strong>
                        <div className="text-muted small">
                          Enable scoring for this SCORM module
                        </div>
                      </div>
                    </Form.Checkbox>
                  </Col>

                  {/* Navigation Menu Width */}
                  <Col md={6}>
                    <Form.Checkbox
                      key={checkboxStates.enable_navigation_menu}
                      name="enable_navigation_menu"
                      className="mb-3"
                      checked={checkboxStates.enable_navigation_menu}
                      onChange={(e) => handleCheckboxChange('enable_navigation_menu', e.target.checked)}
                    >
                      <div>
                        <strong>Enable Navigation Menu</strong>
                        <div className="text-muted small">
                          Show navigation menu for SCORM content
                        </div>
                      </div>
                    </Form.Checkbox>
                  </Col>
                  <Col md={6}>
                    <Form.Checkbox
                      key={checkboxStates.enable_fullscreen_button}
                      name="enable_fullscreen_button"
                      className="mb-3"
                      checked={checkboxStates.enable_fullscreen_button}
                      onChange={(e) => handleCheckboxChange('enable_fullscreen_button', e.target.checked)}
                    >
                      <div>
                        <strong>Enable Fullscreen Button</strong>
                        <div className="text-muted small">
                          Allow users to view content in fullscreen mode
                        </div>
                      </div>
                    </Form.Checkbox>
                  </Col>
                  <Col md={6}>
                    <Form.Checkbox
                      key={checkboxStates.popup_on_launch}
                      name="popup_on_launch"
                      className="mb-3"
                      checked={checkboxStates.popup_on_launch}
                      onChange={(e) => handleCheckboxChange('popup_on_launch', e.target.checked)}
                    >
                      <div>
                        <strong>Popup on Launch</strong>
                        <div className="text-muted small">
                          Launch SCORM content in a popup window
                        </div>
                      </div>
                    </Form.Checkbox>
                  </Col>
                </Row>

              </Card.Body>
            </Card>
          )}
      </div>
    </EditorContainer>
  )
};
scormEditor.defaultProps = {
  blockValue: null,
  lmsEndpointUrl: null,
  scormState: null,
};
scormEditor.propTypes = {
  onClose: PropTypes.func.isRequired,
  // redux
  blockValue: PropTypes.shape({
    data: PropTypes.shape({ data: PropTypes.string }),
  }),
  lmsEndpointUrl: PropTypes.string,
  blockFailed: PropTypes.bool.isRequired,
  blockFinished: PropTypes.bool.isRequired,
  initializeEditor: PropTypes.func.isRequired,
  scormState: PropTypes.shape({
    file: PropTypes.any,
    display_name: PropTypes.string,
    has_score: PropTypes.number,
    enable_navigation_menu: PropTypes.number,
    enable_fullscreen_button: PropTypes.number,
    weight: PropTypes.number,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.number,
    navigation_menu_width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    popup_on_launch: PropTypes.number,
  }),
  // inject
  intl: intlShape.isRequired,
};

export const mapStateToProps = (state) => ({
  blockValue: selectors.app.blockValue(state),
  lmsEndpointUrl: selectors.app.lmsEndpointUrl(state),
  blockFailed: selectors.requests.isFailed(state, { requestKey: RequestKeys.fetchBlock }),
  blockFinished: selectors.requests.isFinished(state, { requestKey: RequestKeys.fetchBlock }),
  // SCORM Redux state
  scormState: selectors.scorm.completeState(state),
});

export const mapDispatchToProps = {
  initializeEditor: actions.app.initializeEditor,
  // TODO fill with dispatches here if needed
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(scormEditor));
