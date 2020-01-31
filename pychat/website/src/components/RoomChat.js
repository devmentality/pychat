import React, {Component} from "react";

export default class ChatRoom extends Component {
    state = {
        message: ''
    };

    onChangeMessage(event) {
        this.setState({message: event.target.value})
    }

    sendMessage() {
        this.props.onSendMessage(this.state.message);
        this.setState({message: ''});
    }

    render() {
        const messageElements = this.props.messages.map(
            msg => (
                <p key={msg.id}>{msg.text} <i>({msg.author.username})</i></p>
            )
        );
        return (
            <div>
                <p>Приветствуем в комнате {this.props.room.title}</p>
                <div>
                    {messageElements}
                </div>
                <div>
                    <textarea id="message-text" onChange={this.onChangeMessage.bind(this)} value={this.state.message}/>
                    <button id="send-button" onClick={this.sendMessage.bind(this)}>Send</button>
                </div>
            </div>
        )
    }
}