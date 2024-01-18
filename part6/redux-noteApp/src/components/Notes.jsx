import { useDispatch, useSelector } from "react-redux"
import { toggleImportanceOf } from "../reducers/noteReducer"
import noteService from '../services/notes'


const Note = ({ note, handleClick }) => {
    return(
        <li onClick={handleClick}>
            {note.content + ' '}
            <strong>{note.important ? 'important' : ''}</strong>
        </li>
    )
}

const Notes = () => {
    const dispatch = useDispatch()
    const notes = useSelector(({ filter, notes }) => {
        if(filter === 'ALL'){
            return notes
        }
        return filter === 'IMPORTANT' ? notes.filter(note => note.important) : notes.filter(note => !note.important)
    })

    const changeImportance = async(id) => {
        const note = notes.find(note => note.id === id)
        const changedNote = {...note, important: !note.important}
        await noteService.updateNote(id, changedNote)
        dispatch(toggleImportanceOf(id))
    }

    return(
        <ul>
            {notes.map(note => 
                <Note 
                  key={note.id} 
                  note={note} 
                  handleClick={() => changeImportance(note.id)}
                />
            )}
        </ul>
    )
}

export default Notes