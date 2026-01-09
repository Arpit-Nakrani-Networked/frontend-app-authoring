/* eslint-disable import/named */
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
    ModalDialog,
    Button,
    ActionRow,
    Form,
} from '@openedx/paragon';
import { RequestStatus, ToastStatus } from '../../data/constants';
import messages from './messages';
import Placeholder from '../../editors/Placeholder';
import { fetchCourseAppSettings, updateCourseAppSetting } from '../../advanced-settings/data/thunks';
import { useParams } from 'react-router';
import { useModel } from '../../generic/model-store';
import getPageHeadTitle from '../../generic/utils';
import { useDispatch, useSelector } from 'react-redux';
import { parseArrayOrObjectValues } from '../../utils';
import AdvanceSettingsNew from './AdvanceSettingsNew';
import { getCourseAppSettings, getLoadingStatus, getSavingStatus } from '../../advanced-settings/data/selectors';
import { showToast } from '../../generic/custom-toast/data/slice';

const ConfigureSettingModal = ({
    isOpen,
    onClose,
    onConfigureSubmit,
}) => {
    const intl = useIntl();
    const dispatch = useDispatch();
    const { courseId } = useParams();
    const [editedSettings, setEditedSettings] = useState({});
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [isQueryPending, setIsQueryPending] = useState(false);

    const courseDetails = useModel('courseDetails', courseId);
    // document.title = getPageHeadTitle(courseDetails?.name, intl.formatMessage(messages.headingTitle));

    useEffect(() => {
        setEditedSettings({})
        dispatch(fetchCourseAppSettings(courseId));
        // dispatch(fetchProctoringExamErrors(courseId));
    }, [courseId,isOpen]);

    const advancedSettingsData = useSelector(getCourseAppSettings);
    const savingStatus = useSelector(getSavingStatus);
    const loadingSettingsStatus = useSelector(getLoadingStatus);

    const isLoading = loadingSettingsStatus === RequestStatus.IN_PROGRESS;

    useEffect(() => {
        if (savingStatus === RequestStatus.SUCCESSFUL) {
            setIsQueryPending(false);
            setShowSuccessAlert(true);
            setTimeout(() => setShowSuccessAlert(false), 15000);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [savingStatus]);

    if (isLoading) {
        // eslint-disable-next-line react/jsx-no-useless-fragment
        return <></>;
    }
    if (loadingSettingsStatus === RequestStatus.DENIED) {
        return (
            <div className="row justify-content-center m-6">
                <Placeholder />
            </div>
        );
    }


    const dialogTitle = intl.formatMessage(messages.configureSettingsTitle);

    const handleSave = async () => {
        setIsQueryPending(true);
        try {
            if (editedSettings) await dispatch(updateCourseAppSetting(courseId, parseArrayOrObjectValues(editedSettings)));
            dispatch(showToast({
                message: `Settings updated successfully`,
                status: ToastStatus.SUCCESSFUL
            }));
            onClose()
        } catch (e) {
            console.log("eeeeeee", e);
        } finally {
            setIsQueryPending(false);
        }
    };

    const renderModalBody = () => {
        return <AdvanceSettingsNew initialValues={advancedSettingsData} setFieldValue={setEditedSettings} fieldValue={editedSettings} />
    };

    return (
        <ModalDialog
            className="configure-modal"
            size="lg"
            isOpen={isOpen}
            onClose={onClose}
            hasCloseButton
            isBlocking={true}
            isFullscreenOnMobile
            isOverflowVisible={false}
        >
            <div data-testid="configure-modal">
                <ModalDialog.Header className="configure-modal__header">
                    <ModalDialog.Title>
                        {dialogTitle}
                    </ModalDialog.Title>
                </ModalDialog.Header>

                <>
                    <ModalDialog.Body className="configure-modal__body">
                        <Form.Group size="sm" className="form-field">
                            {renderModalBody()}
                        </Form.Group>
                    </ModalDialog.Body>
                    <ModalDialog.Footer className="pt-1">
                        <ActionRow>
                            <ModalDialog.CloseButton variant="outline-third">
                                {intl.formatMessage(messages.cancelButton)}
                            </ModalDialog.CloseButton>
                            <Button
                                data-testid="configure-save-button"
                                onClick={handleSave}
                                disabled={isQueryPending}
                                isLoading={isQueryPending}
                            >
                                {intl.formatMessage(messages.saveSettingButton)}
                            </Button>
                        </ActionRow>
                    </ModalDialog.Footer>
                </>
            </div>
        </ModalDialog>
    );
};

ConfigureSettingModal.defaultProps = {
};

ConfigureSettingModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfigureSubmit: PropTypes.func.isRequired,
};

export default ConfigureSettingModal;
