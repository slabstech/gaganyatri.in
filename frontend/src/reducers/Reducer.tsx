
import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import { signupReducer } from "../components/signup/SignupReducer";
import { loginReducer } from "../components/login/LoginReducer"; // add import 

const createRootReducer = (history:any) =>
  combineReducers({
    router: connectRouter(history),
    createUser: signupReducer,
    auth: loginReducer // <--- add reducer
  });

export default createRootReducer;