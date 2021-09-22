import {Fragment, useState, useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';

import firestoreDatabase from '../firestore';
import {getDocs, collection} from "firebase/firestore";

import styleClasses from '../scss/App.module.scss';
import MainHeader from './MainHeader';
import Meetups from '../pages/Meetups';
import Bookmarks from '../pages/Bookmarks';
import LoadingScreen from './LoadingScreen';
import ConfirmModal from './ConfirmModal';
import FeedbackModal from './FeedbackModal';
import MeetupViewer from './MeetupViewer';
import MeetupCreatorModal from '../components/MeetupCreatorModal';

function App() {
  const [anchorToGetUnderlinedState, changeAnchorToGetUnderlinedState] = useState('')
  const [meetupsState, changeMeetupsState] = useState([])
  const [dataIsLoading, changeDataIsLoadingState] = useState(true)  /* keep it true */
  const [confirmModalState, changeConfirmModalState] = useState([false, '', null, '', ''])
  const [feedbackModalState, changeFeedbackModalState] = useState([false, '_', 'normal'])
  const [meetupViewerState, changeMeetupViewerState] = useState([false])
  const [meetupCreatorModalState, changeMeetupCreatorModalState] = useState(false)

  useEffect(toggleRemoveWindowScrollbar, [meetupCreatorModalState, meetupViewerState])
  useEffect(getMeetupsData, [])
  
  function toggleRemoveWindowScrollbar() {
    const htmlEL = document.querySelector('html')

    meetupCreatorModalState || meetupViewerState[0] ?
    htmlEL.classList.add('overflow-hidden') :
    htmlEL.classList.remove('overflow-hidden')
  }
  
  function getMeetupsData() {
    getDocs(collection(firestoreDatabase, "meetups"))
    .then(returnedData => {
      const parsedData = returnedData.docs.map(doc => {
        let temporaryObject = doc.data()
        temporaryObject.id = doc.id
        return temporaryObject
      })

      changeMeetupsState(parsedData)
      changeDataIsLoadingState(false)
    })
    .catch(() => {
      changeDataIsLoadingState(false)
      changeFeedbackModalState([true, 'erro ao obter dados: reinicie a página', 'error', 3000])
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
              changeMeetupsState={changeMeetupsState}
              dataIsLoading={dataIsLoading}
              changeAnchorToGetUnderlinedState={changeAnchorToGetUnderlinedState}
              changeFeedbackModalState={changeFeedbackModalState}
              confirmModalState={confirmModalState}
              changeConfirmModalState={changeConfirmModalState}
              meetupCreatorModalState={meetupCreatorModalState}
              changeMeetupViewerState={changeMeetupViewerState}
              changeMeetupCreatorModalState={changeMeetupCreatorModalState}
            />
          </Route>
          
          <Route path="/bookmarks">
            <Bookmarks
              meetupsState={meetupsState}
              changeMeetupsState={changeMeetupsState}
              dataIsLoading={dataIsLoading}
              changeAnchorToGetUnderlinedState={changeAnchorToGetUnderlinedState}
              confirmModalState={confirmModalState}
              changeConfirmModalState={changeConfirmModalState}
              meetupCreatorModalState={meetupCreatorModalState}
              changeMeetupViewerState={changeMeetupViewerState}
              changeMeetupCreatorModalState={changeMeetupCreatorModalState}
            />
          </Route>
        </Switch>

        <button
          onClick={() => changeMeetupCreatorModalState(!meetupCreatorModalState)}
          className={`${styleClasses.meetupCreatorButton} ${getModalState() ? styleClasses.hideMeetupCreatorButton : ''}`}
          aria-label="abrir janela de criação de encontro"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>

        {dataIsLoading ? <LoadingScreen /> : null}

        <ConfirmModal 
          confirmModalState={confirmModalState}
          changeConfirmModalState={changeConfirmModalState}
        />

        <FeedbackModal
          feedbackModalState={feedbackModalState}
          changeFeedbackModalState={changeFeedbackModalState}
        />

        <MeetupViewer
          meetupsState={meetupsState}
          changeMeetupsState={changeMeetupsState}
          changeFeedbackModalState={changeFeedbackModalState}
          confirmModalState={confirmModalState}
          changeConfirmModalState={changeConfirmModalState}
          meetupViewerState={meetupViewerState}
          changeMeetupViewerState={changeMeetupViewerState}
        />
 
        <MeetupCreatorModal
          changeFeedbackModalState={changeFeedbackModalState}
          meetupCreatorModalState={meetupCreatorModalState} 
          changeMeetupCreatorModalState={changeMeetupCreatorModalState}
          meetupsState={meetupsState} changeMeetupsState={changeMeetupsState}
        />
      </main>
    </Fragment>
  )
}

export default App;
