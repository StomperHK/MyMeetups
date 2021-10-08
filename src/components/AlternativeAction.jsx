import styleClasses from '../scss/AlternativeAction.module.scss';

function AlternativeAction(props) {
  return (
    <div className={styleClasses.alternativeActionWrapper}>
      {props.children}
    </div>
  )
}

export default AlternativeAction;
