import React, { Component } from 'react';
import { Button, Form, FormGroup, FormControl } from "react-bootstrap";
import 'whatwg-fetch';


class SignUp extends Component {
 constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',      
      signUpError: '',
      signUpNickName: '',
      signUpEmail: '',
      signUpPassword: '',
    };

	    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
	    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
	    this.onTextboxChangeSignUpNickName = this.onTextboxChangeSignUpNickName.bind(this);
	    
	    this.onSignUp = this.onSignUp.bind(this);
	}

    onTextboxChangeSignUpEmail(event) {
    	this.setState({
      		signUpEmail: event.target.value,
    	});
  	}

  	onTextboxChangeSignUpPassword(event) {
    	this.setState({
      		signUpPassword: event.target.value,
    	});
  	}

  	onTextboxChangeSignUpNickName(event) {
    	this.setState({
      		signUpNickName: event.target.value,
    	});
  	}

  	onSignUp() {
	    const {
	      signUpEmail,
	      signUpPassword,
	      signUpNickName
	    } = this.state;

	    this.setState({
	      isLoading: true,
	    });

	    fetch('/api/account/signup', {
	      method: 'POST',
	      headers: {
	        'Content-Type': 'application/json'
	      },
	      body: JSON.stringify({
	        email: signUpEmail,
	        password: signUpPassword,
	        nickname: signUpNickName
	      }),
	    }).then(res => res.json())
	      .then(json => {
	        console.log('json', json);
	        if (json.success) {
	          this.setState({
	            signUpError: json.message,
	            isLoading: false,
	            signUpNickName: '',
	            signUpEmail: '',
	            signUpPassword: '',
	          });
	        } else {
	          this.setState({
	            signUpError: json.message,
	            isLoading: false,
	          });
	        }
	      });
  	}
  

render() {
    const {
      isLoading,
      token,
      signUpEmail,
      signUpNickName,
      signUpPassword,
      signUpError,
    } = this.state; 


    if (!token) {
      return (
        <div className="Login">
 			<Form>       
	            {
	              (signUpError) ? (
	                <p>{signUpError}</p>
	              ) : (null)
	            }
	            <Form.Label>Sign Up</Form.Label>

	            <Form.Control
	              type="nickname"
	              placeholder="NickName"
	              value={signUpNickName}
	              onChange={this.onTextboxChangeSignUpNickName}
	            /><br />
	            <Form.Control
	              type="email"
	              placeholder="Email"
	              value={signUpEmail}
	              onChange={this.onTextboxChangeSignUpEmail}
	            /><br />
	            <Form.Control
	              type="password"
	              placeholder="Password"
	              value={signUpPassword}
	              onChange={this.onTextboxChangeSignUpPassword}
	            /><br />
	            <Button onClick={this.onSignUp}>Sign Up</Button>
	        </Form>    
        </div>
      );
    }
  }
}

export default SignUp; 
