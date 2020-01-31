import React, {Component} from "react";

export default class RoomList extends Component {
    render() {
        const roomElements = this.props.rooms.map(
            room => (
                <li key={room.id}>
                    <a onClick={async () => await this.props.onChangeRoom(room)}>
                        {room.title}
                    </a>
                </li>
            )
        );

        return (
            <div>
                <h3>Rooms:</h3>
                <ul>
                    {roomElements}
                </ul>
            </div>
        )
    }
}