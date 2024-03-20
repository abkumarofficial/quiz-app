import React, { useEffect, useState } from "react";
import { questions } from "../utils/constants";

const QuizApp = () => {
  // List of questions showing on the page
  const [showingQuestions, setShowingQuestions] = useState(
    JSON.parse(JSON.stringify(questions))
  );
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    Array.from(
      {
        length: showingQuestions.length,
      },
      () =>
        Array.from(
          {
            length: showingQuestions[currentQuestion]?.options.length || 4,
          },
          () => false
        )
    )
  );

  console.log("updated", showingQuestions);
  console.log("questions", questions);
  const handleChangeQuestion = (changeQuestion) => {
    if (changeQuestion <= showingQuestions.length - 1 && changeQuestion >= 0) {
      // Checking if we are at the last question, then show the submit button
      if (changeQuestion === showingQuestions.length - 1) {
        setShowSubmit(true);
      } else setShowSubmit(false);
      setCurrentQuestion(changeQuestion);
    }
  };

  const handleOnSelect = (option, selectedIndex) => {
    const updatedSelectedList = selectedOption[currentQuestion].map(
      (ele, index) => {
        if (selectedIndex === index) return !ele;
        return false;
      }
    );
    const updatedSelectedOptions = [...selectedOption];
    updatedSelectedOptions[currentQuestion] = updatedSelectedList;
    setSelectedOption(updatedSelectedOptions);

    // keeping track of wrong answers in a Set in case the player wants to review the incorrect choices they've made.
    const updatedQuestion = [...showingQuestions];
    updatedQuestion[currentQuestion]["attempted"] = true;
    updatedQuestion[currentQuestion]["correct"] = option.isCorrect
      ? option.isCorrect
      : false;
    setShowingQuestions(updatedQuestion);
  };

  const handleSubmit = () => {
    setSubmitted(!submitted);
    console.log(showingQuestions);
  };

  const handleResetQuiz = (resetWithWrongAnswers = false) => {
    if (!resetWithWrongAnswers) {
      console.log("nope");
      const updatedQuestions = questions.map((ele) => {
        return {
          ...ele,
          attempted: ele["attempted"] ? ele["attempted"] : false,
          correct: ele["correct"] ? ele["correct"] : false,
        };
      });
      setShowingQuestions(updatedQuestions);
    } else {
      const updatedQuestions = showingQuestions
        .filter((question) => !question.attempted || !question.correct)
        .map((question) => {
          return {
            ...question,
            attempted: false,
            correct: false,
          };
        });
      setShowingQuestions(updatedQuestions);
    }
    setCurrentQuestion(0);
    setShowSubmit(false);
    setSubmitted(false);
    setSelectedOption(
      Array.from(
        {
          length: showingQuestions.length,
        },
        () =>
          Array.from(
            {
              length: showingQuestions[currentQuestion].options.length,
            },
            () => false
          )
      )
    );
  };

  useEffect(() => {
    if (
      selectedOption[currentQuestion].find((ele) => ele === true) === undefined
    ) {
      const updatedQuestion = [...showingQuestions];
      updatedQuestion[currentQuestion]["attempted"] = false;
      updatedQuestion[currentQuestion]["correct"] = false;
      setShowingQuestions(updatedQuestion);
    }
  }, [selectedOption]);

  useEffect(() => {
    const updatedQuestions = showingQuestions.map((ele) => {
      return {
        ...ele,
        attempted: ele["attempted"] ? ele["attempted"] : false,
        correct: ele["correct"] ? ele["correct"] : false,
      };
    });
    setShowingQuestions(updatedQuestions);
  }, []);

  return (
    <div className="container">
      {!submitted && (
        <div className="questions">
          <p className="question-number">
            Question {currentQuestion + 1} / {showingQuestions.length}
          </p>
          <span className="question">
            {showingQuestions[currentQuestion].question}
          </span>
        </div>
      )}
      {!submitted && (
        <div className="options">
          {showingQuestions[currentQuestion].options.map((option, index) => {
            return (
              <div
                className={`option ${
                  selectedOption[currentQuestion][index] ? "selected" : ""
                }`}
                key={index}
                onClick={() => handleOnSelect(option, index)}
              >
                {option.option}
              </div>
            );
          })}
          {!showSubmit && (
            <div className="change-question">
              <button
                type="button"
                onClick={() => handleChangeQuestion(currentQuestion - 1)}
              >
                ◀
              </button>
              <button
                type="button"
                onClick={() => handleChangeQuestion(currentQuestion + 1)}
              >
                ▶
              </button>
            </div>
          )}
          {showSubmit && (
            <div className="change-question">
              <button
                type="button"
                onClick={() => handleChangeQuestion(currentQuestion - 1)}
              >
                ◀
              </button>
              <button type="button" className="submit" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          )}
        </div>
      )}
      {submitted && (
        <div className="scoreboard">
          <p>Scorecard</p>
          <ul>
            <li>Total Number of Questions: {showingQuestions.length}</li>
            <li>
              Number of Questions Attempted:{" "}
              {showingQuestions.filter((obj) => obj.attempted).length}
            </li>
            <li>
              Questions Not Attempted:{" "}
              {showingQuestions.filter((obj) => !obj.attempted).length}
            </li>
            <li>
              Correct Answers:{" "}
              {showingQuestions.filter((obj) => obj.correct).length}
            </li>
            <li>
              Incorrect Answers:{" "}
              {
                showingQuestions.filter((obj) => obj.attempted && !obj.correct)
                  .length
              }
            </li>
            <li>
              Score: {showingQuestions.filter((obj) => obj.correct).length} /
              {showingQuestions.length}
            </li>
          </ul>
        </div>
      )}
      {submitted && (
        <div className="retry-quiz">
          <button type="button" onClick={() => handleResetQuiz(false)}>
            Play Again
          </button>
          <div className="retry-wrong-container">
            <p>
              Do you want to retry questions that were not attempted or were
              answered incorrectly ?
            </p>
            <button
              type="button"
              className="retry-wrong-button"
              onClick={() => handleResetQuiz(true)}
            >
              YES
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
