import { configureStore } from '@reduxjs/toolkit';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { connectRouter } from 'connected-react-router';
import { signupReducer } from "../components/signup/SignupReducer";
export const history = createBrowserHistory();

const rootReducer = {
  router: connectRouter(history),
  createUser: signupReducer,
};

const middleware = [routerMiddleware(history)];

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
});

export default store;
