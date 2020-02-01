import React, {Component} from "react";
import RoomList from "./RoomList";
import RoomChat from "./RoomChat";
import {getMessages, getRooms} from '../api';
import './Chat.css';

export default class Chat extends Component {
    state = {
        currentRoom: undefined,
        rooms: [],
        currentRoomMessages: undefined,
        currentRoomSocket: undefined,
    };

    async componentWillMount() {
        const response = await getRooms();
        const rooms = await response.json();
        this.setState({rooms: rooms});
    }

    render() {
        return (
            <div className='chat'>
                <RoomList rooms={this.state.rooms} onChangeRoom={this.onChangeRoom.bind(this)}/>
                <div className='room-container'>
                    {this.state.currentRoom ?
                        <RoomChat room={this.state.currentRoom}
                                  messages={this.state.currentRoomMessages}
                                  onSendMessage={this.onSendMessage.bind(this)}
                        /> :
                        'Комната еще не выбрана'
                    }
                </div>
            </div>
        )
    }

    async onChangeRoom(room) {
        const response = await getMessages(room.id);
        const messages = await response.json();

        const socket = new WebSocket(`ws://${window.location.host}/ws/chat/${room.id}/`);
        this.setState({
            currentRoom: room,
            currentRoomMessages: messages,
            currentRoomSocket: socket
        });

        const messagesBox = document.querySelector('.room-messages');
        messagesBox.scroll(0, messagesBox.scrollHeight);

        socket.onmessage = (e) => {
            const data = JSON.parse(e.data);
            const message = data.message;
            this.setState({
                currentRoomMessages: [...this.state.currentRoomMessages, message]
            });

            const messagesBox = document.querySelector('.room-messages');
            messagesBox.scroll(0, messagesBox.scrollHeight);
        };
    }

    onSendMessage(messageText) {
        this.state.currentRoomSocket.send(JSON.stringify(
            {
                'text': messageText
            })
        );
    }
}