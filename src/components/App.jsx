import {Fragment, useState} from 'react';
import {Route, Switch} from 'react-router-dom';

import MainHeader from './MainHeader';
import NewMeetup from './NewMeetup';
import Meetups from '../pages/Meetups';
import Bookmarks from '../pages/Bookmarks';

function App() {
  const [underlineAnchor, changeUnderlinedAnchor] = useState('')

  return (
    <Fragment>
      <MainHeader underlineAnchor={underlineAnchor} />
      
      <main>
        <Switch>
          <Route path='/' exact >
            <Meetups changeUnderlinedAnchor={changeUnderlinedAnchor} />
          </Route>
          <Route path="/bookmarks">
            <Bookmarks changeUnderlinedAnchor={changeUnderlinedAnchor} />
          </Route>
        </Switch>

        <NewMeetup />
      </main>
    </Fragment>
  )
}

export default App;
