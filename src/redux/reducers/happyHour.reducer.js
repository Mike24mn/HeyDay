const happy = (state=[], action)=> {
    switch (action.type) {
        case "SET_HAPPY_SUCCESS":
            return action.payload
        case "ADD_HAPPY_SUCCESS":
            return [...state, action.payload]    
            
            
    
        default:
            return state 
    }
}

export default happy