/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable react/jsx-no-comment-textnodes */
import React, { useState } from 'react';
import { sortDateFunc, sortDateFuncReverse } from 'src/utils/utils';
import { MAIN_COLOR } from 'src/utils/const';
import RunRow from './RunRow';
import styles from './style.module.scss';

const RunTable = ({
  // eslint-disable-next-line react/prop-types
  runs,
  // eslint-disable-next-line react/prop-types
  locateActivity,
  // eslint-disable-next-line react/prop-types
  setActivity,
  // eslint-disable-next-line react/prop-types
  runIndex,
  // eslint-disable-next-line react/prop-types
  setRunIndex,
}) => {
  const [sortFuncInfo, setSortFuncInfo] = useState('');
  // TODO refactor?
  const sortKMFunc = (a, b) => (sortFuncInfo === 'KM' ? a.distance - b.distance : b.distance - a.distance);
  const sortPaceFunc = (a, b) => (sortFuncInfo === 'Pace'
    ? a.average_speed - b.average_speed
    : b.average_speed - a.average_speed);
  const sortBPMFunc = (a, b) => (sortFuncInfo === 'BPM'
    ? a.average_heartrate - b.average_heartrate
    : b.average_heartrate - a.average_heartrate);
  const sortDateFuncClick = sortFuncInfo === 'Date' ? sortDateFunc : sortDateFuncReverse;
  const sortFuncMap = new Map([
    ['KM', sortKMFunc],
    ['Pace', sortPaceFunc],
    ['BPM', sortBPMFunc],
    ['Date', sortDateFuncClick],
  ]);
  const handleClick = (e) => {
    const funcName = e.target.innerHTML;
    if (sortFuncInfo === funcName) {
      setSortFuncInfo('');
    } else {
      setSortFuncInfo(funcName);
    }
    const f = sortFuncMap.get(e.target.innerHTML);
    if (runIndex !== -1) {
      const el = document.getElementsByClassName(styles.runRow);
      el[runIndex].style.color = MAIN_COLOR;
    }
    // eslint-disable-next-line react/prop-types
    setActivity(runs.sort(f));
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.runTable} cellSpacing="0" cellPadding="0">
        <thead>
          <tr>
            <th />
            {Array.from(sortFuncMap.keys()).map((k) => (
              <th key={k} onClick={(e) => handleClick(e)}>
                {k}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          // eslint-disable-next-line react/prop-types
          // eslint-disable-next-line react/prop-types
          {runs.map((run) => (
            <RunRow
              runs={runs}
              run={run}
              key={run.run_id}
              locateActivity={locateActivity}
              runIndex={runIndex}
              setRunIndex={setRunIndex}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RunTable;
