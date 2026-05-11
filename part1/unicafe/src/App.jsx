import { useState } from "react";

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>{text}</button>
);

const updateValue = (value, setValue) => {
  console.log("value", value);
  setValue(value + 1);
};

const handleClick = (value, setValue) => {
  return () => updateValue(value, setValue);
};

const StatisticsLine = ({ text, value }) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={handleClick(good, setGood)} text="good" />
      <Button handleClick={handleClick(neutral, setNeutral)} text="neutral" />
      <Button handleClick={handleClick(bad, setBad)} text="bad" />
      {good + neutral + bad > 0 ? (
        <div>
          <h1>statistics</h1>
          <table>
            <tbody>
              <StatisticsLine text="good" value={good} />
              <StatisticsLine text="neutral" value={neutral} />
              <StatisticsLine text="bad" value={bad} />
              <StatisticsLine text="all" value={good + neutral + bad} />
              <StatisticsLine
                text="average"
                value={(good - bad) / (good + neutral + bad)}
              />
              <StatisticsLine
                text="positive"
                value={(good / (good + neutral + bad)) * 100 + " %"}
              />
            </tbody>
          </table>
        </div>
      ) : (
        <p>no feedback given</p>
      )}
    </div>
  );
};

export default App;
