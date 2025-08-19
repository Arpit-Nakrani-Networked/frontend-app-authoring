import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import {
  Container, Layout, Button, StatefulButton,
} from '@openedx/paragon';
import { CheckCircle, Warning, Add as IconAdd, EditOutline as IconEdit } from '@openedx/paragon/icons';
import { useModel } from '../generic/model-store';
import AlertMessage from '../generic/alert-message';
import { RequestStatus } from '../data/constants';
import InternetConnectionAlert from '../generic/internet-connection-alert';
import SubHeader from '../generic/sub-header/SubHeader';
// import SectionSubHeader from '../generic/section-sub-header';
import { STATEFUL_BUTTON_STATES } from '../constants';
import {
  getGradingSettings,
  getCourseAssignmentLists,
  getSavingStatus,
  getLoadingStatus,
  getCourseSettings,
} from './data/selectors';
import { fetchGradingSettings, sendGradingSetting, fetchCourseSettingsQuery, sendGradingPassSetting } from './data/thunks';
// import GradingScale from './grading-scale/GradingScale';
// import GradingSidebar from './grading-sidebar';
import messages from './messages';
import AssignmentSection from './assignment-section';
// import CreditSection from './credit-section';
// import DeadlineSection from './deadline-section';
import { useConvertGradeCutoffs, useUpdateGradingData } from './hooks';
import getPageHeadTitle from '../generic/utils';
import GradingModal from './grading-modal/GradingModal';
import GradingScaleModel from './grading-scale/GradingScaleModel';
import ProcessingNotification from '../generic/processing-notification';

