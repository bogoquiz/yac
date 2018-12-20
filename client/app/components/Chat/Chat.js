import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl, ControlLabel, Grid, ListGroup, ListGroupItem } from "react-bootstrap";
import Container from 'react-bootstrap/lib/Container';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import 'whatwg-fetch';
import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:8000')

class Chat extends Component {
	constructor (props)	{
		super(props);

		this.state = {
			isMessagge: '',
			room: [],
			chatMessage: ''
		}

		this.sendSocketIO = this.sendSocketIO.bind(this);
		this.handleChange = this.handleChange.bind(this);
		//this.listChat = this.listChat.bind(this);
		socket.on('chat',(chatMessage) => {
			const { room } = this.state;
			room.push(chatMessage)		
			this.setState({room: room.map(item => { return <ListGroupItem>
									 							<b>{item.nick}</b> : <p>{item.message}</p> 
									 						</ListGroupItem>	

									 })			  
			})
		})

	}

   handleChange(e) {
	    this.setState({ chatMessage: e.target.value });
	  }

	sendSocketIO() {
		const {chatMessage, room} = this.state;
		console.log('hola email',this.props.nick)
    	socket.emit('example_message', {nick: this.props.nick, message: chatMessage});	
    	this.setState({chatMessage: ''});	
	}

	render(){
    const {
      chatMessage,
      room
    } = this.state;	

			return (
					<Container>
					 <Row className="show-grid">
    					<Col xs={12} md={8}>
      						<p>chatroom</p>
    							<ListGroup>
	    							{room}
  								</ListGroup>
    					</Col>
					    <Col xs={6} md={4}>
					      <p>usuarios</p>
					    </Col>	
					 </Row>  
					 <Row className="show-grid">
    					<Col xs={12} md={10}>
    					 <Form>	
						      <Form.Label>mensaje</Form.Label>
						      <Form.Control type="textarea" 
						      				placeholder="Envia tu mensaje"
						      			    value={chatMessage} 
						      			    onChange={this.handleChange}
						      			    />
						  </Form>  
    					</Col>
					    <Col xs={6} md={2}>
					      <Button onClick={this.sendSocketIO}>Send Socket.io</Button>
					    </Col>					 	
					 </Row> 				
    				</Container>
				)
		};

}

export default Chat;