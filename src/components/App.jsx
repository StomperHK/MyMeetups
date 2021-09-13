import {Fragment, useState, useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';

import firestoreDatabase from '../firestore';
import { collection, getDocs } from "firebase/firestore";

import styleClasses from '../scss/App.module.scss';
import MainHeader from './MainHeader';
import Meetups from '../pages/Meetups';
import Bookmarks from '../pages/Bookmarks';
import FeedbackModal from './FeedbackModal';
import MeetupCreatorModal from '../components/MeetupCreatorModal';

function App() {
  const [anchorToGetUnderlinedState, changeAnchorToGetUnderlinedState] = useState('')
  const [meetupsState, changeMeetupsState] = useState([])
  const [dataIsLoading, changeDataIsLoadingState] = useState(false)
  const [feedbackModalState, changeFeedbackModalState] = useState([false, '_', 'normal'])
  const [meetupCreatorModalState, changeMeetupCreatorModalState] = useState(false)

  useEffect(() => getMeetupsData(), [])
  
  function getMeetupsData() {
    getDocs(collection(firestoreDatabase, "meetups"))
    .then(returnedData => {
      const parsedData = returnedData.docs.map(doc => doc.data())

      changeMeetupsState(parsedData)
      changeDataIsLoadingState(false)
    })
    .catch(error => {
      changeFeedbackModalState([true, 'erro ao obter dados. reinicie a página', 'error'])
    })
  }

  function getModalState() {
    return feedbackModalState[0]
  }

  return (
    <Fragment>
      <MainHeader anchorToGetUnderlinedState={anchorToGetUnderlinedState} />
      
      <main>
        <Switch>
          <Route path='/' exact >
            <Meetups
              meetupsState={meetupsState}
              dataIsLoading={dataIsLoading} 
              changeDataIsLoadingState={changeDataIsLoadingState}
              changeAnchorToGetUnderlinedState={changeAnchorToGetUnderlinedState} 
              changeMeetupCreatorModalState={changeMeetupCreatorModalState} 
              meetupCreatorModalState={meetupCreatorModalState}
            />
          </Route>
          
          <Route path="/bookmarks">
            <Bookmarks changeAnchorToGetUnderlinedState={changeAnchorToGetUnderlinedState} />
          </Route>
        </Switch>

        <button
          onClick={() => changeMeetupCreatorModalState(!meetupCreatorModalState)}
          className={`${styleClasses.meetupCreatorButton} ${getModalState() ? styleClasses.hideMeetupCreatorButton : ''}`}
          aria-label="abrir janela de criação de encontro"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>

        <MeetupCreatorModal
          changeFeedbackModalState={changeFeedbackModalState}
          meetupCreatorModalState={meetupCreatorModalState} 
          changeMeetupCreatorModalState={changeMeetupCreatorModalState}
          meetupsState={meetupsState} changeMeetupsState={changeMeetupsState}
        />

        <FeedbackModal
          feedbackModalState={feedbackModalState}
          changeFeedbackModalState={changeFeedbackModalState}
        />
      </main>
    </Fragment>
  )
}

export default App;
