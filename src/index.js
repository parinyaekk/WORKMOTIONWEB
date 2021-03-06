import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './css/styles.css';
import './css/fonts.css';
// import Login from './components/Login/Login';
import "./i18n";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
// ReactDOM.render(<Login />, document.getElementById('Login'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
