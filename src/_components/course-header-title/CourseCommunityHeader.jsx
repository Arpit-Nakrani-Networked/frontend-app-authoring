import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { NETWORKED_FRONTEND_URL } from '../../helper/constants';
import { HttpMethod, HttpWrapper } from '../../helper/httpWrapper';
import './css/CourseHeader.scss'

const DEFAULT_COMMUNITY_IMAGE = 'https://wellness.mcmaster.ca/app/uploads/2020/01/23-SWNL_Photo-Hearders_72_4.jpg';
const DEFAULT_COMMUNITY_NAME = 'How women lead';
const DEFAULT_USER_PROFILE = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDJzEaxLN-jGRYYUO65pWu7Q9GXoNt4LUSSA&s';

export default function CourseCommunityHeader() {
  const { courseId } = useParams();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  // State initialized from localStorage or fallback default
  const [isLoading, setIsLoading] = useState(
    false,
  );
  const [communityImage, setCommunityImage] = useState(
    localStorage.getItem('communityImage'),
  );
  const [communityName, setCommunityName] = useState(
    localStorage.getItem('communityName'),
  );
  const [userProfile, setUserProfile] = useState(
    user?.image?.url
  );
  const [username, setUserName] = useState(
    user?.name,
  );

  const handleBackClick = () => {
    window.location.href = `${NETWORKED_FRONTEND_URL}/courses/${courseId}`;
  };

  const getDefaultCommunityImage = () => {
    const getInitials = (name) => {
      if (!name) return '-';
      return name.trim().substring(0, 2).toUpperCase();
    };

    return communityImage ? (
      <img src={communityImage} alt="Course" className="course-image" />
    ) : (
      <div className="imageFrame-asm community-image-wrapper">
        <div className="textImage text-center">{getInitials(communityName)}</div>
      </div>
    );
  };

  const getDefaultUserImage = () => {
    const getInitials = (name) => {
      if (!name) return '-';
      return name.trim().substring(0, 2).toUpperCase();
    };

    return userProfile ? (
      <img src={userProfile} alt="Course" className="course-image" />
    ) : (
      <div className="imageFrame-asm profile-image-wrapper">
        <div className="textImage text-center">{getInitials(username)}</div>
      </div>
    );
  };

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const user = await HttpWrapper.call(
        HttpMethod.GET,
        '/global/open-edx/header-meta',
        {},
        undefined,
      );

      const newCommunityName = user?.community?.name;
      const newCommunityImage = user?.community?.image?.url;
      const newUser = user?.user || "NE";

      // Update localStorage
      localStorage.setItem('communityName', newCommunityName);
      localStorage.setItem('communityImage', newCommunityImage);
      localStorage.setItem('user', newUser);

      // Update state
      setCommunityName(newCommunityName);
      setCommunityImage(newCommunityImage);
      setUserProfile(newUserProfile);
      setUserName(newUser?.name);
    } catch (error) {
       setCommunityName('');
      setCommunityImage('');
      setUserProfile('');
      setUserName('');
      console.error('❌ Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  return !isLoading && (
    <div className="container-fluid community-header">
      <div className="course-content">
        <div className="course-info">
          {getDefaultCommunityImage()}
          <span className="course-title">{communityName || "-"}</span>
        </div>
        <div className="course-actions">
          <button className="back-button" onClick={handleBackClick}>
            &lt; Back to Course
          </button>
          {getDefaultUserImage()}
        </div>
      </div>
    </div>
  );
}
