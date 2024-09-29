// src/reducers/urlReducer.js
const initialState = {
    url: 'initialUrl',
  };
  
  const urlReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SET_URL':
        return {
          ...state,
          url: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default urlReducer;
  