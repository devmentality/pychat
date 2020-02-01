import React, {Component} from "react";
import './RoomChat.css';
import {getUserInfo} from "../utils";
import {addUserToRoom} from "../api";


export default class ChatRoom extends Component {
    state = {
        message: '',
        new_room_user: '',
    };

    onChange(event) {
        this.setState({[event.target.name]: event.target.value})
    }

    sendMessage() {
        this.props.onSendMessage(this.state.message);
        this.setState({message: ''});
    }

    async addUser() {
        await addUserToRoom(this.props.room.id, this.state.new_room_user);
        this.setState({new_room_user: ''});
    }

    render() {
        const messageElements = this.props.messages.map(
            msg => (
                <p key={msg.id}>{msg.text} <i>({msg.author.username})</i></p>
            )
        );
        return (
            <div className='room-chat'>
                <div className='room-header'>
                    <span>Приветствуем в комнате {this.props.room.title}</span>
                    {
                        getUserInfo().username === this.props.room.creator.username &&
                        <div>
                            <input type='text' name='new_room_user' onChange={this.onChange.bind(this)} />
                            <button onClick={this.addUser.bind(this)}>Add user</button>
                        </div>
                    }

                </div>
                <div className='room-messages'>
                    {messageElements}
                </div>
                <div className='sending'>
                    <textarea id='message-text' name='message' onChange={this.onChange.bind(this)} value={this.state.message}/>
                    <button id='send-button' onClick={this.sendMessage.bind(this)}>Send</button>
                </div>
            </div>
        )
    }
}