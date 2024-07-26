const bussiness = (state = [], action)=>{
    switch (action.type) {
        case "SET_BUS_SUCCESS":
            return state
        case "ADD_BUS_SUCCESS":
            return [...state, action.payload]    
            
    
        default:
            return state
    }
}

export default bussiness 