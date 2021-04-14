import React from 'react'
import {AnswerObject} from '../App';

import { Wrapper, ButtonWrapper } from './QuestionCard.styles';

type Props ={
    question: string;
    answers: string[];
    callback: (e: React.MouseEvent<HTMLButtonElement>) => void;
    userAnswer : AnswerObject | undefined;
    questionNo: number;
    totalQuestion: number;
}

const Questions: React.FC<Props> = ({question,answers,callback,userAnswer,questionNo,totalQuestion}) => {
    return (
        <Wrapper>
          <p className='number'>
              Question: {questionNo} / {totalQuestion}
          </p>

          <p dangerouslySetInnerHTML={{__html: question}}/>
       <div>
           {answers.map(answer =>(
              <ButtonWrapper
              key={answer}
              correct={userAnswer?.correctAnswer === answer}
              userClicked={userAnswer?.answer === answer}
            >


                   <button disabled={!!userAnswer} value={answer} onClick={callback}> 
                        <span dangerouslySetInnerHTML={{__html: answer}} />
                   </button>
               </ButtonWrapper>
           ))}
       </div>
        </Wrapper>
    )
}

export default Questions
