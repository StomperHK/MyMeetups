import {Fragment} from 'react'

import styleClasses from '../scss/Meetups.module.scss';
import Card from '../components/Card';
import CreateMeetup from '../components/CreateMeetup'

function Meetups(props) {
  const {changeUnderlinedAnchor, modalState, changeModalState} = props
  
  const DUMMY_DATA = [
    {
      title: 'This is a first meetup',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/2560px-Stadtbild_M%C3%BCnchen.jpg',
      description:
        'This is a first, amazing meetup which you definitely should not miss. It will be a lot of fun!',
      address: 'Meetupstreet 5, 12345 Meetup City',
      hour: '09:35',
      date: '03/21/31'
    },
    {
      title: 'This is a second meetup',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Stadtbild_M%C3%BCnchen.jpg/2560px-Stadtbild_M%C3%BCnchen.jpg',
      description:
        'This is a first, amazing meetup which you definitely should not miss. It will be a lot of fun!',
      address: 'Meetupstreet 5, 12345 Meetup City',
      date: '03/21/31'
    },
    {
      title: 'Second meetup',
      image:
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse4.mm.bing.net%2Fth%3Fid%3DOIP.XwvslP5BMK3QnIyqwK2C1QHaE0%26pid%3DApi&f=1',
      description: 'Amazing meetup!',
      address: 'Rua Pedro Paulo, 120',
      hour: '09:35',
      date: '03/21/31'
    }
  ];

  changeUnderlinedAnchor('first-anchor')

  function returnCards()  {
    return (
      <div className={styleClasses.cardsGridContainer}>
        {
          DUMMY_DATA.map((data, index) => {
            return (
              <Card
                cardIndex={index}
                titleName={data.title}
                imageSource={data.image}
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
    return DUMMY_DATA.length ? returnCards() : <CreateMeetup />
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

      {createCards()}
    </Fragment>
  )
}

export default Meetups;
