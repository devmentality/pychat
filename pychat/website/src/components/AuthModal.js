import React, {Component} from "react";

export default class AuthModal extends Component {
    state = {
        login_username: '',
        login_password: '',
        register_username: '',
        register_password: '',
    };

    render() {
        return (
            <div>
                <p>Authenticate, man!</p>
                <p>
                    <label>Username<input
                        type='text' name='login_username'
                        value={this.state.login_username} onChange={this.onChange.bind(this)} /></label>
                </p>
                <p>
                    <label>Password<input
                        type='password' name='login_password'
                        value={this.state.login_password} onChange={this.onChange.bind(this)} /></label>
                </p>
                <button
                    onClick={
                        async () => await this.props.onAuthenticate(this.state.login_username, this.state.login_password)
                    }>
                    Log in
                </button>

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
            </div>

        );
    }

    onChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
}