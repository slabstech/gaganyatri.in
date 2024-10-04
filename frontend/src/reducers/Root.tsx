import { Provider } from "react-redux";
import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from "history";
import { routerMiddleware, ConnectedRouter } from "connected-react-router";
import { ReactNode } from 'react';

import rootReducer from "./Reducer";

const Root = ({ children, initialState = {} }: { children: ReactNode, initialState: any }) => {
  const history = createBrowserHistory();
  const middleware = [routerMiddleware(history)];

  const store = configureStore({
    reducer: rootReducer(history),
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(middleware),
  });

  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>{children}</ConnectedRouter>
    </Provider>
  );
};

export default Root;
