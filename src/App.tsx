import React,{useState} from 'react';
import Questions from './components/Questions';
import {fetchQuestion} from './API/API';
import {QuestionState,Difficulty} from './API/API';

import {GlobalStyle, Wrapper}  from './App.styles';
import firebase from './firebase';

export type AnswerObject={
    question: string;
    answer: string ;
    correct: boolean;
    correctAnswer: string;
}


const TOTAL_QUESTION=10;

function App() {

  const messaging = firebase.messaging();
  Notification.requestPermission().then(()=>{
    return messaging.getToken()
  }).then((token)=> {
    
    console.log('This is Token', token);
  })

  const [loading , setLoading] = useState(false);
  const [questions,setQuestions] =useState<QuestionState[]>([]);
  const [number, setNumber] = useState(0);
  const [userAnswers,setUserAnswers]= useState<AnswerObject[]>([]);
  const [score,setScore]=useState(0);
  const [gameOver,setGameOver] = useState(true);

  console.log(questions);
  

  const startQuiz = async()=>{
       setLoading(true);
       setGameOver(false);

        const newQuestions = await fetchQuestion(
          TOTAL_QUESTION,
          Difficulty.EASY
        );
        setQuestions(newQuestions);
        setScore(0);
        setUserAnswers([]);
        setNumber(0);
        setLoading(false);
  }

  const checkAns=(e: React.MouseEvent<HTMLButtonElement>) =>
  {
        if(!gameOver){
          //user ans
          const answer = e.currentTarget.value;
          //Check answer against correct answer
          const correct =questions[number].correct_answer ===answer;
          //add score if answer is correct
          if(correct) setScore((prev) => prev +1);
          //Save answer in the array for user answers 
          const answerObj ={
            question: questions[number].question,
            answer,
            correct,
            correctAnswer: questions[number].correct_answer,
          };
          setUserAnswers(prev => [...prev,answerObj])
        }
  }

  const nextQuestion = () =>{
     //Move on to the next question if not last
     const nextQuestion = number + 1;
     if(nextQuestion === TOTAL_QUESTION)
     {
       setGameOver(true);
     }
     else{
       setNumber(nextQuestion);
     }
  }


  return (
    <>
    <GlobalStyle />
    <Wrapper>
        <h1>Quiz App</h1>

      {gameOver || userAnswers.length === TOTAL_QUESTION ? (
        <button className='start' onClick={startQuiz}>
          Start
        </button>

      ) : null}
       
       {!gameOver ? <p className='score'>Score: {score}</p> : null }
       {loading && <p>Loading Question...</p> }
        {!loading && !gameOver && (
           <Questions 
          questionNo ={number + 1}
          totalQuestion={TOTAL_QUESTION}
          question={questions[number].question}
          answers={questions[number].answers}
          userAnswer={userAnswers ? userAnswers[number] : undefined}
          callback={checkAns } 
        /> 
          
        )}
        
        {!gameOver && !loading && userAnswers.length=== number + 1 &&
          number !== TOTAL_QUESTION - 1 ?
           (<button className='next' onClick={nextQuestion}>
          Next Qestion</button>
              ) : null
        }
        
    </Wrapper>
    
    </>
  );
}

export default App;
