import { useState } from "react";

const SelectButton = ({ onClick, text }) => {
  console.log("onClick", onClick);
  console.log("text", text);
  return <button onClick={onClick}>{text}</button>;
};

const VoteButton = ({ onClick, text }) => {
  return <button onClick={onClick}>{text}</button>;
};

const HandleClick = (setSelected, anecdotes) => {
  const randomIndex = Math.floor(Math.random() * anecdotes.length);
  console.log("randomIndex", randomIndex);
  setSelected(randomIndex);
};

const GetMostVotedAnecdote = (anecdotes, votes) => {
  const maxVotes = Math.max(...votes);
  const mostVotedIndex = votes.indexOf(maxVotes);
  return anecdotes[mostVotedIndex];
};

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];

  const [selected, setSelected] = useState(0);
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0));

  return (
    <div>
      <div>{anecdotes[selected]}</div>
      <SelectButton
        onClick={() => HandleClick(setSelected, anecdotes)}
        text="next anecdote"
      />
      <p> has {votes[selected]} votes </p>
      <VoteButton
        onClick={() => {
          const copyVotes = [...votes];
          copyVotes[selected] += 1;
          console.log("Selected anecdote index:", selected);
          console.log("Votes before update:", votes);
          console.log("Votes after update:", copyVotes);
          setVotes(copyVotes);
        }}
        text="vote"
      />

      <h1>Anecdote with most votes</h1>
      <div>
        {GetMostVotedAnecdote(anecdotes, votes)} has {Math.max(...votes)} votes
      </div>
    </div>
  );
};

export default App;
