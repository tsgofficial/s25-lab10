import React, { useState } from "react";
import "./Quiz.css";
import QuizCore from "../core/QuizCore";
import QuizQuestion from "../core/QuizQuestion";

const quizCore = new QuizCore();

const Quiz: React.FC = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    quizCore.getCurrentQuestion()
  );
  const [score, setScore] = useState(0);

  const handleOptionSelect = (option: string) => {
    setSelectedAnswer(option);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      quizCore.answerQuestion(selectedAnswer);

      if (quizCore.hasNextQuestion()) {
        quizCore.nextQuestion();
        setCurrentQuestion(quizCore.getCurrentQuestion());
        setQuestionIndex(questionIndex + 1);
        setSelectedAnswer(null);
      } else {
        setIsQuizCompleted(true);
        setScore(quizCore.getScore());
      }
    }
  };

  if (isQuizCompleted) {
    return (
      <div className="quiz-container">
        <h2>Quiz Completed</h2>
        <p>
          Final Score: {score} out of {quizCore.getTotalQuestions()}
        </p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h2>Question {questionIndex + 1}</h2>
      {currentQuestion && (
        <>
          <p className="question-text">{currentQuestion.question}</p>
          <ul className="options-list">
            {currentQuestion.options.map((option) => (
              <li
                key={option}
                className={`option ${
                  selectedAnswer === option ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>

          <p className="selected-answer">
            <strong>Selected Answer:</strong>{" "}
            {selectedAnswer ?? "No answer selected"}
          </p>

          <button
            onClick={handleNextQuestion}
            disabled={!selectedAnswer}
            className="next-button"
          >
            Next Question
          </button>
        </>
      )}
    </div>
  );
};

export default Quiz;
