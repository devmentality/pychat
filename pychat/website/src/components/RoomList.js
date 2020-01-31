import React, {Component} from "react";

export default class RoomList extends Component {
    render() {
        const roomElements = this.props.rooms.map(
            room => <li key={room.id}>{room.title}</li>
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