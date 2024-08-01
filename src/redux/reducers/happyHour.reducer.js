const happy = (state = [], action) => {
    switch (action.type) {
        case "SET_HAPPY_SUCCESS":
            return action.payload;
        case "ADD_HAPPY_SUCCESS":
            return [...state, action.payload];
        case "DELETE_HAPPY_SUCCESS":
          
            return state.filter(fav => fav.id !== action.payload);
        case "UPDATE_LIKE_SUCCESS":
            
            return state.map(like =>
                action.payload && like.id === action.payload.id ? { ...like, likes: like.likes + 1 } : like
            );
        case "UPDATE_INT_SUCCESS":
           
            return state.map(int =>
                action.payload && int.id === action.payload.id ? { ...int, interested: int.interested + 1 } : int
            );
        default:
            return state;
    }
};

export default happy