import React from 'react';
/*
const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
const Cards = React.lazy(() => import('./views/Base/Cards'));
const Carousels = React.lazy(() => import('./views/Base/Carousels'));
*/

//NEWS
const Dashboard = React.lazy(()=>import('./views/Dashboard/Dashboard'));
const Login = React.lazy(()=>import('./pages/Login/Login'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
    { path: '/', exact: true, name: 'Home' },
    { path: '/dashboard', name: 'dashboard', component: Dashboard },
	{ path: '/login', name: 'login', component: Login },
    /*
        { path: '/theme', exact: true, name: 'Theme', component: Colors },
    */

];

export default routes;
