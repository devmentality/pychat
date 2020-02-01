import React, {Component} from "react";
import './RoomList.css';

export default class RoomList extends Component {
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
                <div className='list-header'><span>Rooms</span></div>
                <ul>
                    {roomElements}
                </ul>
            </div>
        )
    }
}