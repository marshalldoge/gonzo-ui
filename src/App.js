import React from 'react';
import {
	HashRouter,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import {getCookie, parseJwt, isTokenValid } from "./utils";
import './App.scss';
import { Provider } from "react-redux";
import store from "./redux/store";
import moment from "moment";

const AdminLayout = React.lazy(() => import('./pages/AdminLayout/AdminLayout'));
const Login = React.lazy(() => import('./pages/Login/Login'));

const loading = () => <div>Loading...</div>;
const Authenticate= ()=>{
	//return true;

	console.log("Authenticando...");
	if(isTokenValid('authJWT')){
		console.log("Usuario authenticado :)");
		return true;
	}else{
		console.log("Usuario no autenticado :$");
		return false;
	}
}
const PrivateRoute = ({component: Component, ...rest}) => (
	 <Route {...rest} render={(props) => (
		  Authenticate()
			   ? <Component {...props} />
			   : <Redirect to={{
				   pathname: '/login',
				   state: {from: props.location}
			   }}/>
	 )}/>
)

function App() {
	return (
		 <div>
			 <Provider store = {store}>
				 <HashRouter>
					 <React.Suspense fallback={loading()}>
						 <Switch>
							 <Route exact path='/login' component={Login} render={props => <Login {...props}/>}></Route>
							 <PrivateRoute exact path='/adminLayout' component={AdminLayout} ></PrivateRoute>
							 <PrivateRoute path='/' component={AdminLayout}></PrivateRoute>
						 </Switch>
					 </React.Suspense>
				 </HashRouter>
			 </Provider>
		 </div>
	);
}

export default App;
