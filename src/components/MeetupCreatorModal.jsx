import styleClasses from '../scss/MeetupCreatorModal.module.scss';
import TextField from '@material-ui/core/TextField';
// import {KeyboardTimePicker, KeyboardDatePicker} from '@material-ui/pickers';
import {makeStyles} from '@material-ui/core/styles';

function NewMeetup(props) {
  const {modalState} = props
  const {changeModalState} = props

  const useStyles = makeStyles({
    root: {
      display: 'flex',
      'margin-top': '16px',
      'input': {
        display: 'block'
      },
    }
  })
  const materialClasses = useStyles()
''
  return (
    <section
      className={`${styleClasses.modalContainer} ${modalState ? styleClasses.modalActiver : null}`}
    >
      <header>
        <h2>
          Criar Encontro
        </h2>
        <button onClick={() => changeModalState(false)} aria-label="fechar janela de criação de encontro">
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
        </button>
      </header>

      <form>
        <TextField className={materialClasses.root} 
          type="url" label="URL da imagem" 
        />
        <TextField className={materialClasses.root}
          required type="text" label="Título" 
        />
        <TextField className={materialClasses.root} 
          required label="Descrição" multiline rows={4}
          variant='outlined' 
        />

        <TextField className={materialClasses.root} 
          required type="text" label="Local" 
        />
        <TextField className={materialClasses.root} 
          required type="time" label="Horário" format="hh/mm" 
          InputLabelProps={{shrink: true}} 
        />
        <TextField className={materialClasses.root}
          required type="date" label="Data" format="dd/mm/yyyy"
          InputLabelProps={{shrink: true}} 
        />

        <button type="submit">criar</button>
      </form>
    </section>
  )
}

export default NewMeetup;
