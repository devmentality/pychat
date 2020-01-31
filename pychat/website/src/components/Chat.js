import React, {Component} from "react";
import RoomList from "./RoomList";
import RoomChat from "./RoomChat";
import { getRooms } from '../api';

export default class Chat extends Component {
    state = {
        currentRoomId: undefined,
        rooms: [],
    };

    async componentWillMount() {
        const response = await getRooms();
        const rooms = await response.json();
        if (rooms.length > 0)
            this.setState({rooms: rooms, currentRoomId: rooms[0].title});
    }

    render() {
        return (
            <div>
                <RoomList rooms={this.state.rooms}/>
                <RoomChat roomId={this.state.currentRoomId}/>
            </div>
        )
    }
}