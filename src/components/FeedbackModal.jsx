import {useEffect, useRef} from 'react';

import styleClasses from '../scss/FeedbackModal.module.scss';

function FeedbackModal(props) {
  const {feedbackModalState, changeFeedbackModalState} = props

  let timeoutToCloseModal = useRef()

  useEffect(() => {
    if (feedbackModalState[0]) {
      const modalOptions = feedbackModalState.slice(1)
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
      <span>{feedbackModalState[1]}</span>
    </div>
  )
}

export default FeedbackModal;
