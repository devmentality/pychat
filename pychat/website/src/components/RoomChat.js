import React, {Component} from "react";
import './RoomChat.css';

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
            <div className='room-chat'>
                <div className='room-header'><span>Приветствуем в комнате {this.props.room.title}</span></div>
                <div className='room-messages'>
                    {messageElements}
                </div>
                <div className='sending'>
                    <textarea id="message-text" onChange={this.onChangeMessage.bind(this)} value={this.state.message}/>
                    <button id="send-button" onClick={this.sendMessage.bind(this)}>Send</button>
                </div>
            </div>
        )
    }
}