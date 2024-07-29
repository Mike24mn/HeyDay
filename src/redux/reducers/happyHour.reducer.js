const happy = (state=[], action)=> {
    switch (action.type) {
        case "SET_HAPPY_SUCCESS":
            return action.payload
        case "ADD_HAPPY_SUCCESS":
            return [...state, action.payload]    
            
        case "DELETE_HAPPY_SUCCESS":
            return state.filter(fav => fav.id !== action.payload.id) 
    
        default:
            return state 
    }
}

export default happy