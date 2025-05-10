import { filterChange } from "../reducers/filterReducer"
import { useDispatch } from "react-redux"

const Filter = () => {
  const dispatch = useDispatch()
  const handleChange = (event) => {
    dispatch(filterChange(event.target.value))
  }

  return (
    <div>
      filter<input
        type="text"
        name="filter"
        onChange={handleChange}
      />
    </div>
  )
}

export default Filter
