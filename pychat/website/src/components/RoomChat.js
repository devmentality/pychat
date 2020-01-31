import React, {Component} from "react";

export default class ChatRoom extends Component {
    render() {
        return (
            <div>
                {this.props.roomId ? `Приветствуем в комнате ${this.props.roomId}` : 'Комната еще не выбрана'}
            </div>
        )
    }
}