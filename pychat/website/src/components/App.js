import React, { Component } from 'react';
import { getCookie } from '../utils';
import './appStyles.css';
import Chat from './Chat';
import AuthModal from './AuthModal';

export default class App extends Component {
    state = {
        isAuthenticated: false
    };

    componentWillMount() {
        const hasAuthCookie = getCookie('auth');
        if (hasAuthCookie) {
            this.setState({isAuthenticated: true});
        }
    }

    render() {
        return (
            <div>
                <h1>Chat App</h1>
                {this.state.isAuthenticated ? <Chat /> : <AuthModal onAuthenticate={this.authenticate.bind(this)} />}
            </div>
        )
    }

    async authenticate(username, password) {
        await fetch('/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({'username': username, 'password': password})
        });

        const hasAuthCookie = getCookie('auth');
        if (hasAuthCookie) {
            this.setState({isAuthenticated: true});
        }
    }
}
