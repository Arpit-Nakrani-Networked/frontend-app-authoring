import React from "react";

export default function ScoreRow({ row }) {
  return (
    <tr className="score-row">
      {row.map((cell, index) => (<td>{cell}</td>))}
    </tr>
  );
}
