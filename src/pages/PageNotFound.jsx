import {useEffect} from 'react';

import Button from '@mui/material/Button';
import {createTheme, ThemeProvider} from '@mui/material/styles';

import {Link} from 'react-router-dom';

import styleClasses from '../scss/PageNotFound.module.scss';

function PageNotFound({changeDataIsLoadingState}) {
  useEffect(() => changeDataIsLoadingState(false), [])

  const normalTheme = createTheme({
    palette: {
      primary: {
        main: '#525ee2'
      }
    }
  })

  return (
    <main className={styleClasses.mainFlexWrapper}>
      <div className={styleClasses.gridContainer}>
        <p>404</p>
        <div>
          <p>Página não encontrada</p>
          <ThemeProvider theme={normalTheme}>
            <Link to="/">
              <Button size="small" fullWidth>
                voltar ao início
              </Button>
            </Link>
          </ThemeProvider>
        </div>
      </div>
    </main>
  )
}

export default PageNotFound;
