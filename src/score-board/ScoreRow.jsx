import React from "react";

export default function ScoreRow({ row, columns }) {
  return (
    <tr className="score-row">
      {columns.map((col, index) => (
        <td key={index}>{row[col.accessor]}</td>
      ))}
    </tr>
  );
}
