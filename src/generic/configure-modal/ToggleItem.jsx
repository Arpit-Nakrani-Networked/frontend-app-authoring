import React from "react";
import "./ToggleItem.scss";
import { Form } from "@openedx/paragon";

const ToggleItem = ({ label, description, checked, onChange, children, borderless = false, style = {} }) => {
  return (
    <div className={`toggleItem${borderless ? ' borderless' : ''}`} style={style}>
      {/* <label className="switch"> */}
      {/* <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
        />
        <span className="slider"></span> */}
      {/* </label> */}
      <Form.Switch checked={checked} onChange={onChange} label={label} />
      <div className="content flex-1">
        <p className="label">{label}</p>
        <p className="description">{description}</p>
        {children}
      </div>
    </div>
  );
};

export const ToggleItemUI = ({ label, description, checked, onChange, children, borderless = false, style = {} }) => {
  return (
    <div className={`toggleItem${borderless ? ' borderless' : ''}`} style={style}>
      <div className="flex-1 d-flex justify-content-between align-items-start">
        <div>
          <p className="label">{label}</p>
          <p className="description">{description}</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default ToggleItem;
