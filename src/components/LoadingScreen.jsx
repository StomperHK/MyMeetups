import styleClasses from '../scss/LoadingScreen.module.scss'

function LoadingScreen() {
  return (
    <div className={styleClasses.backdropArea}>
      <div className={styleClasses.loadingBarWrapper}>
        <span></span>
      </div>
    </div>
  )
}

export default LoadingScreen;
