import {useEffect, useRef} from 'react';

import Button from '@mui/material/Button';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import styleClasses from '../scss/ConfirmModal.module.scss';

function ConfirmModal(props) {
  const {confirmModalState, changeConfirmModalState} = props

  const firstModalElementRef = useRef()

  const normalTheme = createTheme({
    palette: {
      primary: {
        main: '#525ee2',
      }
    }
  })

  useEffect(focusFirstModalElement, [confirmModalState])

  function focusFirstModalElement() {
    if (confirmModalState) {
      firstModalElementRef.current.focus()
    }
  }

  function handleUserConfirm() {
    const cardIndex = confirmModalState[2]
    changeConfirmModalState([false, confirmModalState[4], cardIndex, '', ''])
  }

  return (
    <div
      className={`${styleClasses.backdropArea} ${!confirmModalState[0] ? styleClasses.disableModal : ''}`}
      role="dialog" aria-label="confirme sua ação" aria-describedby="confirm-modal-description"
    >
      <div className={styleClasses.modalContainer}>
        <header className="modal-header">
          <h2>Alerta</h2>
          <button className={styleClasses.firstModalElement}
            onClick={() => changeConfirmModalState([false, '', null, confirmModalState[3], ''])} 
            aria-label='fechar alerta'
            ref={firstModalElementRef}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </button>
        </header>

        <p id="confirm-modal-description">
          {confirmModalState[3]} <strong>Essa operação é irreversível</strong>.
        </p>

        <div>
          <ThemeProvider theme={normalTheme}>
            <Button onClick={handleUserConfirm}
              size="small" variant="contained"
            >
              confirmar
            </Button>
            <Button onClick={() => changeConfirmModalState([false, '', null, confirmModalState[3], ''])}
              size="small"
            >
              voltar
            </Button>
          </ThemeProvider>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal;
