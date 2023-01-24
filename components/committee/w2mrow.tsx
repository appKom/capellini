import React from "react";
import arrayOfLength from "./arrayoflength";
import W2MCell from "./w2mcell";
import styles from "../../styles/committee.module.css";

interface Props {
  fromTime: string;
  toTime: string;
  dates: { date: string; day: string }[];
  header?: boolean;
  mouseDown: number;
  addCell: Function;
  removeCell: Function;
}

function W2MRow(props: Props) {
  return (
    <div style={{ display: "flex" }} className={styles.row}>
      <div className={`${styles.cell_timecell} text-xl font-bold`}>
        {props.fromTime} - {props.toTime}
      </div>
      {props.dates.map((i) => {
        return (
          <W2MCell
            key={i.date.toString()}
            date={i.date}
            fromTime={props.fromTime}
            toTime={props.toTime}
            removeCell={(cell: string[]) => props.removeCell(cell)}
            addCell={(cell: string[]) => props.addCell(cell)}
            mouseDown={props.mouseDown}
          />
        );
      })}
    </div>
  );
}

export default W2MRow;
