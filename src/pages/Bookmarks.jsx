import {Fragment, useEffect} from 'react';

import styleClasses from '../scss/App.module.scss';
import Card from '../components/Card';
import ReturnToMeetups from '../components/ReturnToMeetups';

function Bookmarks(props) {
  const {
    meetupsState,
    changeMeetupsState,
    dataIsLoading,
    changeAnchorToGetUnderlinedState,
    changeFeedbackModalState,
    confirmModalState,
    changeConfirmModalState,
    changeMeetupViewerState,
  } = props

  useEffect(() =>changeAnchorToGetUnderlinedState('second-anchor'), [changeAnchorToGetUnderlinedState])

  const bookmarkedMeetups = knowAmountOfBookmarkedMeetups()

  function knowIfAnyMeetupIsBookmarked() {
    return meetupsState.some(meetup => meetup.isBookmarked)
  }

  function knowAmountOfBookmarkedMeetups() {
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
                  changeFeedbackModalState={changeFeedbackModalState}
                  confirmModalState={confirmModalState}
                  changeConfirmModalState={changeConfirmModalState}
                  changeMeetupViewerState={changeMeetupViewerState}
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
    return knowIfAnyMeetupIsBookmarked() ? returnCards() : <ReturnToMeetups />
  }

  return (
    <Fragment>
      <div className={`introduction-wrapper ${!bookmarkedMeetups ? 'reduce-padding' : ''}`}>
        <h1>Favoritos</h1>
        <p>{bookmarkedMeetups} favorito{bookmarkedMeetups === 1 ? '' : 's'}</p>
      </div>

      {!dataIsLoading && meetupsState ? createCards() : null}
    </Fragment>
  )
}

export default Bookmarks;