const GradingSettings = ({ intl, courseId }) => {
  const gradingSettingsData = useSelector(getGradingSettings);
  const courseSettingsData = useSelector(getCourseSettings);
  const courseAssignmentLists = useSelector(getCourseAssignmentLists);
  const savingStatus = useSelector(getSavingStatus);
  const loadingStatus = useSelector(getLoadingStatus);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const dispatch = useDispatch();
  const isLoading = loadingStatus === RequestStatus.IN_PROGRESS;
  const [isQueryPending, setIsQueryPending] = useState(false);
  const [showOverrideInternetConnectionAlert, setOverrideInternetConnectionAlert] = useState(false);
  const [eligibleGrade, setEligibleGrade] = useState(null);

  const [editId, setEditId] = useState(null);

  const courseDetails = useModel('courseDetails', courseId);
  document.title = getPageHeadTitle(courseDetails?.name, intl.formatMessage(messages.headingTitle));

  const {
    graders,
    resetDataRef,
    setGradingData,
    gradingData,
    gradeCutoffs,
    gracePeriod,
    minimumGradeCredit,
    showSavePrompt,
    setShowSavePrompt,
    handleResetPageData,
    handleAddAssignment,
    handleRemoveAssignment,
  } = useUpdateGradingData(gradingSettingsData, setOverrideInternetConnectionAlert, setShowSuccessAlert);

  const {
    gradeLetters,
    gradeValues,
    sortedGrades,
  } = useConvertGradeCutoffs(gradeCutoffs);

  useEffect(() => {
    if (savingStatus === RequestStatus.SUCCESSFUL) {
      setShowSuccessAlert(!showSuccessAlert);
      setShowSavePrompt(!showSavePrompt);
      // setEditId(null);
      // setShowGradeModal(false)
      setTimeout(() => setShowSuccessAlert(false), 15000);
      setIsQueryPending(!isQueryPending);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [savingStatus]);

  // useEffect(() => {
  //   if (!showSavePrompt) {
  //     setEditId(null);
  //   }
  // }, [showSavePrompt]);

  useEffect(() => {
    dispatch(fetchGradingSettings(courseId));
    dispatch(fetchCourseSettingsQuery(courseId));
  }, [courseId]);

  if (isLoading) {
    // eslint-disable-next-line react/jsx-no-useless-fragment
    return <></>;
  }

  const handleQueryProcessing = () => {
    setShowSuccessAlert(false);
    dispatch(sendGradingSetting(courseId, gradingData));
  };

  const handleSendGradingSettingsData = (data) => {
    setIsQueryPending(true);
    // setOverrideInternetConnectionAlert(true);
     dispatch(sendGradingSetting(courseId, data || gradingData));
  };
  const handleSendGradingPassingScoreSettingsData = (data) => {
    setIsQueryPending(true);
    // setOverrideInternetConnectionAlert(true);
     dispatch(sendGradingPassSetting(courseId, data || gradingData));
  };

  const handleInternetConnectionFailed = () => {
    setShowSavePrompt(false);
    setShowSuccessAlert(false);
    setIsQueryPending(false);
    setOverrideInternetConnectionAlert(true);
  };

  const updateValuesButtonState = {
    labels: {
      default: intl.formatMessage(messages.buttonSaveText),
      pending: intl.formatMessage(messages.buttonSavingText),
    },
    disabledStates: [RequestStatus.PENDING],
  };

  const onReset = (force = false) => {
    if (!showSavePrompt && !force) return;
    handleResetPageData()
  }

  console.log("gradingSettingsData", gradingSettingsData, graders);


  return (
    <>
      <Container size="xl" className="grading px-4 pt-4">
        {/* <div className="mt-5">
          <AlertMessage
            show={showSuccessAlert}
            variant="success"
            icon={CheckCircle}
            title={intl.formatMessage(messages.alertSuccess)}
            aria-hidden="true"
            aria-labelledby={intl.formatMessage(messages.alertSuccessAriaLabelledby)}
            aria-describedby={intl.formatMessage(messages.alertSuccessAriaDescribedby)}
          />
        </div> */}
        <div>
          <section className="setting-items mb-4">
            {/* <Layout
              lg={[{ span: 12 }]}
              md={[{ span: 12 }]}
              sm={[{ span: 12 }]}
              xs={[{ span: 12 }]}
              xl={[{ span: 12 }]}
            > */}
            <Container size="xl" className="px-0">
              <article>
                <SubHeader
                  title={intl.formatMessage(messages.headingTitle)}
                  description={<span className="_text-black-400">{intl.formatMessage(messages.setPassingGradePre)} <span className='_text-2xl _font-weight-semibold'>{gradeValues[0]}% </span>{intl.formatMessage(messages.setPassingGradePost)}</span>}
                  headerActions={
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      iconBefore={IconEdit}
                      onClick={() => setShowGradeModal(true)}
                    >
                      {intl.formatMessage(messages.editGrade)}
                    </Button>
                  }
                />
                <section>
                  {showGradeModal && <GradingScaleModel
                    gradeCutoffs={gradeCutoffs}
                    showSavePrompt={setShowSavePrompt}
                    gradeLetters={gradeLetters}
                    gradeValues={gradeValues}
                    sortedGrades={sortedGrades}
                    setShowSuccessAlert={setShowSuccessAlert}
                    setGradingData={setGradingData}
                    resetDataRef={resetDataRef}
                    setOverrideInternetConnectionAlert={setOverrideInternetConnectionAlert}
                    setEligibleGrade={setEligibleGrade}
                    isOpen={showGradeModal}
                    onClose={(force) => {
                      onReset(force);
                      setShowGradeModal(false);
                    }}
                    onSubmit={()=>{
                      handleSendGradingPassingScoreSettingsData()
                      setShowGradeModal(false);
                    }}
                    isLoading={false}
                    isDisabled={gradingSettingsData?.gradeCutoffs['Pass'] === gradeCutoffs['Pass']}
                  />}
                </section>
                {/* {courseSettingsData.creditEligibilityEnabled && courseSettingsData.isCreditCourse && (
                    <section>
                      <SectionSubHeader
                        title={intl.formatMessage(messages.creditEligibilitySectionTitle)}
                        description={intl.formatMessage(messages.creditEligibilitySectionDescription)}
                      />
                      <CreditSection
                        eligibleGrade={eligibleGrade}
                        setShowSavePrompt={setShowSavePrompt}
                        minimumGradeCredit={minimumGradeCredit}
                        setGradingData={setGradingData}
                        setShowSuccessAlert={setShowSuccessAlert}
                      />
                    </section>
                  )} */}
                {/* <section>
                    <SectionSubHeader
                      title={intl.formatMessage(messages.gradingRulesPoliciesSectionTitle)}
                      description={intl.formatMessage(messages.gradingRulesPoliciesSectionDescription)}
                    />
                    <DeadlineSection
                      setShowSavePrompt={setShowSavePrompt}
                      gracePeriod={gracePeriod}
                      setGradingData={setGradingData}
                      setShowSuccessAlert={setShowSuccessAlert}
                    />
                  </section> */}
                <section className="card pt-3 px-0 overflow-hidden">
                  <header className="px-4 row justify-content-between align-items-center mx-0 mb-2">
                    <h2 className="lead _text-xl">
                      {intl.formatMessage(messages.assignmentTypeSectionTitle)}
                    </h2>
                    <Button
                      variant="primary"
                      iconBefore={IconAdd}
                      onClick={() => {
                        handleAddAssignment(handleSendGradingSettingsData);
                      }}
                      size='sm'
                    >
                      {intl.formatMessage(messages.addNewAssignmentTypeBtn)}
                    </Button>
                  </header>
                  <AssignmentSection
                    handleRemoveAssignment={(id)=>{
                      handleRemoveAssignment(id,handleSendGradingSettingsData)
                    }}
                    setShowSavePrompt={setShowSavePrompt}
                    graders={graders}
                    setGradingData={setGradingData}
                    courseAssignmentLists={courseAssignmentLists}
                    setShowSuccessAlert={setShowSuccessAlert}
                    onReset={(force) => {
                      onReset(force);
                      setEditId(null);
                    }}
                    onSubmit={handleSendGradingSettingsData}
                    setEditId={setEditId}
                    editId={editId}
                    isLoading={false}
                  />
                </section>
              </article>
            </Container>
            {/* <Layout.Element>
                <GradingSidebar
                  courseId={courseId}
                  intl={intl}
                  proctoredExamSettingsUrl={courseSettingsData.mfeProctoredExamSettingsUrl}
                />
              </Layout.Element> */}
            {/* </Layout> */}
          </section>
        </div>
      </Container>
      <div className="alert-toast">
        {showOverrideInternetConnectionAlert && (
          <InternetConnectionAlert
            isFailed={savingStatus === RequestStatus.FAILED}
            isQueryPending={isQueryPending}
            onQueryProcessing={handleQueryProcessing}
            onInternetConnectionFailed={handleInternetConnectionFailed}
          />
        )}
        <ProcessingNotification
          isShow={isQueryPending}
          title={'Loading...'}
        />
        {/* <AlertMessage
          show={showSavePrompt}//showSavePrompt
          aria-hidden={!showSavePrompt}
          aria-labelledby={intl.formatMessage(messages.alertWarningAriaLabelledby)}
          aria-describedby={intl.formatMessage(messages.alertWarningAriaDescribedby)}
          data-testid="grading-settings-save-alert"
          role="dialog"
          actions={[
            !isQueryPending && (
              <Button variant="tertiary" onClick={handleResetPageData}>
                {intl.formatMessage(messages.buttonCancelText)}
              </Button>
            ),
            <StatefulButton
              key="statefulBtn"
              onClick={handleSendGradingSettingsData}
              state={isQueryPending ? STATEFUL_BUTTON_STATES.pending : STATEFUL_BUTTON_STATES.default}
              {...updateValuesButtonState}
            />,
          ].filter(Boolean)}
          variant="warning"
          icon={Warning}
          title={intl.formatMessage(messages.alertWarning)}
          description={intl.formatMessage(messages.alertWarningDescriptions)}
        /> */}
      </div>
    </>
  );
};

GradingSettings.propTypes = {
  intl: intlShape.isRequired,
  courseId: PropTypes.string.isRequired,
};

export default injectIntl(GradingSettings);
