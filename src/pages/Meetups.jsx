import {Fragment, useEffect} from 'react';

import styleClasses from '../scss/App.module.scss';
import Card from '../components/Card';
import CreateMeetup from '../components/CreateMeetup';

function Meetups(props) {
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
  
  useEffect(() => changeAnchorToGetUnderlinedState('first-anchor'), [changeAnchorToGetUnderlinedState])

  function returnCards()  {
    return (
      <div className={styleClasses.gridContainer}>
        {meetupsState.map((data, index) => {
          return (
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
        })}
      </div>
    )
  }

  function createCards() {
    return meetupsState.length ? returnCards() : <CreateMeetup meetupCreatorModalState={meetupCreatorModalState} changeMeetupCreatorModalState={changeMeetupCreatorModalState} />
  }

  return (
    <Fragment>
      <div className={`introduction-wrapper ${!meetupsState.length ? 'reduce-padding' : ''}`}>
        <h1>Encontros</h1>
        <p>{meetupsState.length} encontro{meetupsState.length === 1 ? '' : 's'}</p>
      </div>

      {!dataIsLoading ? createCards() : null}
    </Fragment>
  )
}

export default Meetups;
