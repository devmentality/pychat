import React, { Component } from "react";
import './AuthModal.css'
import { func } from "prop-types";

export default class AuthModal extends Component {
    state = {
        login_username: '',
        login_password: '',
        register_username: '',
        register_password: '',
    };

    render() {
        return (
            <div id="main-container">
                <div id="auth" className="auth-block">
                    <p className="auth-man">Authenticate, <span>man!</span></p>
                    <div className="field">
                        <label>Username</label>
                        <input
                            type='text' name='login_username'
                            value={this.state.login_username} onChange={this.onChange.bind(this)} />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input
                            type='password' name='login_password'
                            value={this.state.login_password} onChange={this.onChange.bind(this)} />
                    </div>
                    <button
                        className="auth-button"
                        onClick={
                            async () => await this.props.onAuthenticate(this.state.login_username, this.state.login_password)
                        }>
                        Log in
                    </button>
                    <p className="change-type">Don't have an account? <span onClick={() => change()}>Make it now!</span></p>
                </div>

                <div id="reg" className="invisible auth-block">
                    <p className="auth-man">Register, <span>man!</span></p>
                    <div className="field">
                        <label>Username</label>
                        <input
                            type='text' name='register_username'
                            value={this.state.register_username} onChange={this.onChange.bind(this)} />
                    </div>
                    <div className="field">
                        <label>Password</label>
                        <input
                            type='password' name='register_password'
                            value={this.state.register_password} onChange={this.onChange.bind(this)} />
                    </div>
                    <button
                        className="auth-button"
                        onClick={
                            async () => await this.props.onRegister(this.state.register_username, this.state.register_password)
                        }>
                        Register
                    </button>
                    <p className="change-type">Have an account? <span onClick={() => change()}>Just log in!</span></p>
                </div>
            </div>

        );
    }

    onChange(event) {
        this.setState({ [event.target.name]: event.target.value });
    }
}

function change() {
    const auth = document.querySelector('#auth');
    const reg = document.querySelector('#reg');
    if (Array.from(auth.classList).some(className => className === "invisible")) {
        reg.classList.add('invisible');
        auth.classList.remove('invisible');    
    } else {
        auth.classList.add('invisible');
        reg.classList.remove('invisible');    
    }
}

/*
<p>Register, man!</p>
                <p>
                    <label>Username<input
                        type='text' name='register_username'
                        value={this.state.register_username} onChange={this.onChange.bind(this)} /></label>
                </p>
                <p>
                    <label>Password<input
                        type='password' name='register_password'
                        value={this.state.register_password} onChange={this.onChange.bind(this)} /></label>
                </p>
                <button
                    onClick={
                        async () => await this.props.onRegister(this.state.register_username, this.state.register_password)
                    }>
                    Register
                </button>
*/