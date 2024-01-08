const Note = ({ note, toggleImportance }) => {
  const label = note.important ? 'make not important' : 'make important'

  return (
    <li className="note" data-testid="custom-element">
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
    </li>
  )
}

export default Note