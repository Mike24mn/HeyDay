const business = (state = [], action) => {
  switch (action.type) {
    case "SET_BUS_SUCCESS":
      return action.payload;
    case "ADD_BUS_SUCCESS":
      return [...state, action.payload];
      case "SET_ALL_BUSINESSES":
        return action.payload;
    case "DELETE_BUS_SUCESS":
         return state.filter( bus => bus.id !== action.payload.id) 
     
      default:
        return state;

  }

  
};
export default business;
