import React, {Component} from "react";
import './RoomList.css';

export default class RoomList extends Component {
    state = {
        newRoomTitle: ''
    };

    onChange(event) {
        this.setState({newRoomTitle: event.target.value});
    }

    async createRoom() {
        await this.props.onCreateRoom(this.state.newRoomTitle);
        this.setState({newRoomTitle: ''});
    }

    render() {
        const roomElements = this.props.rooms.map(
            room => (
                <li key={room.id}
                    className='list-element'>
                    <a onClick={async () => await this.props.onChangeRoom(room)}>
                        {room.title}
                    </a>
                </li>
            )
        );

        return (
            <div className='room-list'>
                <div className='list-header'>
                    <span>Rooms</span>
                    <div>
                        <input type='text' onChange={this.onChange.bind(this)} value={this.state.newRoomTitle} />
                        <button onClick={this.createRoom.bind(this)}>Create room</button>
                    </div>
                </div>
                <ul>
                    {roomElements}
                </ul>
            </div>
        )
    }
}