import React from 'react';

/*
  TODO:
    Update the `VIEW` when submitting the form
    Put a warning of some sort if a correctAnswer is not chosen when going from edit -> view
    Complete the CheckAnswer function and implementation

  NOTES:
    when changing from view -> edit and vice versa, if the quiz has already been attempted, 
      the answerChoice variable does not revert itself to -1
*/

export function QuizModule(props) {
  //For while editing
  const onQuestionChange = (event) => {
    props.setData({
      ...props.data,
      question: event.target.value,
    });
  };

  const onOptionChange = (event,index) => {
    const tempOptions = props.data.options
    tempOptions[index] = event.target.value
    props.setData({
      ...props.data, 
      options: tempOptions,})
  }

  const onCorrectChoiceClick = (event) =>{
    props.setData({
      ...props.data, 
      correctAnswer: event.target.value,
      answerChoice: -1,
    })
  }

  const onOptionAddClick = () => {
    props.setData({
      ...props.data,
      options: [...props.data.options, '']
    })
  }
  
  //For while viewing
  const onAnswerChoose = (event) =>{
    props.setData({
      ...props.data,
      answerChoice: event.target.value,
    })
  }

  const checkAnswer = (event) =>{
    event.preventDefault()
    if(props.data.correctAnswer == props.data.answerChoice)
      console.log("true")
    else
      console.log("false")
  }

  if (props.editing) {
      console.log(props.data)
    return (
      <div className="quiz-module-edit">
        <textarea onChange={onQuestionChange} value={props.data.question} placeholder="Question"></textarea> <br/>
        <div>
        {props.data.options.map((option, i) => (
            <div key={i}>
                <input onChange={onCorrectChoiceClick} type = "radio" name={"QuizModuleEdit" + props.i} value={i}/>
                <textarea  onChange={(event) => onOptionChange(event, i)} value={option} placeholder={"Answer choice " + (i+1)}></textarea>
            </div>
        ))}
        </div>
        <button onClick={onOptionAddClick}>Add Answer Choice</button>
      </div>
    );
  } else {
      console.log(props.data)
    return (
      <div className="quiz-module-view">
        <div>
            {props.data.question.split('\n').map((line, i) => (
                <div key={i}>{props.data.question.trim() ? line : <EmptyText/>}</div>
            ))}
        </div>
        <form onSubmit={checkAnswer}>
            {props.data.options.map((option, i) => (
            <div key={i}>
                <input onChange={onAnswerChoose} type="radio" id={option} name={"QuizModuleView" + props.i} value={i}/>
                <label htmlFor={option}>{option}</label>
            </div>
            ))}
            <input type="submit" value="Submit"/>
        </form>
      </div>
    );
  }
}

function EmptyText(){
  return(
    <div>Click &quot;Edit&quot; to change this text</div>
  )
}

QuizModule.initData = { question: '' , options: [''], correctAnswer: -1, answerChoice: -1};
QuizModule.moduleName = 'Quiz';
