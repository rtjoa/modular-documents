import React from 'react';

import '../styles/MultipleChoiceModule.scss';

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
                <div className="option-container">
                  <input
                    onChange={() => onAnswerChange(i)}
                    type="radio"
                    name={"mc-module-edit-" + props.i}
                    value={i}
                    checked={props.data.answer === i}
                  />
                  <span className="option-text-container">
                    <input
                      className="option-text"
                      onChange={(event) => onOptionChange(event, i)}
                      value={option}
                      placeholder={"Answer choice " + (i+1)}
                    />
                    <button onClick={() => onOptionRemove(i)} className='delete-option'>&#10005;</button>
                  </span>
                </div>
            </div>
        ))}
        </div>
        <button onClick={onOptionAdd} className='add-option'>Add Answer Choice</button>
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
                  <input
                    onChange={() => onOptionChoose(i)}
                    type="radio"
                    id={`mc-module-view-${props.i}-${i}`}
                    name={`mc-module-view-${props.i}`} value={i}
                  />
                  <label htmlFor={`mc-module-view-${props.i}-${i}`}>
                    {option}
                  </label>
              </div>
            ))}
            {props.tempData.choice === null &&
              <p className='prompt'><em>Select an answer...</em></p>}
            {props.tempData.choice !== null && props.tempData.choice === props.data.answer &&
              <p className='correct'>Correct!</p>}
            {props.tempData.choice !== null && props.tempData.choice !== props.data.answer &&
              <p>Not quite. Try again?</p>}
      </div>
    );
  }
}

MultipleChoiceModule.initData = { question: '' , options: ['', '', ''], answer: null };
MultipleChoiceModule.initTempData = { choice: null };
MultipleChoiceModule.moduleName = 'Multiple Choice';
