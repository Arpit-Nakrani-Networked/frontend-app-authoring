import React from "react";
import "./ToggleItem.scss";
import { Form } from "@openedx/paragon";

const ToggleItem = ({ label, description, checked, onChange,children,borderless=false }) => {
  return (
    <div className={`toggleItem${borderless ? ' borderless' : ''}`}>
      {/* <label className="switch"> */}
      {/* <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="slider"></span> */}
      <Form.Switch checked={checked} onChange={onChange} label="Allow Check Answer" />
      {/* </label> */}
      <div className="content flex-1">
        <p className="label">{label}</p>
        <p className="description">{description}</p>
        {children}
      </div>
    </div>
  );
};

export default ToggleItem;
