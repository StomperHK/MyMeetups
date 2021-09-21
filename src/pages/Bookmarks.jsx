import {Fragment, useEffect} from 'react';

import styleClasses from '../scss/App.module.scss';
import Card from '../components/Card';
import CreateMeetup from '../components/CreateMeetup';

function Bookmarks(props) {
  const {
    meetupsState,
    changeMeetupsState,
    dataIsLoading,
    changeAnchorToGetUnderlinedState,
    changeFeedbackModalState,
    confirmModalState,
    changeConfirmModalState,
    meetupCreatorModalState,
    changeMeetupViewerState,
    changeMeetupCreatorModalState
  } = props

  useEffect(() =>changeAnchorToGetUnderlinedState('second-anchor'), [changeAnchorToGetUnderlinedState])

  function knowIfAnyMeetupIsBookmarked() {
    return meetupsState.some(meetup => meetup.isBookmarked)
  }

  function returnCards()  {
    return (
      <div className={styleClasses.cardsGridContainer}>
        {
          meetupsState.reduce((accum, data, index) => {
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
                  descriptionText={data.description}
                  address={data.address}
                  hour={data.hour}
                  date={data.date}
                  isBookmarked={data.isBookmarked}
                  key={index}
                />
              )
            }
            
            return accum
          }, [])
        }
      </div>
    )
  }

  function createCards() {
    return knowIfAnyMeetupIsBookmarked() ? returnCards() : <CreateMeetup meetupCreatorModalState={meetupCreatorModalState} changeMeetupCreatorModalState={changeMeetupCreatorModalState} />
  }

  return (
    <Fragment>
      <h1>Favoritos</h1>

      {!dataIsLoading && meetupsState ? createCards() : null}
    </Fragment>
  )
}

export default Bookmarks;
