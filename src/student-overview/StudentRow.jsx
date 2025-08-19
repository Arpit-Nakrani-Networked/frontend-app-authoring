import React from "react";

export default function StudentRow({ student }) {
  return (
    <tr className="student-row">
      <td><input type="checkbox" /></td>
      <td className="student-name">
        <img src={student.avatar} alt={student.name} className="student-avatar" />
        <span>{student.name}</span>
      </td>
      <td>{student.email}</td>
      <td>{student.startDate}</td>
      <td>{student.lastActive}</td>
      <td>
        <span className="_text-xl">{student.progress}%</span>
      </td>
      <td>
        <button className="student-more">⋮</button>
      </td>
    </tr>
  );
}
