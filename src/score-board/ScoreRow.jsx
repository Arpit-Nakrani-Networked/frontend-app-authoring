import React from "react";

export default function ScoreRow({ row }) {
  return (
    <tr className="score-row">
      <td><input type="checkbox" /></td>
      <td className="score-name">
        <img src={row.avatar} alt={row.name} className="score-avatar" />
        <span>
          <span>{row.name}</span><br />
        <span>{row.submissionDate}</span></span>
      </td>
      <td>{row.t1}%</td>
      <td>{row.t2}%</td>
      <td>{row.mid}%</td>
      <td>{row.f1}%</td>
      <td>{row.f2}%</td>
      <td className="score-td">{row.score}</td>
      <td className={`result ${row.result.toLowerCase()}`}><span>{row.result}</span></td>
    </tr>
  );
}
