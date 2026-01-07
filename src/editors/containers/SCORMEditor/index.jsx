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
  IconButtonWithTooltip,
  Icon,
  ModalDialog,
  ActionRow,
} from '@openedx/paragon';
import { injectIntl, intlShape, FormattedMessage } from '@edx/frontend-platform/i18n';
import { InfoOutline,AddCircleOutline as IconAddCircle } from '@openedx/paragon/icons';
import EditorContainer from '../EditorContainer';
// This 'module' self-import hack enables mocking during tests.
// See src/editors/decisions/0005-internal-editor-testability-decisions.md. The whole approach to how hooks are tested
// should be re-thought and cleaned up to avoid this pattern.
// eslint-disable-next-line import/no-self-import
import * as module from '.';
import { actions, selectors } from '../../data/redux';
import { RequestKeys } from '../../data/constants/requests';
import ToggleItem from '../../../generic/configure-modal/ToggleItem';
import messages from './messages';

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

  // State for Advance Settings dialog
  const [isAdvanceOpen, setIsAdvanceOpen] = useState(false);

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

  const tooltipMap = {
    weight: "Weight/Maximum grade",
    height: "Height of iframe default: 450px",
    width: "Width of iframe default: 100%",
    navigation_menu_width: "Width of menu default: 100%",
    // navigation_menu_width : "Select True to display a navigation menu on the left side to display table of contents",
    popup_on_launch: "Launch in pop-up window instead of embedding the SCORM content in an iframe. Enable this for older packages that need to be run in separate window.",
    enable_fullscreen_button: "Select True to show fullscreen button in the SCORM content",
    navigation_menu: "Select True to display a navigation menu on the left side to display table of contents",
    scored: "Select False if this component will not receive a numerical score from the Scorm",
  }

  const tooltipContent = (id = "weight") => <IconButtonWithTooltip
    iconAs={Icon}
    size='sm'
    src={InfoOutline}
    onClick={() => {
      // ref.current.value = courseLicenseType;
      // updateField({ licenseType: '', licenseDetails: {} });
    }}
    tooltipPlacement="top"
    tooltipContent={<FormattedMessage id={`${id}Info`} defaultMessage={tooltipMap[id]} />}
  />

  console.log("has_score", scorm?.weight);
  return (
    <EditorContainer
      isDirty={() => false}
      getContent={() => {
        console.log("scorm -->>", scorm)
        return scorm
      }}
      onClose={onClose}
      returnFunction={returnFunction}
      isNew={isNew}
      className="scorm-module-modal pgn__modal-md"
      saveText={isNew ? "Add Scorm" : "Update Scorm"}
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
                <Form.Group size="sm" className="mb-4">
                  {/* <Form.Label className="text-secondory _font-weight-medium">SCORM Package File ( <small>Upload a SCORM package (.zip file)</small> )</Form.Label> */}
                  <div
                    onClick={handleFileButtonClick}
                    onDrop={e => {
                      e.preventDefault();
                      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                        handleFileChange({ target: { files: e.dataTransfer.files } });
                      }
                    }}
                    onDragOver={e => e.preventDefault()}
                    style={{
                      border: '2px dashed #0000001F',
                      borderRadius: '12px',
                      padding: '1rem',
                      // textAlign: 'center',
                      background: '#F8F8F8',
                      cursor: 'pointer',
                      color: '#00000099',
                      marginBottom: '12px',
                    }}
                  >
                    <div style={{ fontWeight: 500 }}>
                      {scorm?.file ? (
                        <>
                          <Icon name="fa-file-archive" className="mr-2" />
                          {scorm.file.name || 'File selected'}
                        </>
                      ) : (
                        <div className="d-flex align-items-center">
                          <Icon src={IconAddCircle} className="mr-2" />
                          Add .zip file
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".zip"
                      onChange={handleFileChange}
                      className="d-none"
                    />
                  </div>
                </Form.Group>

                <ToggleItem
                  label={"Scorm has Quiz that is Scored"}
                  description={"Select true if the SCORM file has quizzes inside it and you want that quizzes to be graded"}
                  checked={checkboxStates.has_score}
                  onChange={(e) => handleCheckboxChange('has_score', e.target.checked)}
                >
                  {Boolean(checkboxStates.has_score) ? <div className="mt-1 d-flex align-items-center gap-2 w-100">
                    <small>Total Quiz Weighted Score:</small>
                    <Form.Group className="ml-1 mb-0">
                      <Form.Control
                        type="number"
                        min={0}
                        step={0.1}
                        value={scorm?.weight ?? 10.0}
                        onChange={(e) => handleFieldChange('weight', parseFloat(e.target.value))}
                        style={{ height: '42px', borderRadius: '.75rem', border: '1px solid #0000001F', width: "80px" }}
                        placeholder="10.0"
                      />
                    </Form.Group>
                    <small>points</small>
                  </div> : null}
                </ToggleItem>

                {/* Advance Settings clickable div below ToggleItem */}
                <div
                  style={{ cursor: 'pointer', margin: '24px 0 0',padding:"9px 0", display: 'flex', alignItems: 'center', fontWeight: 600,fontSize:"14px" }}
                  onClick={() => setIsAdvanceOpen(true)}
                  data-testid="advance-settings-trigger"
                >
                  <Icon src={IconAddCircle} className="mr-2" style={{color:"#00000099"}} /> <span style={{ color: '#000000CC', }}>Advance Settings</span>
                </div>

                {/* Advance Settings Modal/Dialog using Paragon ModalDialog */}
                <ModalDialog
                  isOpen={isAdvanceOpen}
                  onClose={() => setIsAdvanceOpen(false)}
                  title="Advance Settings"
                  size="md"
                  hasCloseButton
                >
                  <ModalDialog.Header className="editor-container_header">
                    Advance Settings
                  </ModalDialog.Header>
                  <ModalDialog.Body>
                    <ToggleItem
                      label={"Show Fullscreen button "}
                      description={"Select True to show fullscreen button in the SCORM content"}
                      checked={checkboxStates.enable_fullscreen_button}
                      onChange={e => handleCheckboxChange('enable_fullscreen_button', e.target.checked)}
                    />

                    <ToggleItem
                      label={"Display height (px) "}
                      description={"Height of iframe"}
                      checked={scorm?.height}
                      style={{marginTop:"24px"}}
                    // onChange={(e) => scorm?.height > 0 ? handleCheckboxChange('has_score', e.target.checked)}
                    >
                      {Boolean(scorm?.height) ? <div className="mt-1 d-flex align-items-center gap-2">
                        <Form.Group className="mx-2 mb-0 w-100">
                          <Form.Control
                            type="number"
                            min={0}
                            step={0.1}
                            value={scorm?.height ?? 450}
                            onChange={(e) => handleFieldChange('height', parseFloat(e.target.value))}
                            style={{ height: '42px', borderRadius: '.75rem', border: '1px solid #0000001F', width: "100%" }}
                            placeholder="450"
                          />
                        </Form.Group>
                      </div> : null}
                    </ToggleItem>


                    <ToggleItem
                      label={"Launch in pop-up window "}
                      description={"Launch in pop-up window instead of embedding the SCORM content in an iframe. Enable this for older packages that need to be run in separate window."}
                      checked={checkboxStates.popup_on_launch}
                      onChange={e => handleCheckboxChange('popup_on_launch', e.target.checked)}
                      style={{marginTop:"24px"}}
                    />


                  </ModalDialog.Body>
                  <ModalDialog.Footer className="shadow-sm px-4 pb-3 pt-0">
                    <ActionRow>
                      <Button
                        // aria-label={intl.formatMessage(messages.cancelButtonAriaLabel)}
                        variant="outline-third btn-sm"
                        // style={{ padding: '6px  16px' }}
                        // onClick={confirmCancelIfDirty}
                        onClick={() => setIsAdvanceOpen(false)}
                      >
                        <FormattedMessage {...messages.cancelButtonLabel} />
                      </Button>
                      <Button
                        aria-label={intl.formatMessage(messages.saveButtonAriaLabel)}
                        // onClick={onSave}
                        variant="outline-primary btn-sm"
                        // style={{ padding: '6px  16px' }}
                        // disabled={disableSave || isLoading || disabled}
                        onClick={() => setIsAdvanceOpen(false)}

                      >
                        {(<FormattedMessage {...messages.saveButtonLabel} />)}
                        {/* {isLoading
                          ? <Spinner animation="border" className="d-flex justify-content-center ml-2" style={{ width: '1rem', height: '1rem' }} /> : null
                        } */}
                      </Button>
                    </ActionRow>
                  </ModalDialog.Footer>
                </ModalDialog>

                {/* <Row> */}
                {/* Weight */}
                {/* <Col md={6}>
                    <Form.Group size="sm" className='mb-4'>
                      <Form.Label className="text-secondory _font-weight-medium d-flex align-items-center">Weight ({tooltipMap["weight"]})</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        step={0.1}
                        value={scorm?.weight ?? 10.0}
                        onChange={(e) => handleFieldChange('weight', parseFloat(e.target.value))}
                        style={{ height: '42px', borderRadius: '.75rem', border: '1px solid #0000001F' }}
                        placeholder="10.0"
                      />
                    </Form.Group>
                  </Col> */}

                {/* Height */}
                {/* <Col md={6}>
                    <Form.Group size="sm" className='mb-4'>
                      <Form.Label className="text-secondory _font-weight-medium d-flex align-items-center">Height (px) ({tooltipMap["height"]})</Form.Label>
                      <Form.Control
                        type="number"
                        min={0}
                        value={scorm?.height ?? 450}
                        onChange={(e) => handleFieldChange('height', parseInt(e.target.value, 10))}
                        style={{ height: '42px', borderRadius: '.75rem', border: '1px solid #0000001F' }}
                        placeholder="450"
                      />
                    </Form.Group>
                  </Col> */}
                {/* </Row> */}

                {/* <Row> */}
                {/* Width */}
                {/* <Col md={6}>
                    <Form.Group size="sm" className='mb-4'>
                      <Form.Label className="text-secondory _font-weight-medium d-flex align-items-center">Width (px) ({tooltipMap["width"]})</Form.Label>
                      <Form.Control
                        type="text"
                        value={scorm?.width || ''}
                        onChange={(e) => handleFieldChange('width', e.target.value)}
                        style={{ height: '42px', borderRadius: '.75rem', border: '1px solid #0000001F' }}
                        placeholder=""
                      />
                    </Form.Group>
                  </Col> */}

                {/* Navigation Menu Width */}
                {/* <Col md={6}>
                    <Form.Group size="sm" className='mb-4'>
                      <Form.Label className="text-secondory _font-weight-medium d-flex align-items-center">Navigation Menu Width ({tooltipMap["navigation_menu_width"]})</Form.Label>
                      <Form.Control
                        type="text"
                        value={scorm?.navigation_menu_width || ''}
                        onChange={(e) => handleFieldChange('navigation_menu_width', e.target.value)}
                        style={{ height: '42px', borderRadius: '.75rem', border: '1px solid #0000001F' }}
                        placeholder=""
                      />
                    </Form.Group>
                  </Col> */}
                {/* </Row> */}
                {/* <Row> */}
                {/* Width */}
                {/* <Col md={6}>
                    <Form.Checkbox
                      key={checkboxStates.has_score}
                      name="has_score"
                      className="mb-3 d-flex align-items-center"
                      checked={checkboxStates.has_score}
                      onChange={(e) => handleCheckboxChange('has_score', e.target.checked)}
                    >
                      <p className='m-0 d-flex align-items-center'>Has Score {tooltipContent('scored')}</p>
                    </Form.Checkbox>
                  </Col> */}

                {/* Navigation Menu Width */}
                {/* <Col md={6}>
                    <Form.Checkbox
                      key={checkboxStates.enable_navigation_menu}
                      name="enable_navigation_menu"
                      className="mb-3 d-flex align-items-center"
                      checked={checkboxStates.enable_navigation_menu}
                      onChange={(e) => handleCheckboxChange('enable_navigation_menu', e.target.checked)}
                    >
                      <p className='m-0 d-flex align-items-center'>Enable Navigation Menu {tooltipContent('navigation_menu')}</p>
                    </Form.Checkbox>
                  </Col>
                  <Col md={6}>
                    <Form.Checkbox
                      key={checkboxStates.enable_fullscreen_button}
                      name="enable_fullscreen_button"
                      className="mb-3 d-flex align-items-center"
                      checked={checkboxStates.enable_fullscreen_button}
                      onChange={(e) => handleCheckboxChange('enable_fullscreen_button', e.target.checked)}
                    >
                      <p className='m-0 d-flex align-items-center'>Enable Fullscreen Button {tooltipContent('enable_fullscreen_button')}</p>
                    </Form.Checkbox>
                  </Col>
                  <Col md={6}>
                    <Form.Checkbox
                      key={checkboxStates.popup_on_launch}
                      name="popup_on_launch"
                      className="mb-3 d-flex align-items-center"
                      checked={checkboxStates.popup_on_launch}
                      onChange={(e) => handleCheckboxChange('popup_on_launch', e.target.checked)}
                    >
                      <p className='m-0 d-flex align-items-center'>Popup on Launch {tooltipContent('popup_on_launch')}</p>
                    </Form.Checkbox>
                  </Col> */}
                {/* </Row> */}

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
