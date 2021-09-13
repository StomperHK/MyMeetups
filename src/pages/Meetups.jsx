import {Fragment, useEffect} from 'react';

import styleClasses from '../scss/Meetups.module.scss';
import Card from '../components/Card';
import CreateMeetup from '../components/CreateMeetup';

function Meetups(props) {
  const {
    meetupsState,
    dataIsLoading,
    changeDataIsLoadingState,
    changeAnchorToGetUnderlinedState,
    meetupCreatorModalState,
    changeMeetupCreatorModalState
  } = props
  
  useEffect(() =>changeAnchorToGetUnderlinedState('first-anchor'), [changeAnchorToGetUnderlinedState])

  function returnCards()  {
    return (
      <div className={styleClasses.cardsGridContainer}>
        {
          meetupsState.map((data, index) => {
            return (
              <Card
                imageSource={data.image}
                titleName={data.title}
                descriptionText={data.description}
                address={data.address}
                hour={data.hour}
                date={data.date}
                key={index}
              />
            )
          })
        }
      </div>
    )
  }

  function createCards() {
    return meetupsState.length ? returnCards() : <CreateMeetup meetupCreatorModalState={meetupCreatorModalState} changeMeetupCreatorModalState={changeMeetupCreatorModalState} />
  }

  return (
    <Fragment>
      <h1>Encontros</h1>

      {!dataIsLoading ? createCards() : null}
    </Fragment>
  )
}

export default Meetups;
