import {Link} from 'react-router-dom';

import styleClasses from '../scss/MainHeader.module.scss';

function MainHeader(props) {
  const {underlineAnchor} = props

  return (
    <header className={styleClasses.mainHeader}>
      <p>MyMeetups</p>

      <nav>
        <Link 
          className={`text-and-symbol-aligner ${underlineAnchor === 'first-anchor' ? styleClasses.underlinedAnchor : ''}`} 
          to="/"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H8V4h12v12zM10 9h8v2h-8zm0 3h4v2h-4zm0-6h8v2h-8z"/></svg>
          Encontros
        </Link>
        <Link 
          className={`text-and-symbol-aligner ${underlineAnchor === 'second-anchor' ? styleClasses.underlinedAnchor : ''}`}
          to="/bookmarks"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2zm0 15l-5-2.18L7 18V5h10v13z"/></svg>
          Bookmarks
        </Link>
      </nav>
    </header>
  )
}

export default MainHeader;
