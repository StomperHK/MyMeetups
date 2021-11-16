import {Fragment, useState, useEffect} from 'react';
import {Route, Switch} from 'react-router-dom';

import {firestoreDatabase, auth} from '../firebase';
import {getDocs, collection} from "firebase/firestore";
import {onAuthStateChanged} from 'firebase/auth';

import {Link, useHistory} from 'react-router-dom';

import Button from '@mui/material/Button';

import styleClasses from '../scss/ApplicationCore.module.scss';
import Header from '../components/Header';
import Meetups from './Meetups';
import Bookmarks from './Bookmarks';
import ConfirmModal from '../components/ConfirmModal';
import MeetupViewer from '../components/MeetupViewer';
import MeetupCreatorModal from '../components/MeetupCreatorModal';

function ApplicationCore(props) {
  useEffect(() => changeDataIsLoadingState(true), [])

  const [meetupsState, changeMeetupsState] = useState([])
  const [confirmModalState, changeConfirmModalState] = useState([false, '', null, '', ''])
  const [meetupViewerState, changeMeetupViewerState] = useState([false])
  const [meetupCreatorModalState, changeMeetupCreatorModalState] = useState(false)
  const [currentUser, changeCurrentUser] = useState(null)

  const history = useHistory()
  
  const {
    dataIsLoading,
    changeDataIsLoadingState,
    feedbackModalState,
    changeFeedbackModalState
  } = props

  const firebaseAuthenticationErrors = {
    'auth/invalid-user-token': ['o seu tôken de login não é mais válido: faça login denovo', 5000],
    'auth/network-request-failed': ['problema de conexão: reinicie a página e tente denovo', 5000],
    'auth/operation-not-allowed': ['provedor de crendencial desconfigurado', 3500],
    'auth/requires-recent-login': ['problema de autentição: faça login denovo', 4500],
    'auth/too-many-requests': ['muitas requisições feitas: aguarde e tente denovo', 5000],
    'auth/unauthorized-domain': ['este domínio não pode fazer operações de autenticação', 5000],
    'auth/user-token-expired': ['faça login novamente', 2000],
    'auth/web-storage-unsupported': ['seu navegador não suporta armazenamento de dados', 5000],
  }

  useEffect(toggleHideWindowScrollbar, [meetupViewerState, meetupCreatorModalState])
  useEffect(getUserState, [])

  function toggleHideWindowScrollbar() {
    const htmlEL = document.querySelector('html')

    if (meetupViewerState[0] || meetupCreatorModalState) {
      htmlEL.classList.add('overflow-hidden')
    }
    else {
      htmlEL.classList.remove('overflow-hidden')
    }

    return () => {
      htmlEL.classList.remove('overflow-hidden')
    }
  }

  function callErrorMessageHandler(errorCode) {
    const [treatedErrorMessage, duration] =
      firebaseAuthenticationErrors[errorCode] || ['erro inesperado: reinicie a página', 3000]
    
    changeFeedbackModalState([true, treatedErrorMessage, 'error', duration])
  }

  function redirectUserIfHeIsNotLogged() {
    history.replace('entrar-registro')
  }

  function getUserState() {
    onAuthStateChanged(auth, user => {
      if (user) {
        changeCurrentUser(user)
        getMeetupsData(user)
      }
      else {
        redirectUserIfHeIsNotLogged()
      }
    }, error => callErrorMessageHandler(error.code))
  }
  
  function getMeetupsData(user) {
    getDocs(collection(firestoreDatabase, `users/${user.uid}/meetups`))
    .then(returnedData => {
      const parsedData = returnedData.docs.map(doc => {
        return {
          ...doc.data(),
          id: doc.id
        }
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
      <Header auth={auth} currentUser={currentUser}
        changeDataIsLoadingState={changeDataIsLoadingState}
        changeFeedbackModalState={changeFeedbackModalState}
      >
        <Link to="/" tabIndex="-1">
          <Button size="medium" aria-label="ir para encontros"
            startIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z"/></svg>}
          >
            encontros
          </Button>
        </Link>

        <Link to="/favoritos" tabIndex="-1">
          <Button size="medium" aria-label="ir apra favoritos"
            startIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>}
          >
            favoritos
          </Button>
        </Link>
      </Header>
      
      <main>
        <Switch>
          <Route path='/' exact>
            <Meetups
              changeDataIsLoadingState={changeDataIsLoadingState}
              meetupsState={meetupsState}
              changeMeetupsState={changeMeetupsState}
              dataIsLoading={dataIsLoading}
              changeFeedbackModalState={changeFeedbackModalState}
              confirmModalState={confirmModalState}
              changeConfirmModalState={changeConfirmModalState}
              meetupCreatorModalState={meetupCreatorModalState}
              changeMeetupViewerState={changeMeetupViewerState}
              changeMeetupCreatorModalState={changeMeetupCreatorModalState}
              currentUser={currentUser}
            />
          </Route>
          
          <Route path="/favoritos">
            <Bookmarks
              changeDataIsLoadingState={changeDataIsLoadingState}
              meetupsState={meetupsState}
              changeMeetupsState={changeMeetupsState}
              dataIsLoading={dataIsLoading}
              changeFeedbackModalState={changeFeedbackModalState}
              confirmModalState={confirmModalState}
              changeConfirmModalState={changeConfirmModalState}
              changeMeetupViewerState={changeMeetupViewerState}
              currentUser={currentUser}
            />
          </Route>
        </Switch>

        <button
          onClick={() => changeMeetupCreatorModalState(!meetupCreatorModalState)}
          className={`${styleClasses.meetupCreatorButton} ${getModalState() ? styleClasses.hideMeetupCreatorButton : ''}`}
          aria-label="abrir janela de criação de encontro" aria-haspopup="dialog"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </button>

        <ConfirmModal 
          confirmModalState={confirmModalState}
          changeConfirmModalState={changeConfirmModalState}
        />

        <MeetupViewer
          changeDataIsLoadingState={changeDataIsLoadingState}
          meetupsState={meetupsState}
          changeMeetupsState={changeMeetupsState}
          changeFeedbackModalState={changeFeedbackModalState}
          confirmModalState={confirmModalState}
          changeConfirmModalState={changeConfirmModalState}
          meetupViewerState={meetupViewerState}
          changeMeetupViewerState={changeMeetupViewerState}
          currentUser={currentUser}
        />
 
        <MeetupCreatorModal
          changeDataIsLoadingState={changeDataIsLoadingState}
          changeFeedbackModalState={changeFeedbackModalState}
          meetupCreatorModalState={meetupCreatorModalState} 
          changeMeetupCreatorModalState={changeMeetupCreatorModalState}
          meetupsState={meetupsState} changeMeetupsState={changeMeetupsState}
          currentUser={currentUser}
        />
      </main>
    </Fragment>
  )
}

export default ApplicationCore;
