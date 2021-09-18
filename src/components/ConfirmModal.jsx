import styleClasses from '../scss/ConfirmModal.module.scss';

function ConfirmModal(props) {
  const {confirmModalState, changeConfirmModalState} = props

  function handleMeetupDelete() {
    const cardIndex = confirmModalState[2]
    changeConfirmModalState([false, 'delete', cardIndex])
  }

  return (
    <div
      className={`${styleClasses.backdropArea} ${!confirmModalState[0] ? styleClasses.disableModal : ''}`}
    >
      <section className={styleClasses.modalContainer}>
        <header>
          <h2>Excluir</h2>
          <button onClick={() => changeConfirmModalState([false, 'delete'])}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
          </button>
        </header>

        <p>
          Quer mesmo excluir o encontro? <strong>Essa operação é irreversível</strong>.
        </p>

        <div>
          <button onClick={handleMeetupDelete} className="generic-button">excluir</button>
          <button onClick={() => changeConfirmModalState([false, 'delete'])} className="generic-button">voltar</button>
        </div>
      </section>
    </div>
  )
}

export default ConfirmModal;