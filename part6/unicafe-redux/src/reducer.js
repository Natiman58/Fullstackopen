const initialState = {
  good: 0,
  ok: 0,
  bad: 0
}

const counterReducer = (state = initialState, action) => {
  console.log(action)
  switch (action.type) {
    case 'GOOD':
      const updatedState = {...state, good: state.good + 1}
      return updatedState
    case 'OK':
      const updatedState2 = {...state, ok: state.ok + 1}
      return updatedState2
    case 'BAD':
      const updatedState3 = {...state, bad: state.bad + 1}
      return updatedState3
    case 'ZERO':
      const updatedState4 = {...state, good: 0, ok: 0, bad: 0}
      return updatedState4

    default: return state
  }
  
}

export default counterReducer
