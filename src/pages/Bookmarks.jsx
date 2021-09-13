import {useEffect} from 'react';

function Bookmarks(props) {
  const {changeAnchorToGetUnderlinedState} = props

  useEffect(() =>changeAnchorToGetUnderlinedState('second-anchor'), [changeAnchorToGetUnderlinedState])

  return <h1>Bookmarks</h1>
}

export default Bookmarks;
