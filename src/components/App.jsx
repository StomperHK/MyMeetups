import {Fragment, useState} from 'react';

import {Route, Switch, useLocation} from 'react-router-dom';

import ApplicationLoginRegister from '../pages/ApplicationLoginRegister';
import ApplicationCore from '../pages/ApplicationCore';
import PageNotFound from '../pages/PageNotFound';
import LoadingScreen from '../components/LoadingScreen';
import FeedbackModal from '../components/FeedbackModal';

function App() {
  const [dataIsLoading, changeDataIsLoadingState] = useState(true)
  const [feedbackModalState, changeFeedbackModalState] = useState([false, '', 'normal'])

  const {pathname} = useLocation()

  return (
    <Fragment>
      <Switch>
        <Route path='/entrar-registro'>
          <ApplicationLoginRegister
            changeDataIsLoadingState={changeDataIsLoadingState}
            changeFeedbackModalState={changeFeedbackModalState}
          />
        </Route>
  
        {
          pathname === '/' || pathname === '/favoritos' ?
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

        <Route>
          <PageNotFound changeDataIsLoadingState={changeDataIsLoadingState} />
        </Route>
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
