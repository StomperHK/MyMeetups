import {Fragment, useState} from 'react';

import {Route, Switch, useLocation} from 'react-router-dom';

import ApplicationLoginRegister from '../pages/ApplicationLoginRegister';
import ApplicationCore from '../pages/ApplicationCore';
import LoadingScreen from '../components/LoadingScreen';
import FeedbackModal from '../components/FeedbackModal';

function App() {
  const [dataIsLoading, changeDataIsLoadingState] = useState(true)
  const [feedbackModalState, changeFeedbackModalState] = useState([false, '_', 'normal'])

  const {pathname} = useLocation()

  return (
    <Fragment>
      <Switch>
        {
          pathname === '/entrar-registro' || pathname === '/' ?
          (
            <Route>
              <ApplicationLoginRegister
                changeDataIsLoadingState={changeDataIsLoadingState}
                changeFeedbackModalState={changeFeedbackModalState}
              />
            </Route>
          ) :
          null
        }
  
        {
          pathname === '/encontros' || pathname === '/favoritos' ?
          (
            <Route>
              <ApplicationCore
                dataIsLoading={dataIsLoading}
                changeDataIsLoadingState={changeDataIsLoadingState}
                feedbackModalState={feedbackModalState}
                changeFeedbackModalState={changeFeedbackModalState}
              />
            </Route>
          ) :
          null
        }
      </Switch>

      {dataIsLoading ? <LoadingScreen /> : null}
      
      <FeedbackModal
        feedbackModalState={feedbackModalState}
        changeFeedbackModalState={changeFeedbackModalState}
      />
    </Fragment>
  )
}

export default App;
