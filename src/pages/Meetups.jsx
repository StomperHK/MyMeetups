import {Fragment} from 'react';

import styleClasses from '../scss/ApplicationCore.module.scss';
import Card from '../components/Card';
import AlternativeAction from '../components/AlternativeAction';

function Meetups(props) {
  const {
    meetupsState,
    changeMeetupsState,
    dataIsLoading,
    changeDataIsLoadingState,
    changeFeedbackModalState,
    confirmModalState,
    changeConfirmModalState,
    meetupCreatorModalState,
    changeMeetupViewerState,
    changeMeetupCreatorModalState,
    currentUser
  } = props

  function returnCards()  {
    return (
      <div className={styleClasses.gridContainer}>
        {meetupsState.map((data, index) => {
          return (
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
        })}
      </div>
    )
  }

  function createCards() {
    return meetupsState.length ?
    returnCards() :
    (
      <AlternativeAction>
        <button className='createMeetupWrapper' 
          onClick={() => changeMeetupCreatorModalState(!meetupCreatorModalState)}
          aria-label="criar encontro"
        >
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
          </div>
          <p>
            criar encontro
          </p>
        </button>
      </AlternativeAction>
    )
  }

  return (
    <Fragment>
      <section className={`introduction-wrapper ${!meetupsState.length ? 'reduce-padding' : ''}`}
        aria-labelledby="application-section-name" aria-describedby="application-section-description"
      >
        <h1 id="application-section-name">Encontros</h1>
        <p id="application-section-description">{meetupsState.length} encontro{meetupsState.length === 1 ? '' : 's'}</p>
      </section>

      {!dataIsLoading ? createCards() : null}
    </Fragment>
  )
}

export default Meetups;
