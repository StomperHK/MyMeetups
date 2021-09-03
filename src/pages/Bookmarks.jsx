function Bookmarks(props) {
  const {changeUnderlinedAnchor} = props

  changeUnderlinedAnchor('second-anchor')

  return <h1>Bookmarks</h1>
}

export default Bookmarks;
