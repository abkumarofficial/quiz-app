import React, { useCallback, useEffect, useState } from "react";
import { questions } from "../utils/constants";

const QuizApp = () => {
  // Array of questions showing on the page
  const [showingQuestions, setShowingQuestions] = useState(questions);
  // Array of all the wrong answers given by the player
  const [wrongAnswers, setWrongAnswers] = useState(new Set());
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
  // console.log("wrongAnswers", wrongAnswers);
  // wrongAnswers.forEach((value) => console.log(value));
  console.log("updated", showingQuestions);

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

    if (
      option.isCorrect &&
      wrongAnswers.has(showingQuestions[currentQuestion])
    ) {
      removeWrongAnswer(showingQuestions[currentQuestion]);
    }
    if (
      !option.isCorrect &&
      !wrongAnswers.has(showingQuestions[currentQuestion])
    ) {
      addWrongAnswer(showingQuestions[currentQuestion]);
    }
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

  // Function to handle adding wrong answers
  const addWrongAnswer = (answer) => {
    const updatedWrongAnswers = new Set(wrongAnswers);
    updatedWrongAnswers.add(answer);
    setWrongAnswers(updatedWrongAnswers);
  };

  // Function to handle removing wrong answers
  const removeWrongAnswer = useCallback(
    (answer) => {
      const updatedWrongAnswers = new Set(wrongAnswers);
      updatedWrongAnswers.delete(answer);
      setWrongAnswers(updatedWrongAnswers);
    },
    [wrongAnswers]
  );

  useEffect(() => {
    if (
      selectedOption[currentQuestion].find((ele) => ele === true) === undefined
    ) {
      const updatedQuestion = [...showingQuestions];
      updatedQuestion[currentQuestion]["attempted"] = false;
      updatedQuestion[currentQuestion]["correct"] = false;
      setShowingQuestions(updatedQuestion);
    }

    // when unselecting a option for a question,  if this question is present in our wrongAnswers Set, remove it
    if (
      selectedOption[currentQuestion].find((ele) => ele === true) ===
        undefined &&
      wrongAnswers.has(showingQuestions[currentQuestion])
    ) {
      removeWrongAnswer(showingQuestions[currentQuestion]);
    }
  }, [selectedOption]);

  useEffect(() => {
    // const updatedQuestions = [...showingQuestions];
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
        <div className="question">
          <div>{showingQuestions[currentQuestion].question}</div>
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
            <div>
              <button
                type="button"
                onClick={() => handleChangeQuestion(currentQuestion - 1)}
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => handleChangeQuestion(currentQuestion + 1)}
              >
                Next
              </button>
            </div>
          )}
          {showSubmit && (
            <div>
              <button
                type="button"
                onClick={() => handleChangeQuestion(currentQuestion - 1)}
              >
                Previous
              </button>
              <button type="button" onClick={handleSubmit}>
                Submit
              </button>
            </div>
          )}
        </div>
      )}
      {submitted && (
        <ul className="scoreboard">
          <li>Total Number of Questions: {showingQuestions.length}</li>
          <li>
            Number of Questions Attempted:
            {showingQuestions.filter((obj) => obj.attempted).length}
          </li>
          <li>
            Did Not Attempt:
            {showingQuestions.filter((obj) => !obj.attempted).length}
          </li>
          <li>
            Correctly Answered:
            {showingQuestions.filter((obj) => obj.correct).length}
          </li>
          <li>
            Wrongly Answered:
            {
              showingQuestions.filter((obj) => obj.attempted && !obj.correct)
                .length
            }
          </li>
          <li>
            Score:
            {showingQuestions.filter((obj) => obj.correct).length} /
            {showingQuestions.length}
          </li>
        </ul>
      )}
      {submitted && (
        <div className="retry-quiz">
          <button type="button" onClick={() => handleResetQuiz(false)}>
            Retry Quiz
          </button>
          <button type="button" onClick={() => handleResetQuiz(true)}>
            Retry only Not Attemped and Wrongly answered Questions
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizApp;
