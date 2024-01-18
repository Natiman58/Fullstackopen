import { filterChange } from "../reducers/filterReducer"
import { useDispatch } from "react-redux"


const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
        console.log(event.target.value)
        const query = event.target.value
        if (query === '') {
            dispatch(filterChange(''))
        } else {
            dispatch(filterChange(query))
        }
    }

    const style = {
        marginBottom: 10,
        autofocus: true
    }

    return (
        <div style={style}>
            Filter <input onChange={handleChange} />
        </div>
    )
}

export default Filter