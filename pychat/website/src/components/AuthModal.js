import React, {Component} from "react";

export default class AuthModal extends Component {
    state = {
        username: '',
        password: ''
    };

    render() {
        return (
            <div>
                <p>Authenticate, man!</p>
                <p>
                    <label>Username<input type='text' name='username' value={this.state.username} onChange={this.onChange.bind(this)} /></label>
                </p>
                <p>
                    <label>Password<input type='password' name='password' value={this.state.password} onChange={this.onChange.bind(this)} /></label>
                </p>
                <button onClick={async () => await this.props.onAuthenticate(this.state.username, this.state.password)}>Log in</button>
            </div>
        );
    }

    onChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }
}