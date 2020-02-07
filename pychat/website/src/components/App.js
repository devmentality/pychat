import React, { Component } from 'react';
import { getCookie, getUserInfo, deleteCookie } from '../utils';
import { authenticate } from '../api';
import './App.css';
import Chat from './Chat';
import AuthModal from './AuthModal';

export default class App extends Component {
    state = {
        isAuthenticated: false,
        user: undefined
    };

    componentWillMount() {
        const hasAuthCookie = getCookie('auth');
        if (hasAuthCookie) {
            this.setState({isAuthenticated: true, user: getUserInfo()});
        }
    }

    render() {
        return (
            <div className='main-app'>
                <div className='app-header'>
                    <h1 className='logo'>Chat <span>App</span></h1>
                    {this.state.isAuthenticated ? <div className='logout'><button onClick={this.onLogout.bind(this)}>Log out</button></div> : null}
                </div>
                <div className='app-container'>
                    {this.state.isAuthenticated ? <Chat user={this.state.user}/> : <AuthModal onAuthenticate={this.onAuthenticate.bind(this)} />}
                </div>
            </div>
        )
    }

    async onAuthenticate(username, password) {
        await authenticate(username, password);

        const hasAuthCookie = getCookie('auth');
        if (hasAuthCookie) {
            this.setState({isAuthenticated: true, user: getUserInfo()});
        }
    }

    async onRegister(username, password) {

    }

    onLogout() {
        deleteCookie('auth');
        this.setState({isAuthenticated: false, user: undefined});
    }
}
