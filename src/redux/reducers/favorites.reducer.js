
const favorites = (state = [], action) => {
    switch (action.type) {
      case "SET_FAVS_SUCCESS":
        return action.payload; 
      case "ADD_FAV_SUCCESS":
        return [...state, action.payload]; 
       case "DELETE_FAVS":
         return state.filter(fav => fav.id !== action.payload.id) 
      default:
        return state;
    }
  };
  
  export default favorites;
  