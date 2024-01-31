
import React from "react";
import styles from "./OptionForm.module.css";

const PollQuestionInput = ({ id, pollQuestion, onChange }) => (
  <div className={styles.pollQuestionInput}>
    <input
      className={styles.dashboard_pollquestion}
      type="text"
      placeholder=" Poll Question"
      value={pollQuestion}
      onChange={(e) => onChange(id, e.target.value)}
    />
  </div>
);

export default PollQuestionInput;
