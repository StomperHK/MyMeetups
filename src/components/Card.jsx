import {useState, useEffect, useRef} from 'react';

import firestoreDatabase from '../firestore';
import {updateDoc, deleteDoc, doc} from 'firebase/firestore';

import styleClasses from '../scss/Card.module.scss'

function Card(props) {
  const {
    cardIndex,
    meetupsState,
    changeMeetupsState,
    changeFeedbackModalState,
    confirmModalState,
    changeConfirmModalState,
    changeMeetupViewerState,
    titleName,
    imageSource,
    descriptionText,
    address,
    hour,
    date,
    isBookmarked
  } = props

  const [imageState, changeImageState] = useState('empty')
  const [bookmarkState, changeBookmarkState] = useState(isBookmarked)
  
  const imageRef = useRef()

  useEffect(defineImagesSizes, [])
  useEffect(deleteMeetup, [confirmModalState, cardIndex, changeConfirmModalState])
  useEffect(verifyIfTheMeetupWasBookmakedByViewer, [meetupsState, bookmarkState, cardIndex, updateFrontEndOnBookmark])

  function updateFrontendOnDelete() {
    let temporaryArray = meetupsState.slice()
    temporaryArray.splice(cardIndex, 1)
    changeMeetupsState(temporaryArray)
  }

  function deleteDatabaseData() {
    deleteDoc(doc(firestoreDatabase, 'meetups', meetupsState[cardIndex].id))
    .then(() => {
      updateFrontendOnDelete()
      changeFeedbackModalState([true, 'encontro removido', 'normal', 1500])
    })
    .catch(() => {
      changeFeedbackModalState([true, 'erro ao deletar encontro: reinicie a página', 'error', 3000])
    })
  }

  function deleteMeetup() {
    const meetupMustGetDeleted = confirmModalState[1] === 'delete'
    const thisIsTheMeetupThatMustGetDeleted = confirmModalState[2] === cardIndex

    if (meetupMustGetDeleted && thisIsTheMeetupThatMustGetDeleted) {
      changeConfirmModalState([false, ''])
      deleteDatabaseData()
    }
  }

  function callConfirmModal() {
    changeConfirmModalState([true, '', cardIndex, 'Quer mesmo excluir o encontro?', 'delete'])
  }

  function callMeeetupViewer() {
    changeMeetupViewerState([true, cardIndex, callConfirmModal])
  }

  function verifyIfTheMeetupWasBookmakedByViewer() {
    if (meetupsState[cardIndex].isBookmarked !== bookmarkState) {
      meetupsState[cardIndex].isBookmarked = bookmarkState
      toggleBookmarkMeetup()
    }
  }

  function updateFrontEndOnBookmark() {
    meetupsState[cardIndex].isBookmarked = !bookmarkState
    changeBookmarkState(!bookmarkState)
    changeMeetupsState(meetupsState)
  }

  function toggleBookmarkMeetup() {
    updateDoc(doc(firestoreDatabase, 'meetups', meetupsState[cardIndex].id), {isBookmarked: !bookmarkState})
    .then(() => {
      updateFrontEndOnBookmark()
      changeFeedbackModalState([true, `encontro ${bookmarkState ? 'des' : ''}favoritado`, 'normal', 1500])
    })
    .catch(() => {
      changeFeedbackModalState([true, 'erro ao favoritar encontro: reinicie a página', 'error', 3000])
    })
  }

  function defineImagesSizes() {
    try {
      const imageEL = imageRef.current
      imageEL.style.height = imageEL.clientWidth / (16 / 7) + 'px'
    }
    catch(err) {
      return
    }
  }
  
  window.addEventListener('resize', defineImagesSizes)
  
  return (
    <article 
      className={`${styleClasses.card} ${'empty error'.includes(imageState) ? 'fit-content-height' : ''}`}
    >
      <figure>
        {
          imageSource ?
          <img className='card-image' ref={imageRef} onLoad={() => changeImageState('loaded')} onError={() => changeImageState('error')} src={imageSource} alt="" /> :
          null
        }

        <figcaption>
          <h2>{titleName}</h2>
          {descriptionText ? <p>{descriptionText}</p> : null}
          <ul>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zM7 9c0-2.76 2.24-5 5-5s5 2.24 5 5c0 2.88-2.88 7.19-5 9.88C9.92 16.21 7 11.85 7 9z"/><circle cx="12" cy="9" r="2.5"/></svg>
              <p>{address}</p>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              <p>{hour}</p>
            </li>
            <li>
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z"/></svg>
              <p>{date}</p>
            </li>
          </ul>
        </figcaption>
      </figure>

      <div className={styleClasses.actionsWrapper}>
        <button onClick={callConfirmModal} aria-label="excluir encontro">
           <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
        </button>
        <button onClick={callMeeetupViewer} className="generic-button">
          ver mais
        </button>
        <button onClick={toggleBookmarkMeetup} aria-label="favoritar encontro">
          {
            bookmarkState ?
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg> :
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
          }
        </button>
      </div>
    </article>
  )
}

export default Card;
