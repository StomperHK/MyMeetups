import {Fragment} from 'react';

import {Link} from 'react-router-dom';

import styleClasses from '../scss/ApplicationCore.module.scss';
import Card from '../components/Card';
import AlternativeAction from '../components/AlternativeAction';

function Bookmarks(props) {
  const {
    meetupsState,
    changeMeetupsState,
    dataIsLoading,
    changeDataIsLoadingState,
    changeFeedbackModalState,
    confirmModalState,
    changeConfirmModalState,
    changeMeetupViewerState,
    currentUser
  } = props

  const bookmarkedMeetups = toKnowTheAmountOfBookmarkedMeetups()

  function toKnowIfAnyMeetupIsBookmarked() {
    return meetupsState.some(meetup => meetup.isBookmarked)
  }

  function toKnowTheAmountOfBookmarkedMeetups() {
    return meetupsState.reduce((accum, meetup) => meetup.isBookmarked ? accum + 1 : accum, 0)
  }

  function returnCards()  {
    return (
      <div className={styleClasses.gridContainer}>
        {meetupsState.reduce((accum, data, index) => {
            if (data.isBookmarked) {
              accum.push(
                <Card
                  cardIndex={index}
                  meetupsState={meetupsState}
                  changeMeetupsState={changeMeetupsState}
                  changeDataIsLoadingState={changeDataIsLoadingState}
                  changeFeedbackModalState={changeFeedbackModalState}
                  confirmModalState={confirmModalState}
                  changeConfirmModalState={changeConfirmModalState}
                  changeMeetupViewerState={changeMeetupViewerState}
                  currentUser={currentUser}
                  imageSource={data.image}
                  titleName={data.title}
                  address={data.address}
                  hour={data.hour}
                  date={data.date}
                  isBookmarked={data.isBookmarked}
                  key={index}
                />
              )
            }
            
            return accum
          }, [])}
      </div>
    )
  }

  function createCards() {
    return toKnowIfAnyMeetupIsBookmarked() ?
    returnCards() :
    (
      <AlternativeAction>
        <Link className='createMeetupWrapper' to="/" aria-label="ir para encontros">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
          </div>
          <p>
            ir para encontros
          </p>
        </Link>
      </AlternativeAction>
    )
  }

  return (
    <Fragment>
      <section className={`introduction-wrapper ${!bookmarkedMeetups ? 'reduce-padding' : ''}`}
        aria-labelledby="application-section-name" aria-describedby="application-section-description"
      >
        <h1 id="application-section-name">Favoritos</h1>
        <p id="application-section-description">{bookmarkedMeetups} favorito{bookmarkedMeetups === 1 ? '' : 's'}</p>
      </section>

      {!dataIsLoading && meetupsState ? createCards() : null}
    </Fragment>
  )
}

export default Bookmarks;
