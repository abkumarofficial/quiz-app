import React, { useState } from "react";
import { questions } from "../utils/constants";

const QuizApp = () => {
  // Array of questions showing on the page
  const [showingQuestions, setShowingQuestions] = useState(questions);
  // Array of all the wrong answers chosen by the player
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSubmit, setShowSubmit] = useState();
  console.log("rendered", wrongAnswers);

  const handleNext = () => {
    setCurrentQuestion((prev) => {
      if (prev !== questions.length - 1) {
        // Checking if we are at the last question, then show the submit button
        if (prev + 1 === questions.length - 1) setShowSubmit(true);
        return prev + 1;
      }
      // If we are at the last question then don't change the index
      return prev;
    });
  };

  const handleOnSelect = (option) => {
    // Pushing wrong answers into a array and keeping track of them
    if (!option.isCorrect) {
      setWrongAnswers([...wrongAnswers, showingQuestions[currentQuestion]]);
    }
  };

  return (
    <div className="container">
      <div className="question">
        <div>{showingQuestions[currentQuestion].question}</div>
      </div>
      <div className="options">
        {showingQuestions[currentQuestion].options.map((option, index) => {
          return (
            <div
              className="option"
              key={index}
              onClick={() => handleOnSelect(option)}
            >
              {option.option}
            </div>
          );
        })}
        {!showSubmit && (
          <button type="button" onClick={handleNext}>
            Next
          </button>
        )}
        {showSubmit && <button type="button">Submit</button>}
      </div>
    </div>
  );
};

export default QuizApp;
