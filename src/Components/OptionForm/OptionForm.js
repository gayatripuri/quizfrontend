// OptionForm.js
import React, { useState } from "react";
import styles from "./OptionForm.module.css";
import TimerSection from "./TimerSection";
import PollQuestionInput from "./PollQuestionInput";
import OptionTypeSection from "./OptionTypeSection";
import RadioButtonsContainer from "./RadioButtonsContainer";
import CongratsPopup from "../CongratsPopup/CongratsPopup";
import BASEURL from "../../constant/baseurl";
const OptionForm = ({
  onClose,
  slctdQzType,
  createdQuizId,
  onLinkCopy,
  
}) => {
  const [options, setOptions] = useState([
    {
      id: Date.now(),
      pollQuestion: "",
      optionType: "text",
      optionsList: ["", "", "", ""],
      imgUrls: ["", "", "", ""],
      correctOptionIndex: "",
    },
  ]);
 // console.log("create quiz here", createdQuizId);
  const [selectedQuestion, setSelectedQuestion] = useState(options[0].id);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questionButtons, setQuestionButtons] = useState([1]);
  const [quizCreated, setQuizCreated] = useState(false);
  const [timer, setTimer] = useState(-1);
  const [quizLink, setQuizLink] = useState('');
  const [selectedQuizType] = useState(slctdQzType);
  const [ setOptionTypes] = useState(
    options.map((option) => option.optionType)
  );

  const handleCreate = async () => {
    const token = localStorage.getItem("token");
    //console.log("Access Token:", token);
    try {
     
      const response = await fetch(
        `${BASEURL}/quiz/addQuestionsToQuiz`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify({
            quizId: createdQuizId,
            questions: options.map((option) => ({
              pollQuestion: option.pollQuestion,
              optionType: option.optionType,
              optionsList: option.optionsList,
              imgUrls: option.imgUrls,
              correctOptionIndex: option.correctOptionIndex,
            })),
            timer: timer,
          }),
        }
      );

      if (response.ok) {
        // Questions added successfully
        const updatedQuiz = await response.json();
        setQuizLink(updatedQuiz.shareableLink)
       // console.log("Response from server:", updatedQuiz.shareableLink);
        //console.log("ID in updatedQuiz:", updatedQuiz.id);
        setQuizCreated(true);
        // Set quizCreated to true
        // Display a success message or navigate to the next step
        // Generate and set the quiz link
        const link = `http://yourwebsite.com/quiz/${updatedQuiz.id}`;
        onLinkCopy(link);
      } else {
        // Handle error cases
        console.error("Error adding questions to quiz:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding questions to quiz:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleCreateOption = () => {
    if (options.length < 5) {
      const newOption = {
        id: Date.now(),
        pollQuestion: "",
        optionType: "text",
        optionsList: ["", "", "", ""],
        imgUrls: ["", "", "", ""],
        correctOptionIndex: "",
      };

      setOptions((prevOptions) => [...prevOptions, newOption]);
      setCurrentQuestion(options.length);
      setSelectedQuestion(newOption.id);

      if (options.length + 1 <= 5) {
        setQuestionButtons((prevButtons) => [
          ...prevButtons,
          prevButtons.length + 1,
        ]);
      }
    }
  };

  const handlePollQuestionChange = (id, value) => {
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, pollQuestion: value } : option
      )
    );
  };

  const handleOptionTypeChange = (id, value) => {
    setOptionTypes((prevOptionTypes) =>
      prevOptionTypes.map((type, index) =>
        index === currentQuestion ? value : type
      )
    );
    setOptions((prevOptions) =>
      prevOptions.map((option) =>
        option.id === id ? { ...option, optionType: value } : option
      )
    );
  };

  const handleOptionInputChange = (id, index, optType, value, crrctId) => {
   // console.log(id, index, optType, value, crrctId);
    if (optType === "text_with_imgurl") {
      console.log("index:", value, index);
      setOptions((prevOptions) => {
        console.log("previous opt", prevOptions);
        return prevOptions.map((option) => {
          if (option.id === id) {
            const updatedOptionsList = [...option.optionsList];
            const updatedImgList = [...option.imgUrls];
            if (index % 2 === 0) {
              const newIndex = Math.floor(index / 2);
              updatedOptionsList[newIndex] = [...updatedOptionsList[newIndex]];
              updatedOptionsList[newIndex] = value;
              return { ...option, optionsList: updatedOptionsList };
            } else {
              const newIndex = Math.floor(index / 2);
              updatedImgList[newIndex] = [...updatedImgList[newIndex]];
              updatedImgList[newIndex] = value;
              return { ...option, imgUrls: updatedImgList };
            }
          }
          return option;
        });
      });
    } else {
      setOptions((prevOptions) => {
       // console.log("previous opt", prevOptions);
        return prevOptions.map((option) => {
          if (option.id === id) {
            const updatedOptionsList = [...option.optionsList];
            updatedOptionsList[index] = [...updatedOptionsList[index]];
            updatedOptionsList[index] = value;
            return { ...option, optionsList: updatedOptionsList };
          }
          return option;
        });
      });
    }
  };
 // console.log(options, "optionsData");

  const handleCorrectOptionChange = (id, index) => {
    //console.log("Handling correct option change:", id, index);
    setOptions((prevOptions) =>
      prevOptions.map((option, i) =>
        i === currentQuestion
          ? { ...option, correctOptionIndex: index }
          : option
      )
    );
  };

  const handleTimerChange = (value) => {
    setTimer(value);
  };

  const handleCloseButtonClick = (buttonNumber) => {
    setQuestionButtons((prevButtons) =>
      prevButtons.filter((btn) => btn !== buttonNumber)
    );
    setOptions((prevOptions) =>
      prevOptions.filter((opt, index) => index !== buttonNumber - 1)
    );
    if (currentQuestion >= buttonNumber) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleQuestionButtonClick = (questionNumber) => {
    setCurrentQuestion(questionNumber);
    setSelectedQuestion(options[questionNumber].id);
  };

  return (
    <div className={styles.optionForm}>
      {quizCreated ? (
        <CongratsPopup
          onClose={() => setQuizCreated(false)}
          quizLink={quizLink}
        />
      ) : (
        <>
          {questionButtons.map((buttonNumber, index) => (
            <button
              key={buttonNumber}
              onClick={() => handleQuestionButtonClick(buttonNumber - 1)}
            >
              {buttonNumber}
              {index > 0 && (
                <span
                  className={styles.closeButton}
                  onClick={() => handleCloseButtonClick(buttonNumber)}
                >
                  &#10006;
                </span>
              )}
            </button>
          ))}

          <span
            onClick={handleCreateOption}
            className={styles.addOptionBtn}
            style={{ display: options.length < 5 ? "inline-block" : "none" }}
          >
            +
          </span>

          {options.map((option, index) => (
            <div
              key={option.id}
              className={styles.optionContainer}
              style={{
                display: selectedQuestion === option.id ? "block" : "none",
              }}
            >
              <PollQuestionInput
                id={option.id}
                pollQuestion={option.pollQuestion}
                onChange={handlePollQuestionChange}
              />
              <OptionTypeSection
                id={option.id}
                optionType={option.optionType}
                onChange={handleOptionTypeChange}
                index={index}
              />

              <RadioButtonsContainer
                id={option.id}
                optionType={option.optionType}
                optionsList={option.optionsList}
                correctOptionIndex={option.correctOptionIndex}
                onChange={handleOptionInputChange}
                onCorrectOptionChange={handleCorrectOptionChange}
              />
              {selectedQuizType === "qa" ? (
                <TimerSection onTimerChange={handleTimerChange} />
              ) : null}
            </div>
          ))}

          <div className={styles.btn_container}>
            <button onClick={handleCancel} className={styles.cancel_btn}>
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className={styles.confirm_create_quiz_btn}
            >
              Create Quiz
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default OptionForm;
