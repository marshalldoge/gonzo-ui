import React from 'react';
import {
	HashRouter,
	Route,
	Switch,
	Redirect
} from 'react-router-dom';
import {getCookie } from "./utils";
import './App.scss';
import { Provider } from "react-redux";
import store from "./redux/store";

const AdminLayout = React.lazy(() => import('./pages/AdminLayout/AdminLayout'));
const Login = React.lazy(() => import('./pages/Login/Login'));

const loading = () => <div>Loading...</div>;
const Authenticate= ()=>{
	return true;
	console.log("Authenticando...");
	if(getCookie("JWT") !== undefined){
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
							 <Route exact path='/Login' component={Login} render={props => <Login {...props}/>}></Route>
							 <PrivateRoute exact path='/AdminLayout' component={AdminLayout} ></PrivateRoute>
							 <PrivateRoute path='/' component={AdminLayout}></PrivateRoute>
						 </Switch>
					 </React.Suspense>
				 </HashRouter>
			 </Provider>
		 </div>
	);
}

export default App;
