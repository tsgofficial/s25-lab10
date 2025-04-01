import React, { useState, useEffect } from "react";
import "./Quiz.css";
import QuizCore from "../core/QuizCore";
import QuizQuestion from "../core/QuizQuestion";

interface QuizState {
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  score: number;
  isQuizCompleted: boolean;
  currentQuestion: QuizQuestion | null;
}

const Quiz: React.FC = () => {
  const quizCore = new QuizCore();
  const [state, setState] = useState<QuizState>({
    currentQuestionIndex: 0,
    selectedAnswer: null,
    score: 0,
    isQuizCompleted: false,
    currentQuestion: quizCore.getCurrentQuestion(),
  });

  useEffect(() => {
    // Check if the quiz has been completed
    if (!quizCore.hasNextQuestion()) {
      setState((prevState) => ({
        ...prevState,
        isQuizCompleted: true,
        score: quizCore.getScore(), // Calculate the final score
      }));
    }
  }, [state.currentQuestionIndex, quizCore]);

  const handleOptionSelect = (option: string): void => {
    setState((prevState) => ({
      ...prevState,
      selectedAnswer: option,
    }));
  };

  const handleButtonClick = (): void => {
    if (state.selectedAnswer) {
      // Answer the current question
      quizCore.answerQuestion(state.selectedAnswer);

      // Move to the next question only if there is a next question
      if (quizCore.hasNextQuestion()) {
        quizCore.nextQuestion();
        // console.log("Next Question Index:", quizCore.getCurrentQuestionIndex());
        quizCore.getCurrentQuestion();
        setState((prevState) => ({
          ...prevState,
          currentQuestionIndex: prevState.currentQuestionIndex + 1,
          selectedAnswer: null, // Reset the selected answer for the next question
          currentQuestion: quizCore.getCurrentQuestion(), // Update the current question
        }));
      }
    }
  };

  const { currentQuestion, selectedAnswer, score, isQuizCompleted } = state;

  if (isQuizCompleted) {
    return (
      <div>
        <h2>Quiz Completed</h2>
        <p>
          Final Score: {score} out of {quizCore.getTotalQuestions()}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2>Quiz Question:</h2>
      {currentQuestion && (
        <>
          <p>{currentQuestion.question}</p>
          <h3>Answer Options:</h3>
          <ul>
            {currentQuestion.options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={selectedAnswer === option ? "selected" : ""}
              >
                {option}
              </li>
            ))}
          </ul>

          <h3>Selected Answer:</h3>
          <p>{selectedAnswer ?? "No answer selected"}</p>

          <button
            onClick={handleButtonClick}
            disabled={selectedAnswer === null} // Disable the button if no answer is selected
          >
            Next Question
          </button>
        </>
      )}
    </div>
  );
};

export default Quiz;
