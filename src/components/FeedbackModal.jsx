import {useEffect, useRef} from 'react';

import styleClasses from '../scss/FeedbackModal.module.scss';

function FeedbackModal(props) {
  const {feedbackModalState, changeFeedbackModalState} = props

  let timeoutToCloseModal = useRef()

  const modalOptions = feedbackModalState.slice(1)

  useEffect(() => {
    if (feedbackModalState[0]) {
      const duration = feedbackModalState[3]

      clearTimeout(timeoutToCloseModal.current)
      timeoutToCloseModal.current = 
        setTimeout(() => {changeFeedbackModalState([false, ...modalOptions])}, duration)
    }
  }, [feedbackModalState, changeFeedbackModalState])

  function getModalType() {
    return feedbackModalState[2]
  }

  function getModalState() {
    return feedbackModalState[0]
  }

  return (
    <div 
      className={`
        ${styleClasses.modalContainer}
        ${getModalType() === 'error' ? styleClasses.modalErrorColor : ''}
        ${getModalType() === 'alert' ? styleClasses.modalAlertColor : ''}
        ${getModalState() ? styleClasses.modalActiver : ''}
      `}
    >
      <p><span>{feedbackModalState[1]}</span></p>
      <button onClick={() => changeFeedbackModalState([false, ...modalOptions])}
        aria-label="fechar janela de alerta"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
      </button>
    </div>
  )
}

export default FeedbackModal;
