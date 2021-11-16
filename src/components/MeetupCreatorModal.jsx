import {useEffect, useRef} from 'react';

import {firestoreDatabase} from '../firebase';
import {collection, addDoc} from 'firebase/firestore';

import Button from '@mui/material/Button';
import TextField from '@material-ui/core/TextField';
import {makeStyles} from '@material-ui/core/styles';
import {createTheme, ThemeProvider} from '@mui/material/styles';

function MeetupCreatorModal(props) {
  const {
    changeDataIsLoadingState,
    changeFeedbackModalState,
    meetupCreatorModalState,
    changeMeetupCreatorModalState,
    meetupsState,
    changeMeetupsState,
    currentUser
  } = props
  
  const firstModalElementRef = useRef()
  const urlInputRef = useRef()
  const titleInputRef = useRef()
  const descriptionInputRef = useRef()
  const adressInputRef = useRef()
  const hourInputRef = useRef()
  const dateInputRef = useRef()

  const materialClasses = makeStyles({
    root: {
      'margin-top': '10px'
    },
    multiline: {
      'margin-top': '9px'
    }
  })()

  const normalTheme = createTheme({
    palette: {
      primary: {
        main: '#525ee2'
      }
    }
  })

  useEffect(focusFirstModalElement, [meetupCreatorModalState])

  function focusFirstModalElement() {
    if (meetupCreatorModalState) {
      firstModalElementRef.current.focus()
    }
  }

  function formatDate(date) {
    const [year, month, day] = date.split('-')
    return [day, month, year].join('/')
  }

  function updateFrontEndDataOnPush(meetupEntry) {
    meetupsState.push(meetupEntry)
    changeMeetupsState(meetupsState)
  }

  function pushMeetupDataToDatabase(meetupEntry) {
    changeDataIsLoadingState(true)

    const userUID = currentUser.uid

    addDoc(collection(firestoreDatabase, `users/${userUID}/meetups`), {...meetupEntry})
    .then(returnedData => {
     changeDataIsLoadingState(false)

      meetupEntry.id = returnedData.id

      updateFrontEndDataOnPush(meetupEntry)
      changeFeedbackModalState([true, 'encontro criado', 'normal', 1500])
    })
    .catch(() => {
      changeDataIsLoadingState(false)
      changeFeedbackModalState([true, 'erro ao enviar dados: reinicie a página', 'error', 3000])
    })
  }

  function handleFormSubmit(event) {
    event.preventDefault()
    
    const meetupEntry = {
      image: urlInputRef.current.value,
      title: titleInputRef.current.value,
      description: descriptionInputRef.current.value,
      address: adressInputRef.current.value,
      hour: hourInputRef.current.value,
      date: formatDate(dateInputRef.current.value),
      isBookmarked: false
    }

    pushMeetupDataToDatabase(meetupEntry)
  }

  return (
    <div
      className={`modal-container ${meetupCreatorModalState ? 'modal-activer' : ''}`}
      role="dialog" aria-labelledby="meetup-creator-modal-label"
    >
      <header className="modal-header sticky-header">
        <h2 id="meetup-creator-modal-label">
          Criar Encontro
        </h2>
        <button className='first-modal-element'
          onClick={() => changeMeetupCreatorModalState(false)}
          aria-label="fechar janela de criação de encontro"
          ref={firstModalElementRef}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
        </button>
      </header>

      <form className="modal-form" onSubmit={handleFormSubmit} aria-label="criar encontro">
        <TextField className={materialClasses.root}
          type="url" label="URL da imagem" inputRef={urlInputRef}
          fullWidth inputProps={{'aria-label': 'URL da imagem do encontro'}}
        />
        <TextField className={materialClasses.root}
          required type="text" label="Título" inputRef={titleInputRef}
          fullWidth inputProps={{'aria-label': 'título'}}
        />
        <TextField className={materialClasses.multiline} 
          label="Descrição" multiline rows={4} inputRef={descriptionInputRef}
          fullWidth inputProps={{'aria-label': 'descrição'}}
        />

        <TextField className={materialClasses.root} 
          required type="text" label="Endereço" inputRef={adressInputRef}
          fullWidth inputProps={{'aria-label': 'endereço'}}
        />
        <TextField className={materialClasses.root} 
          required type="time" label="Horário" format="hh/mm" inputRef={hourInputRef}
          InputLabelProps={{shrink: true}} fullWidth inputProps={{'aria-label': 'horário'}}
        />
        <TextField className={materialClasses.root}
          required type="date" label="Data" format="dd/mm/yyyy" inputRef={dateInputRef}
          InputLabelProps={{shrink: true}} fullWidth inputProps={{'aria-label': 'data'}}
        />

        <div className="action-buttons-wrapper">
          <Button size="small" type="reset" color="error">resetar</Button>
          <ThemeProvider theme={normalTheme}>
            <Button size="small" type="submit">criar</Button>
          </ThemeProvider>
        </div>
      </form>
    </div>
  )
}

export default MeetupCreatorModal;
