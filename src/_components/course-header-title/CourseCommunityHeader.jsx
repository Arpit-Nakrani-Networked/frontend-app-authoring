import React from 'react';

export default function CourseCommunityHeader() {
  return (
    <div className="container-fluid community-header">
      <div className="course-content">
        <div className="course-info">
          <img src="https://wellness.mcmaster.ca/app/uploads/2020/01/23-SWNL_Photo-Hearders_72_4.jpg" alt="Course" className="course-image" />
          <span className="course-title">How women lead</span>
        </div>
        <div className="course-actions">
          <button className="back-button">&lt;  Back to Course</button>
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTDJzEaxLN-jGRYYUO65pWu7Q9GXoNt4LUSSA&s" alt="User" className="user-avatar" />
        </div>
      </div>
    </div>
  );
}
