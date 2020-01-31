import React, { Component } from 'react';
import { getCookie, getUserInfo } from '../utils';
import { authenticate } from '../api';
import './appStyles.css';
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
            <div>
                <h1>Chat App</h1>
                {this.state.isAuthenticated ? <Chat user={this.state.user}/> : <AuthModal onAuthenticate={this.onAuthenticate.bind(this)} />}
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
}
