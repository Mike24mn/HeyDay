const happy = (state = [], action) => {
    switch (action.type) {
        case "SET_HAPPY_SUCCESS":
            return action.payload.map(item => ({
              ...item,
              userLiked: false,
              userInterested: false
            }));
        case "ADD_HAPPY_SUCCESS":
            return [...state, action.payload];
        case "DELETE_HAPPY_SUCCESS":
            return state.filter((fav) => fav.id !== action.payload);
        case "UPDATE_LIKE":
        case "UPDATE_LIKE_SUCCESS":
            return state.map((item) =>
                item.id === action.payload.id
                    ? { ...item, likes: item.likes + 1, userLiked: true }
                    : item
            );
        case "UNLIKE":
            return state.map((item) =>
                item.id === action.payload.id
                    ? { ...item, likes: item.likes - 1, userLiked: false }
                    : item
            );
        case "UPDATE_INT":
        case "UPDATE_INT_SUCCESS":
            return state.map((item) =>
                item.id === action.payload.id
                    ? { ...item, interested: item.interested + 1, userInterested: true }
                    : item
            );
        case "UNINTERESTED":
            return state.map((item) =>
                item.id === action.payload.id
                    ? { ...item, interested: item.interested - 1, userInterested: false }
                    : item
            );
        default:
            return state;
    }
};

export default happy;