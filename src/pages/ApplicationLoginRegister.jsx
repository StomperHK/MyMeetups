import {Fragment, useState, useRef, useEffect} from 'react';

import {auth} from '../firebase';
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword, signInWithEmailAndPassword,
  signInWithRedirect, GoogleAuthProvider
} from "firebase/auth";

import {useHistory} from 'react-router-dom';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {makeStyles} from '@material-ui/core/styles';

import styleClasses from '../scss/ApplicationLoginRegister.module.scss';
import Header from '../components/Header';

function ApplicationLoginRegister(props) {
  useEffect(() => changeDataIsLoadingState(true), [])

  const [userOperation, changeUserOperation] = useState('login')
  const [showPassword, changeShowPassword] = useState(false)

  const emailInputRef = useRef()
  const passwordInputRef = useRef()

  const {
    changeDataIsLoadingState,
    changeFeedbackModalState
  } = props

  auth.languageCode = 'it'

  const history = useHistory()

  const userOperationObject = {
    'login': 'entrar',
    'register': 'registrar'
  }

  const normalTheme = createTheme({
    palette: {
      primary: {
        main: '#525ee2',
      }
    }
  })

  const inputMaterialClass = makeStyles({
    root: {
      margin: '10px 0px 14px 0px'
    },
  })()

  const centerButtonMaterialClass = makeStyles({
    root: {
      display: 'flex !important',
      margin: '0px auto !important'
    }
  })()

  const firebaseAuthenticationErrors = {
    'auth/email-already-exists': ['este e-mail já está sendo usado por outro usuário', 4000],
    'auth/email-already-in-use': ['esse e-mail já está sendo usado por outra conta: faça login com ele', 6000],
    'auth/user-not-found': ['usuário não encontrado', 3000],
    'auth/id-token-expired': ['o tôken expirou', 3000],
    'auth/id-token-revoked': ['o tôken já foi revogado', 3000],
    'auth/internal-error': ['erro interno: reinicie a página', 3500],
    'auth/invalid-email': ['e-mail inválido', 2500],
    'auth/invalid-id-token': ['o tôken não é válido', 3000],
    'auth/invalid-password': ['senha inválida', 2500],
    'auth/invalid-user-token': ['o seu tôken de login não é mais válido: faça login denovo', 5000],
    'auth/network-request-failed': ['problema de conexão: reinicie a página e tente denovo', 5000],
    'auth/operation-not-allowed': ['provedor de crendencial desconfigurado', 3500],
    'auth/requires-recent-login': ['problema de autentição: tente fazer login denovo', 4500],
    'auth/session-cookie-expired': ['cookie de sessão de expirado: reinicie a página', 4000],
    'auth/session-cookie-revoked': ['cookie de sessão revogado', 3000],
    'auth/too-many-requests': ['muitas requisições feitas: aguarde e tente denovo', 5000],
    'auth/unauthorized-domain': ['este domínio não pode fazer operações de autenticação', 5000],
    'auth/user-disabled': ['usuário desativado', 3000],
    'auth/user-token-expired': ['faça login novamente', 2000],
    'auth/weak-password': ['senha fraca', 2500],
    'auth/web-storage-unsupported': ['seu navegador não suporta armazenamento de dados', 5000],
    'auth/wrong-password': ['senha errada', 2500],
  }

  function redirectUserIfHeIsLogged() {
    history.replace('/')
  }

  function getUserState() {
    onAuthStateChanged(auth, user => {
      changeDataIsLoadingState(false)
      if (user) {
        redirectUserIfHeIsLogged()
      }
    }, error => callErrorMessageHandler(error.code))
  }

  useEffect(getUserState, [])

  function callErrorMessageHandler(errorCode) {
    const [treatedErrorMessage, duration] =
      firebaseAuthenticationErrors[errorCode] || ['erro inesperado: reinicie a página', 3000]
    
    changeFeedbackModalState([true, treatedErrorMessage, 'error', duration])
  }

  function createOperationWithEmailAndPassword(event) {
    event.preventDefault()
    
    const email = emailInputRef.current.value
    const password = passwordInputRef.current.value

    changeDataIsLoadingState(true)

    if (userOperation === 'register') {
      createUserWithEmailAndPassword(auth, email, password)
      .catch(error => {
        changeDataIsLoadingState(false)
        callErrorMessageHandler(error.code)
      })
    }
    else {
      signInWithEmailAndPassword(auth, email, password)
      .catch(error => {
        changeDataIsLoadingState(false)
        callErrorMessageHandler(error.code)
      })
    }
  }

  function signInUserWithProvider() {
    const provider = new GoogleAuthProvider()
    signInWithRedirect(auth, provider)
  }

  return (
    <Fragment>
      <Header auth={null} currentUser={null}>
        <Button size="small"
          startIcon={<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M8 16h8v2H8zm0-4h8v2H8zm6-10H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>}
          onClick={() => changeUserOperation('register')}
        >
          registrar
        </Button>

        <Button size="small"
          startIcon={<svg xmlns="http://www.w3.org/2000/svg" enableBackground="new 0 0 24 24" height="24px" viewBox="0 0 24 24" width="24px"><g><rect fill="none" height="24" width="24"/></g><g><path d="M11,7L9.6,8.4l2.6,2.6H2v2h10.2l-2.6,2.6L11,17l5-5L11,7z M20,19h-8v2h8c1.1,0,2-0.9,2-2V5c0-1.1-0.9-2-2-2h-8v2h8V19z"/></g></svg>}
          onClick={() => changeUserOperation('login')}
        >
          entrar
        </Button>
      </Header>

      <main className={styleClasses.mainFlexContainer}>
        <svg className={styleClasses.rocketImage} aria-label="imagem de um foguete no espaço" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 902.41854 826.20679"><path d="M726.94952,696.70767l8.67165,19.44392c-7.04887-1.12221-13.60391,4.89778-13.75121,12.62878s6.13979,15.77421,13.18911,16.8731c-1.34708,6.00231-7.16088,8.64855-12.20732,11.07451s-10.48544,6.44956-10.11,12.84517c.30146,5.13535,4.548,9.66922,9.05769,11.49215s9.24135,1.54272,13.80858,1.23684c-6.921,7.23984-7.59561,20.84776-1.51747,30.61081s18.21665,14.56912,27.30539,10.8112c-6.42186,7.98853-5.02668,22.61792,2.94328,30.86218,8.03432,8.31083,19.678,9.11525,29.85706,8.23972a132.23791,132.23791,0,0,0,71.00684-28.14c7.78173-6.1834,15.05042-13.45556,19.48953-22.94127s5.747-21.49572,1.61222-32.29045c1.1152,13.52239,14.64995,24.20276,26.82589,24.80038s22.80664-6.26052,31.84054-14.08111c12.014-10.40049,23.13736-24.9791,21.48841-42.967-.81631-8.90487-4.70578-17.46936-8.52054-25.765l-7.39565-16.08273c-2.98571-6.49278-6.03914-13.09517-10.53293-18.54375s-10.73125-9.66651-16.97307-9.62643c1.42718-6.5202,2.86077-13.28339,1.66478-20.211s-5.77577-14.10054-12.00424-15.72285c-7.92682-2.06468-14.6448,5.25038-22.6158,4.56081-7.67069-.6636-14.01-8.362-21.45871-11.4124a17.17785,17.17785,0,0,0-18.53718,3.20639c-4.722,4.6097-6.69032,12.39794-4.99586,19.76719,1.48435,6.45545,5.43465,12.14909,7.83232,18.37489s2.76983,14.231-1.8351,17.63129c-5.55664,4.103-14.01442-1.48021-18.35566-8.23484s-6.83379-14.93336-12.32361-20.614c-6.47924-6.70451-16.62148-8.27573-23.29257-3.60845s-9.22234,15.11922-5.85919,24.00383c2.74987,7.26449,9.04909,14.6135,6.86437,21.45428-2.309,7.2298-12.41262,6.31432-18.50707,1.20471s-10.14111-12.8059-16.16143-18.03027c-6.114-5.30562-14.09812-7.63035-21.10721-6.14573a21.73057,21.73057,0,0,0-15.57311,13.9151" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/>
          <path d="M867.34667,642.06633l-17.99256,8.35958a13.81228,13.81228,0,0,1-8.73392,1.17747c-2.61209-.61776-4.37716-2.21477-4.84109-4.3833l-4.18659-19.55422c-.7905-3.68869,2.26453-8.05314,7.26376-10.37585l9.93652-4.61663c4.99924-2.32271,10.305-1.8428,12.61429,1.14024l12.24431,15.81049c1.35812,1.75309,1.4403,4.132.22783,6.52669A13.81219,13.81219,0,0,1,867.34667,642.06633Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/><path d="M309.43024,280.65881A353.9984,353.9984,0,0,1,386.93192,156.602c29.00636-30.1117,74.15027-28.86051,74.15027-28.86051l.25785-.32A87.58018,87.58018,0,0,1,553.89276,98.509c4.30426,1.23514,7.615,1.78263,9.18943,1.23249,28.70712-10.04708,27.35834-32.72422,52.12616-50.99278,43.367-31.98718,187.21094,4.6535,207.4942,63.51371,16.43915,47.70488,89.82021,70.827,117.23582,107.31737q6.43059,8.55861,12.618,17.31558,2.90129,4.06824,5.73748,8.19783a730.4283,730.4283,0,0,1,52.14714,88.15542,514.11313,514.11313,0,0,1,26.10088,61.68445c28.591,83.58209,18.8138,145.8549-60.021,130.47014q-13.99815-2.739-27.32378-4.90113-19.2962-3.14892-37.24641-5.17566-24.17227-2.74893-45.99366-3.60217-7.33723-.29524-14.40509-.39579c-69.67037-.966-121.34893,12.1465-160.719,32.50168q-10.01082,5.16279-18.97332,10.92332a236.05444,236.05444,0,0,0-26.08005,19.31927,254.89837,254.89837,0,0,0-31.42249,32.19714l-.52216.6393c-46.04826,56.326-61.203,118.68168-93.23451,129.6607C383.67414,783.51013,297.07405,613.35008,288.193,446.896q-.67263-12.58159-.74315-25.09128-.04163-5.59155.055-11.15359c.14052-9.67346.567-19.28471,1.28114-28.7797q.40006-5.44542.92807-10.83322c.3879-3.87342.80989-7.72368,1.2976-11.54982C294.49493,331.442,300.58862,304.75806,309.43024,280.65881Z" transform="translate(-148.79073 -36.89661)" fill="#6c63ff"/>
          <path d="M733.83354,372.24025c-10.93522,5.09113-11.11539,27.895-7.68649,35.28386l6.21383,13.37421,39.60938-18.403-6.21383-13.37421C762.32083,381.73531,744.77678,367.16636,733.83354,372.24025Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/><path d="M627.39274,564.25616a4.33285,4.33285,0,0,1-4.06983-5.81934,4.29966,4.29966,0,0,1,2.24317-2.44043L830.11979,460.9583a4.33007,4.33007,0,0,1,5.752,2.10157,4.33573,4.33573,0,0,1-2.10254,5.752h-.00049L629.215,563.84991A4.30619,4.30619,0,0,1,627.39274,564.25616Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/><rect x="771.78772" y="414.47433" width="64.47381" height="217.68038" transform="translate(-294.43392 350.60655) rotate(-24.9202)" fill="#e6e6e6"/><path d="M567.90452,162.51413c-10.93522,5.09113-11.11539,27.895-7.68649,35.28386l6.21383,13.37421,39.60938-18.403L599.82741,179.395C596.39181,172.00919,578.84776,157.44024,567.90452,162.51413Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/><path d="M812.91932,664.76078l-17.99256,8.35958a13.81216,13.81216,0,0,1-8.73392,1.17747c-2.6121-.61775-4.37717-2.21476-4.84109-4.3833l-4.1866-19.55421c-.79049-3.68869,2.26453-8.05314,7.26377-10.37585l9.93651-4.61664c4.99924-2.32271,10.305-1.8428,12.6143,1.14025L819.224,652.31857c1.35811,1.75309,1.4403,4.132.22783,6.52668A13.81219,13.81219,0,0,1,812.91932,664.76078Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/><path d="M757.60057,692.20652,739.608,700.5661a13.81222,13.81222,0,0,1-8.73392,1.17747c-2.6121-.61776-4.37716-2.21476-4.84109-4.3833l-4.18659-19.55422c-.7905-3.68869,2.26452-8.05313,7.26376-10.37584l9.93652-4.61664c4.99923-2.32271,10.305-1.8428,12.61429,1.14024l12.24431,15.8105c1.35811,1.75308,1.4403,4.132.22783,6.52668A13.81219,13.81219,0,0,1,757.60057,692.20652Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/>
          <rect x="668.30169" y="227.97831" width="64.47381" height="440.01582" transform="translate(-272.32893 299.98873) rotate(-24.9202)" fill="#e6e6e6"/><polyline points="548.951 403.691 542.39 389.254 546.167 387.512 552.708 401.903 647.423 611.909 643.65 613.662" fill="#3f3d56"/><polyline points="622.951 391.691 616.39 377.254 620.167 375.512 626.708 389.903 721.423 599.909 717.65 601.662" fill="#3f3d56"/>
          <path d="M664.67094,266.81383l-79.22567,36.80928c-5.044-7.84723-20.24939-48.06017-16.83519-59.99122l-2.56272-11.37766,54.70348-25.416,7.32219,9.00725C638.94215,219.18044,660.10154,256.95133,664.67094,266.81383Z" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/><path d="M623.03676,207.325l-56.45093,26.22784c-2.08362.968-4.30262.61217-4.95626-.79495a1.95213,1.95213,0,0,1-.17209-.6429l-2.92164-31.16788c-.1251-1.33466,1.01667-2.84708,2.76109-3.65756L598.73374,179.896c1.74442-.81048,3.63664-.70769,4.576.24866l21.93586,22.33363c1.12192,1.14229.51268,3.09757-1.36081,4.36726A6.08075,6.08075,0,0,1,623.03676,207.325Z" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/><path d="M667.31315,451.514a7.62608,7.62608,0,0,1-1.814-.21387,5.60386,5.60386,0,0,1-3.89648-3.02539L627.09,373.992c-1.42822-3.0752.48926-7.00782,4.27442-8.76661l50.53613-23.48c3.78564-1.75976,8.02734-.6875,9.45654,2.38721l34.5127,74.2832a5.60256,5.60256,0,0,1-.20069,4.92872,8.50632,8.50632,0,0,1-4.07422,3.83789l-50.53564,23.479A8.9197,8.9197,0,0,1,667.31315,451.514Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/><rect x="658.61223" y="466.20786" width="64.47381" height="217.68038" transform="translate(-326.76927 307.73605) rotate(-24.9202)" fill="#e6e6e6"/><path d="M602.18887,210.58118l-17.14693,7.9667c-3.30882,1.53733-7.77287-1.02438-9.94972-5.70968s-1.25568-9.74905,2.05314-11.28637l17.14693-7.9667c3.30882-1.53733,7.77287,1.02438,9.94972,5.70968S605.4977,209.04386,602.18887,210.58118Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/><path d="M621.79921,423.44358c-10.93522,5.09113-11.11539,27.895-7.68649,35.28386l6.21383,13.37421,39.60938-18.403L653.7221,440.3244C650.2865,432.93864,632.74245,418.36969,621.79921,423.44358Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/>
          <path d="M440.1517,377.92488c-3.862,2.57319-7.8147-3.55124-3.87848-6.01018C440.135,369.34165,444.08773,375.46609,440.1517,377.92488Z" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/>
          <path d="M842.1517,289.92488c-3.862,2.57319-7.8147-3.55124-3.87848-6.01018C842.135,281.34165,846.08773,287.46609,842.1517,289.92488Z" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/><path d="M568.1517,359.92488c-3.862,2.57319-7.8147-3.55124-3.87848-6.01018C568.135,351.34165,572.08773,357.46609,568.1517,359.92488Z" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/><path d="M440.1517,599.92488c-3.862,2.57319-7.8147-3.55124-3.87848-6.01018C440.135,591.34165,444.08773,597.46609,440.1517,599.92488Z" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/>
          <path d="M637.1517,98.92488c-3.862,2.57319-7.8147-3.55124-3.87848-6.01018C637.135,90.34165,641.08773,96.46609,637.1517,98.92488Z" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/><path d="M447.1517,216.92488c-3.862,2.57319-7.8147-3.55124-3.87848-6.01018C447.135,208.34165,451.08773,214.46609,447.1517,216.92488Z" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/><polygon points="571.639 146.2 569.182 145.661 569.72 143.203 568.082 142.844 567.543 145.302 565.086 144.764 564.727 146.402 567.184 146.941 566.646 149.398 568.284 149.757 568.823 147.299 571.28 147.838 571.639 146.2" fill="#e6e6e6"/><polygon points="171.542 350.978 169.085 350.439 169.623 347.982 167.985 347.623 167.446 350.08 164.988 349.542 164.629 351.18 167.087 351.719 166.549 354.177 168.187 354.535 168.726 352.078 171.183 352.616 171.542 350.978" fill="#e6e6e6"/><path d="M824.22,492.33287a8.50983,8.50983,0,0,1-11.29014-4.12709l-10.11253-21.7655a8.5,8.5,0,0,1,15.41723-7.163l10.11253,21.76549A8.50983,8.50983,0,0,1,824.22,492.33287Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/><path d="M652.22,572.33287a8.50983,8.50983,0,0,1-11.29014-4.12709l-10.11253-21.7655a8.5,8.5,0,0,1,15.41723-7.163l10.11253,21.76549A8.50983,8.50983,0,0,1,652.22,572.33287Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/><path d="M808.64176,444.7781l-67.80585,31.50349c-4.317-6.71611-17.33058-41.13265-14.40852-51.34393l1.43426-11.42307,40.48614-19.86306,8.9714,7.505C789.95914,396.88314,808.53922,428.20455,808.64176,444.7781Z" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/><path d="M777.16178,442.59376l-17.14693,7.96671c-3.30882,1.53733-8.34353-2.25264-11.22164-8.44728s-2.52761-12.48665.78121-14.024l17.14693-7.96671c3.30882-1.53732,8.34353,2.25264,11.22164,8.44728S780.4706,441.05644,777.16178,442.59376Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/>
          <polyline points="482.951 446.691 476.39 432.254 480.167 430.512 486.708 444.903 581.423 654.909 577.65 656.662" fill="#3f3d56"/><path d="M696.60745,495.98143l-67.8059,31.50349c-10.00311-5.16492-25.29108-38.961-14.40851-51.34394l1.43428-11.42306,40.48614-19.86306,8.9714,7.505C674.58727,455.214,692.6967,487.54053,696.60745,495.98143Z" transform="translate(-148.79073 -36.89661)" fill="#e6e6e6"/><path d="M663.73193,490.79348l-17.14693,7.9667c-3.30882,1.53733-8.03047-1.57883-10.52388-6.94547s-1.82985-10.98484,1.479-12.52216l17.14693-7.96671c3.30882-1.53732,8.03047,1.57884,10.52388,6.94547S667.04075,489.25615,663.73193,490.79348Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/><circle cx="171.29146" cy="204.8449" r="103" fill="#ff6584"/><path d="M742.39622,349.02053l62.59321-182.809L736.2582,346.83222a3.44161,3.44161,0,1,0,6.138,2.18831Z" transform="translate(-148.79073 -36.89661)" fill="#f0f0f0" opacity="0.3"/>
          <path d="M901.95012,240.05454q-18.37971,6.10836-40.75145,12.00083c-77.14515,20.311-180.54976,36.15428-291.16558,44.61271-110.61535,8.45828-215.22739,8.51948-294.5635.17426-38.6472-4.06578-69.21495-9.91317-90.85368-17.381-22.90943-7.9053-34.94724-17.43191-35.77952-28.31364-1.62074-21.19968,40.21258-39.85854,75.59194-51.77816l.95819,2.84289C176.80129,218.58114,150.6779,235.879,151.8281,250.9191c1.4643,19.15595,46.64436,34.80631,123.95529,42.93958,79.16179,8.327,183.58052,8.26316,294.02138-.18138,110.44009-8.44531,213.6549-24.25739,290.63031-44.52332,75.17352-19.79057,117.45048-42.12921,115.98557-61.28547-1.21629-15.90466-32.56722-29.51036-88.2777-38.3124l.46834-2.963c40.48,6.39573,89.09256,18.70823,90.80107,41.04675.83181,10.88188-9.61776,22.12737-31.05892,33.424C936.13107,227.5031,920.60136,233.856,901.95012,240.05454Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/>
          <circle cx="783.42532" cy="375.13624" r="10.70234" fill="#ff6584"/><circle cx="851.42532" cy="665.13624" r="10.70234" fill="#f2f2f2"/><circle cx="486.42532" cy="720.13624" r="20.86614" fill="#f2f2f2"/><circle cx="327.42532" cy="454.13624" r="10.70234" fill="#3f3d56"/><polygon points="687.226 478.768 733.402 490.721 761.723 546.349 713.843 548.227 687.226 478.768" fill="#e6e6e6"/><polygon points="580.645 398.574 606.059 424.002 670.606 563.557 658.722 573.824 580.645 398.574" fill="#ccc"/><polygon points="525.386 421.624 527.38 457.52 588.304 598.694 603.88 596.688 525.386 421.624" fill="#ccc"/><polygon points="523.723 566.637 498.854 607.339 517.187 667.008 552.9 635.061 523.723 566.637" fill="#e6e6e6"/><path d="M892.19547,628.54368q-19.36816,0-42.45654-1.46387c-79.61377-5.05566-182.7378-22.63281-290.376-49.49219-107.63769-26.85937-206.93017-59.79394-279.58545-92.73437-35.39258-16.04688-62.55615-31.23633-80.73535-45.14746-19.24707-14.727-27.666-27.564-25.02393-38.15283,5.14795-20.62891,50.731-25.14209,88.064-25.29541l.01269,3c-51.26806.21044-81.51367,8.38671-85.16552,23.022-4.65186,18.64013,33.28662,47.74072,104.08691,79.84131,72.49561,32.86816,171.60547,65.73925,279.07324,92.55664,107.46729,26.8164,210.40137,44.36328,289.83985,49.4082,77.57861,4.92773,124.74316-2.9375,129.39453-21.57812,3.86181-15.47657-21.59815-38.2754-71.68945-64.19825l1.3789-2.66406c36.397,18.83594,78.64551,45.85156,73.22168,67.58887C979.59244,613.823,966.12955,621.199,942.21988,625.157,928.59049,627.41282,911.84977,628.54368,892.19547,628.54368Z" transform="translate(-148.79073 -36.89661)" fill="#3f3d56"/>
        </svg>

        <div className={styleClasses.gridContainerWrapper}>
          <h1>{userOperationObject[userOperation]}</h1>

          <div className={styleClasses.gridContainerForForm}>
            <form onSubmit={createOperationWithEmailAndPassword}>
              <p>e-mail e senha</p>
              <TextField
                type="email" label="e-mail" required fullWidth
                inputRef={emailInputRef} autoComplete='username'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>
                    </InputAdornment>
                  ),
                }}
              />

              <TextField className={inputMaterialClass.root}
                type={showPassword ? 'text' : 'password'} label="senha" required fullWidth
                inputRef={passwordInputRef} autoComplete='current-password'
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><g fill="none"><path d="M0 0h24v24H0V0z"/><path d="M0 0h24v24H0V0z" opacity=".87"/></g><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM9 6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9V6zm9 14H6V10h12v10zm-6-3c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z"/></svg>
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => changeShowPassword(!showPassword)} 
                        aria-label="mostrar senha" type="button"import
                      >
                        {
                          showPassword ?
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z" fill="none"/><path d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"/></svg> :
                          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"/></svg>
                        }
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                inputProps={{minLength: '8'}}
              />

              {
                userOperation === 'login' ?
                (
                  <p>Não tem uma conta? 
                    <button className={styleClasses.underlinedButton}
                      onClick={() => changeUserOperation('register')} 
                      type="button"
                    > 
                      Registre-se
                    </button>.
                  </p>
                ) :
                (
                  <Fragment>
                    <p>Já tem uma conta?
                      <button className={styleClasses.underlinedButton}
                        onClick={() => changeUserOperation('login')}
                        type="button"
                      >
                        Entrar
                      </button>.
                    </p>
                  </Fragment>
                )
              }

              <ThemeProvider theme={normalTheme}>
                <Button className={centerButtonMaterialClass.root}
                  size="small" variant="contained" type="submit"
                >
                  {userOperationObject[userOperation]}
                </Button>
              </ThemeProvider>
            </form>

            <div className={styleClasses.googleLoginContainer}>
              <p>google</p>
              <button onClick={signInUserWithProvider}>
                <figure>
                  <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.64 9.20483C17.64 8.56665 17.5827 7.95301 17.4764 7.36392H9V10.8453H13.8436C13.635 11.9703 13.0009 12.9235 12.0477 13.5616V15.8198H14.9564C16.6582 14.253 17.64 11.9457 17.64 9.20483Z" fill="#4285F4"></path><path d="M9 17.9999C11.43 17.9999 13.4673 17.194 14.9564 15.8194L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.7099H0.957275V13.0417C2.43818 15.9831 5.48182 17.9999 9 17.9999Z" fill="#34A853"></path><path d="M3.96409 10.7097C3.78409 10.1697 3.68182 9.59292 3.68182 8.99973C3.68182 8.40655 3.78409 7.82973 3.96409 7.28973V4.95792H0.957273C0.347727 6.17292 0 7.54746 0 8.99973C0 10.452 0.347727 11.8266 0.957273 13.0416L3.96409 10.7097Z" fill="#FBBC05"></path><path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92546L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"></path></svg>
                  <figcaption>Google</figcaption>
                </figure>
              </button>
            </div>
          </div>
        </div>
      </main>
    </Fragment>
  )
}

export default ApplicationLoginRegister;
