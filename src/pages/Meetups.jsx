import {Fragment, useState, useEffect} from 'react';

import firestoreDatabase from '../firestore';
import { collection, getDocs } from "firebase/firestore";

import styleClasses from '../scss/Meetups.module.scss';
import Card from '../components/Card';
import CreateMeetup from '../components/CreateMeetup';
import MeetupCreatorModal from '../components/MeetupCreatorModal';

function Meetups(props) {
  const [meetupsState, changeMeetupsState] = useState()
  const [dataIsLoading, changeDataIsLoadingState] = useState(true)
  const {changeUnderlinedAnchor, modalState, changeModalState} = props
  let cardImageIndex;   // it will help to define the images that must get resized
  
  changeUnderlinedAnchor('first-anchor')

  useEffect(getMeetupsData, [])
  
  function getMeetupsData() {
    getDocs(collection(firestoreDatabase, "meetups"))
    .then(returnedData => {
      const parsedData = returnedData.docs.map(doc => doc.data())

      changeMeetupsState(parsedData)
      changeDataIsLoadingState(false)
    })
    .catch(error => {
      window.alert('Ocorreu um erro. Reinicie a página.')
    })
  }

  function returnCards()  {
    cardImageIndex = -1

    return (
      <div className={styleClasses.cardsGridContainer}>
        {
          meetupsState.map((data, index) => {
            if (data.image) {
              ++cardImageIndex
            }
            
            return (
              <Card
                cardIndex={cardImageIndex}
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
    return meetupsState.length ? returnCards() : <CreateMeetup modalState={modalState} changeModalState={changeModalState} />
  }

  return (
    <Fragment>
      <h1>Encontros</h1>

      <button
        onClick={() => changeModalState(!modalState)}
        className={styleClasses.meetupCreatorButton}
        aria-label="abrir janela de criação de encontro"
      >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
      </button>

      {!dataIsLoading ? createCards() : null}

      <MeetupCreatorModal 
        modalState={modalState} changeModalState={changeModalState} 
        meetupsState={meetupsState} changeMeetupsState={changeMeetupsState}
      />
    </Fragment>
  )
}

export default Meetups;
