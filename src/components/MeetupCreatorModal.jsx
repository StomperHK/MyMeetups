import {useEffect, useRef} from 'react';

import firestoreDatabase from '../firestore';
import {collection, addDoc} from "firebase/firestore";

import styleClasses from '../scss/MeetupCreatorModal.module.scss';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';

function MeetupCreatorModal(props) {
  const {
    changeFeedbackModalState,
    meetupCreatorModalState,
    changeMeetupCreatorModalState,
    meetupsState, changeMeetupsState
  } = props

  useEffect(() => {
    const htmlEL = document.querySelector('html')

    meetupCreatorModalState ?
    htmlEL.classList.add('overflow-hidden') :
    htmlEL.classList.remove('overflow-hidden')
  }, [meetupCreatorModalState])

  const urlInputRef = useRef()
  const titleInputRef = useRef()
  const descriptionInputRef = useRef()
  const adressInputRef = useRef()
  const hourInputRef = useRef()
  const dateInputRef = useRef()

  const useStyles = makeStyles({
    root: {
      display: 'flex',
      'margin-top': '12px'
    }
  })
  
  const materialClasses = useStyles()

  function returnInputValue(element) {
    if (element.classList.contains('MuiOutlinedInput-multiline')) {
      return element.firstChild.value
    }
    else {
      return element.children[1].firstChild.value
    }
  }

  function formatDate(date) {
    const [year, month, day] = date.split('-')
    return [day, month, year].join('/')
  }

  function updateFrontEndDataOnPush(meetupEntry) {
    meetupsState.unshift(meetupEntry)
    changeMeetupsState(meetupsState)
  }

  function pushMeetupData(meetupEntry) {
    addDoc(collection(firestoreDatabase, 'meetups'), meetupEntry)
    .then(returnedData => {
      meetupEntry.id = returnedData.id

      updateFrontEndDataOnPush(meetupEntry)
      changeFeedbackModalState([true, 'encontro criado', 'normal', 1500])
    })
    .catch(() => {
      changeFeedbackModalState([true, 'erro ao enviar dados: reinicie a página', 'error', 3000])
    })
  }

  function handleFormSubmit(event) {
    event.preventDefault()
    
    const meetupEntry = {
      image: returnInputValue(urlInputRef.current),
      title: returnInputValue(titleInputRef.current),
      description: returnInputValue(descriptionInputRef.current),
      address: returnInputValue(adressInputRef.current),
      hour: returnInputValue(hourInputRef.current),
      date: formatDate(returnInputValue(dateInputRef.current)),
      isBookmarked: false
    }

    pushMeetupData(meetupEntry)
  }

  return (
    <section
      className={`${styleClasses.modalContainer} ${meetupCreatorModalState ? styleClasses.modalActiver : null}`}
    >
      <header className={styleClasses.modalHeader}>
        <h2>
          Criar Encontro
        </h2>
        <button onClick={() => changeMeetupCreatorModalState(false)} aria-label="fechar janela de criação de encontro">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
        </button>
      </header>

      <form className={styleClasses.modalForm} onSubmit={handleFormSubmit}>
        <TextField className={materialClasses.root} 
          type="url" label="URL da imagem" ref={urlInputRef}
        />
        <TextField className={materialClasses.root}
          required type="text" label="Título" ref={titleInputRef}
        />
        <TextField className={materialClasses.root} 
          required label="Descrição" multiline rows={4} ref={descriptionInputRef}
          variant='outlined' 
        />

        <TextField className={materialClasses.root} 
          required type="text" label="Endereço" ref={adressInputRef}
        />
        <TextField className={materialClasses.root} 
          required type="time" label="Horário" format="hh/mm" ref={hourInputRef}
          InputLabelProps={{shrink: true}} 
        />
        <TextField className={materialClasses.root}
          required type="date" label="Data" format="dd/mm/yyyy" ref={dateInputRef}
          InputLabelProps={{shrink: true}} 
        />

        <button className="generic-button" type="submit">criar</button>
      </form>
    </section>
  )
}

export default MeetupCreatorModal;
