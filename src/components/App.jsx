import {useState} from 'react';

import {Route, Switch} from 'react-router-dom';

import ApplicationLoginRegister from '../pages/ApplicationLoginRegister';
import ApplicationCore from '../pages/ApplicationCore';
import PageNotFound from '../pages/PageNotFound';
import LoadingScreen from '../components/LoadingScreen';
import FeedbackModal from '../components/FeedbackModal';

function App() {
  const [dataIsLoading, changeDataIsLoadingState] = useState(true)
  const [feedbackModalState, changeFeedbackModalState] = useState([false, '', 'normal'])

  return (
    <div aria-busy={dataIsLoading ? 'true' : 'false'} aria-labelledby={dataIsLoading ? 'loading-screen' : ''}>
      <Switch>
        <Route path='/entrar-registro'>
          <ApplicationLoginRegister
            changeDataIsLoadingState={changeDataIsLoadingState}
            changeFeedbackModalState={changeFeedbackModalState}
          />
        </Route>
  
        <Route path={['/', '/favoritos']} exact>
          <ApplicationCore
            dataIsLoading={dataIsLoading}
            changeDataIsLoadingState={changeDataIsLoadingState}
            feedbackModalState={feedbackModalState}
            changeFeedbackModalState={changeFeedbackModalState}
          />
        </Route>

        <Route>
          <PageNotFound changeDataIsLoadingState={changeDataIsLoadingState} />
        </Route>
      </Switch>

      <LoadingScreen dataIsLoading={dataIsLoading} />
      
      <FeedbackModal
        feedbackModalState={feedbackModalState}
        changeFeedbackModalState={changeFeedbackModalState}
      />
    </div>
  )
}

export default App;
