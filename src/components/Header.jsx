import {useState, useEffect, useRef} from 'react';

import {createTheme, ThemeProvider} from '@mui/material/styles';

import styleClasses from '../scss/Header.module.scss';
import UserProfile from './UserProfile';

function MainHeader(props) {
  const {auth, currentUser, changeDataIsLoadingState, changeFeedbackModalState} = props

  const [hambuguerMenuState, changeHambuguerMenuState] = useState(false)

  const hamburgerMenuRef = useRef()

  const whiteTheme = createTheme({
    palette: {
      primary: {
        main: '#ffffff',
      },
    },
  })

  return (
    <header className={styleClasses.header}>
      <p className={styleClasses.appName}>MyMeetups</p>
      
      <nav className={hambuguerMenuState ? styleClasses.showHamburguerMenu : ''}
        ref={hamburgerMenuRef}
      >
        <ThemeProvider theme={whiteTheme}>
          {props.children}
        </ThemeProvider>

        <UserProfile auth={auth} currentUser={currentUser}
          changeDataIsLoadingState={changeDataIsLoadingState}
          changeFeedbackModalState={changeFeedbackModalState}
        />

        <button className={`${styleClasses.hamburguerMenuCloser} button-with-white-background-transition-active`}
          onClick={() => changeHambuguerMenuState(false)}
          aria-label="fechar menú"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z"/></svg>
        </button>
      </nav>
      
      <button className={`${styleClasses.hamburguerButton} button-with-white-background-transition-active`}
        onClick={() => changeHambuguerMenuState(true)}
        aria-label="abrir menú"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>
      </button>
    </header>
  )
}

export default MainHeader;
