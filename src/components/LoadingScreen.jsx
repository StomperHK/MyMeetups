import {useEffect} from 'react';

import styleClasses from '../scss/LoadingScreen.module.scss'

function LoadingScreen({dataIsLoading}) {
  useEffect(toggleHideWindowScrollbarWhenLoadingScreenAppears, [dataIsLoading])

  function toggleHideWindowScrollbarWhenLoadingScreenAppears() {
    const htmlEL = document.querySelector('html')

    if (dataIsLoading) {
      htmlEL.classList.add('overflow-hidden')
    }
    else {
      htmlEL.classList.remove('overflow-hidden')
    }
  }

  return (
    <div className={`${styleClasses.backdropArea} ${dataIsLoading ? styleClasses.showLoadingScreen : ''}`}
      role="progressbar" aria-valuetext="carregando" id="loading-screen"
    >
      <div className={styleClasses.loadingBarWrapper}>
        <span className={dataIsLoading ? styleClasses.playAnimation : ''}></span>
      </div>
    </div>
  )
}

export default LoadingScreen;
