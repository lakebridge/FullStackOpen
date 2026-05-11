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
    </div>
  );
};

export default App;
