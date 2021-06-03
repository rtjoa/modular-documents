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

export function MultipleChoiceModule(props) {
  // Editing: Change question text
  const onQuestionChange = (event) => {
    props.setData({
      ...props.data,
      question: event.target.value,
    });
  };

  // Editing: Change option text
  const onOptionChange = (event,index) => {
    const tempOptions = props.data.options;
    tempOptions[index] = event.target.value;
    props.setData({
      ...props.data, 
      options: tempOptions,
    });
  }

  // Editing: Change which option is correct
  const onAnswerChange = (i) => {
    props.setData({
      ...props.data,
      answer: i,
    });
  }

  // Editing: Add an option
  const onOptionAdd = () => {
    props.setData({
      ...props.data,
      options: [...props.data.options, ''],
    });
  };

  // Editing: Remove an option
  const onOptionRemove = (i) => {
    let answer = props.data.answer;
    if (answer === i) {
      answer = null;
    } else if (answer > i) {
      answer--;
    }
    const options = props.data.options.slice();
    options.splice(i, 1);
    props.setData({
      ...props.data,
      options: options,
      answer: answer,
    })
  }

  // Viewing: Guess an option
  const onOptionChoose = (i) => {
    props.setTempData({
      ...props.tempData,
      choice: i,
    });
  }

  if (props.editing) {
    return (
      <div className="mc-module-edit">
        <textarea onChange={onQuestionChange} value={props.data.question} placeholder="Question"></textarea> <br/>
        <div>
        {props.data.options.map((option, i) => (
            <div key={i}>
                <input
                  onChange={() => onAnswerChange(i)}
                  type="radio"
                  name={"mc-module-edit-" + props.i}
                  value={i}
                  checked={props.data.answer === i}
                />
                <input
                  onChange={(event) => onOptionChange(event, i)}
                  value={option}
                  placeholder={"Answer choice " + (i+1)}
                />
                <button onClick={() => onOptionRemove(i)}>x</button>
            </div>
        ))}
        </div>
        <button onClick={onOptionAdd}>Add Answer Choice</button>
      </div>
    );
  } else {
    return (
      <div className="mc-module-view">
        {}
        <div>
            {props.data.answer === null &&
              <p>(Warning: Correct answer not set.)</p>}
            {props.data.question.split('\n').map((line, i) => (
                <div key={i}>
                  {props.data.question.trim() ?
                  line : <div>Double-click to edit the question prompt.</div>
                  }
                </div>
            ))}
        </div>
            {props.data.options.map((option, i) => (
            <div key={i}>
                <input onChange={() => onOptionChoose(i)} type="radio" id={option} name={"mc-module-view-" + props.i} value={i}/>
                <label htmlFor={option}>{option}</label>
            </div>
            ))}
            {props.tempData.choice !== null && props.tempData.choice === props.data.answer &&
              <p>Correct!</p>}
            {props.tempData.choice !== null && props.tempData.choice !== props.data.answer &&
              <p>Not quite. Try again?</p>}
      </div>
    );
  }
}

MultipleChoiceModule.initData = { question: '' , options: ['', '', ''], answer: null };
MultipleChoiceModule.initTempData = { choice: null };
MultipleChoiceModule.moduleName = 'Multiple Choice';
