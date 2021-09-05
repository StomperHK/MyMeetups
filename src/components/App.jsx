import {Fragment, useState} from 'react';
import {Route, Switch} from 'react-router-dom';

import MainHeader from './MainHeader';
import MeetupCreatorModal from './MeetupCreatorModal';
import Meetups from '../pages/Meetups';
import Bookmarks from '../pages/Bookmarks';

function App() {
  const [underlineAnchor, changeUnderlinedAnchor] = useState('')
  const [modalState, changeModalState] = useState(false)

  return (
    <Fragment>
      <MainHeader underlineAnchor={underlineAnchor} />
      
      <main>
        <Switch>
          <Route path='/' exact >
            <Meetups
              changeUnderlinedAnchor={changeUnderlinedAnchor} 
              changeModalState={changeModalState} 
              modalState={modalState}
            />
          </Route>
          
          <Route path="/bookmarks">
            <Bookmarks changeUnderlinedAnchor={changeUnderlinedAnchor} />
          </Route>
        </Switch>
      </main>

      <MeetupCreatorModal modalState={modalState} changeModalState={changeModalState} />
    </Fragment>
  )
}

export default App;
