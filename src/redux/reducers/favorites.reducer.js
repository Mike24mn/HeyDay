const favorites = (state = [], action)=>{
    switch (action.type) {
        case "SET_FAVORITES":
            return state
        case "ADD_FAV_SUCCESS":
            return [...state, action.payload]
       
            
           
    
        default:
            return state 
    }
}

export default favorites