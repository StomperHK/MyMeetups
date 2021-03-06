import {useRef, useState, useEffect} from 'react';

import {firestoreDatabase} from '../firebase';
import {updateDoc, doc} from 'firebase/firestore';

import Button from '@mui/material/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import styleClasses from '../scss/MeetupViewer.module.scss';

let globalVerifiedChanges;
let globalUpdatedData;

function MeetupViewer(props) {
  const {
    changeDataIsLoadingState,
    meetupsState,
    changeMeetupsState,
    changeFeedbackModalState,
    confirmModalState,
    changeConfirmModalState,
    meetupViewerState,
    changeMeetupViewerState,
    currentUser
  } = props

  const [modalIsActivated, cardIndex, callConfirmModal] = meetupViewerState

  const [userIsEditingState, changeUserIsEditingState] = useState(false)

  const firstModalElementRef = useRef()
  const urlInputRef = useRef()
  const titleInputRef = useRef()
  const descriptionInputRef = useRef()
  const adressInputRef = useRef()
  const hourInputRef = useRef()
  const dateInputRef = useRef()

  useEffect(focusFirstModalElement, [meetupViewerState])
  useEffect(updateInputs, [meetupsState, cardIndex])
  useEffect(verifyModalChange, [confirmModalState, changeConfirmModalState])

  const normalTheme = createTheme({
    palette: {
      primary: {
        main: '#525ee2'
      }
    }
  })
  
  const materialClasses = makeStyles({
    root: {
      'margin-top': '10px'
    },
    multiline: {
      'margin-top': '9px'
    }
  })()

  function focusFirstModalElement() {
    if (meetupViewerState) {
      firstModalElementRef.current.focus()
    }
  }

  function updateInputs() {
    if (cardIndex === undefined || !meetupsState[cardIndex]) return
    const {image, title, description, address, hour, date} = meetupsState[cardIndex]

    urlInputRef.current.value = image ? image : ''
    titleInputRef.current.value = title
    descriptionInputRef.current.value = description ? description : ''
    adressInputRef.current.value = address
    hourInputRef.current.value = hour
    dateInputRef.current.value = date
  }

  function verifyModalChange() {
    if (confirmModalState[1] === 'edit') {
      changeConfirmModalState([false, '', null, '', ''])
      updateDatabaseData()
    }
  }

  function getChanges(updatedData) {
    const registeredChanges = {}

    for (let propertyName in updatedData) {
      if (updatedData[propertyName] !== meetupsState[cardIndex][propertyName]) {
        registeredChanges[propertyName] = updatedData[propertyName]
      }
    }

    return registeredChanges
  }

  function changeFrontEndOnUpdate() {
    meetupsState[cardIndex] = globalUpdatedData
    changeMeetupsState(meetupsState)
  }

  function updateDatabaseData() {
    changeDataIsLoadingState(true)

    const userUID = currentUser.uid
    const meetupID = meetupsState[cardIndex].id

    updateDoc(doc(firestoreDatabase, `users/${userUID}/meetups/${meetupID}`), globalVerifiedChanges)
    .then(() => {
       changeDataIsLoadingState(false)
      changeFrontEndOnUpdate(globalUpdatedData)
      changeFeedbackModalState([true, 'altera????o salva', 'normal', 1500])
    })
    .catch(() => {
     changeDataIsLoadingState(false)
      changeFeedbackModalState([true, 'erro ao salver edi????es: reinicie a p??gina', 'error', 3000])
    })
  }

  function handleFormSubmit(event) {
    event.preventDefault()

    const updatedData = {
      image: urlInputRef.current.value,
      title: titleInputRef.current.value,
      description: descriptionInputRef.current.value,
      address: adressInputRef.current.value,
      hour: hourInputRef.current.value,
      date: dateInputRef.current.value,
      isBookmarked: meetupsState[cardIndex].isBookmarked,
      id: meetupsState[cardIndex].id
    }

    const verifiedChanges = getChanges(updatedData)
    const changesOcurred = Object.entries(verifiedChanges).length

    if (changesOcurred) {
      changeConfirmModalState([true, '', cardIndex, 'Quer mesmo editar o encontro?', 'edit'])
      globalVerifiedChanges = verifiedChanges
      globalUpdatedData = updatedData
    }
    else {
      changeFeedbackModalState([true, 'n??o h?? mudan??as para salvar', 'alert', 2000])
    }
  }

  function handleEditButtonClick() {
    if (userIsEditingState) updateInputs()
    changeUserIsEditingState(!userIsEditingState)
  }

  function returnMeetupBody() {
    if (meetupsState[cardIndex]) {
      const {image, title, description, address, hour, date} = meetupsState[cardIndex]
      
      return (
        <article
          className={`${styleClasses.contentContainer} ${!userIsEditingState ? styleClasses.showContainer : ''}`}
        >
          {image ? <img src={image} alt="" /> : ''}
          <h2 tabIndex="0">{title}</h2>
          {description ? <p tabIndex="0">{description}</p> : null}
          <ul tabIndex="0">
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
        </article>
      )
    }
  }

  return (
    <div
      className={`modal-container ${modalIsActivated ? 'modal-activer' : ''}`}
      role="dialog" aria-label="visualiza????o do encontro"
    >
      <header className="modal-header sticky-header">
        <button className='first-modal-element'
          onClick={() => changeMeetupViewerState([false, cardIndex])}
          aria-label="voltar"
          ref={firstModalElementRef}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42-.39-.39-1.02-.39-1.41 0l-6.59 6.59c-.39.39-.39 1.02 0 1.41l6.59 6.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1z"/></svg>
        </button>

        <div className={styleClasses.iconsWrapper} role="toolbar" aria-label="manipula????es do encontro">
          <button onClick={callConfirmModal}
            aria-label="excluir encontro" aria-haspopup="dialog"
            >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"/></svg>
          </button>
          <button className={userIsEditingState ? styleClasses.blueBackgroundColor : ''}
            onClick={handleEditButtonClick}
            aria-label='editar encontro' aria-pressed={userIsEditingState ? 'true' : 'false'} aria-haspopup="dialog"
          >
            {
              userIsEditingState ?
              <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><path d="M0,0h24v24H0V0z" fill="none"/></g><g><g><path d="M14.06,9.02l0.92,0.92l-1.11,1.11l1.41,1.41l2.52-2.52l-3.75-3.75l-2.52,2.52l1.41,1.41L14.06,9.02z M20.71,7.04 c0.39-0.39,0.39-1.02,0-1.41l-2.34-2.34C18.17,3.09,17.92,3,17.66,3s-0.51,0.1-0.7,0.29l-1.83,1.83l3.75,3.75L20.71,7.04z M2.81,2.81L1.39,4.22l7.32,7.32L3,17.25V21h3.75l5.71-5.71l7.32,7.32l1.41-1.41L2.81,2.81z M5.92,19H5v-0.92l5.13-5.13l0.92,0.92 L5.92,19z"/></g></g></svg> :
              <svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/></g><g><g><g><path d="M3,21l3.75,0L17.81,9.94l-3.75-3.75L3,17.25L3,21z M5,18.08l9.06-9.06l0.92,0.92L5.92,19L5,19L5,18.08z"/></g><g><path d="M18.37,3.29c-0.39-0.39-1.02-0.39-1.41,0l-1.83,1.83l3.75,3.75l1.83-1.83c0.39-0.39,0.39-1.02,0-1.41L18.37,3.29z"/></g></g></g></svg>
            }
          </button>
        </div>
      </header>

      <div className={styleClasses.contentAndFormWrapper}>
        {returnMeetupBody()}

        <form
          className={`modal-form ${userIsEditingState ? styleClasses.showContainer : ''}`}
          onSubmit={handleFormSubmit} aria-label="editar encontro"
        >
          <TextField className={materialClasses.root}
            type="url" label="URL da imagem" inputRef={urlInputRef}
            fullWidth InputLabelProps={{shrink: true}} inputProps={{'aria-label': 'nova URL da imagem de encontro'}}
          />
          <TextField className={materialClasses.root}
            type="text" label="T??tulo" required inputRef={titleInputRef}
            fullWidth inputProps={{'aria-label': 'novo t??tulo'}}
          />
          <TextField className={materialClasses.multiline}
            label="Descri????o" rows={4} inputRef={descriptionInputRef}
            multiline fullWidth InputLabelProps={{shrink: true}} inputProps={{'aria-label': 'nova descri????o'}}
          />
          <TextField className={materialClasses.root} 
            type="text" label="Endere??o" required inputRef={adressInputRef}
            fullWidth inputProps={{'aria-label': 'novo endere??o'}}
          />
          <TextField className={materialClasses.root}
            type="time" label="Hor??rio" required format="hh/mm" inputRef={hourInputRef}
            fullWidth InputLabelProps={{shrink: true}} inputProps={{'aria-label': 'novo hor??rio'}}
          />
          <TextField className={materialClasses.root}
            type="text" label="Data" required inputRef={dateInputRef}
            fullWidth inputProps={{'aria-label': 'nova data'}}
          />

          <div className="action-buttons-wrapper">
          <Button size="small" type="reset" color="error">resetar</Button>
            <ThemeProvider theme={normalTheme}>
              <Button size="small" type="submit">editar</Button>
            </ThemeProvider>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MeetupViewer;
