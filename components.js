import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';
import AWS from 'aws-sdk/dist/aws-sdk-react-native'

export class BeerListContainer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      beers: []
    };
    this.addItem = this.addItem.bind(this);
  }

  addItem(name) {
    this.setState({
      beers: [].concat(this.state.beers).concat([name])
    })
  }

  googleSignIn(googleUser) {
    var id_token = googleUser.getAuthResponse().id_token;
    AWS.config.update({
      region: 'us-east-1',
      credentials: new AWS.CognitoIdentityCredentials({
        IdentityPoolId: "us-east-1:9ae5ac17-aac4-4ef3-9967-c254eddb8e0a",
        Logins: {
          'accounts.google.com': id_token
        }
      })
    })
    });
  }

  render() {
    return (
      <div>
        <GoogleLogin
          clientId="348539732529-cgdpd7b35tnmf5nbha97s2qrlo2lnvtc.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={this.googleSignIn}
          onFailure={this.googleSignIn}
        />
        <InputArea onSubmit={this.addItem}/>
        <BeerList items={this.state.beers}/>
      </div>
    );
  }
  
}

export class InputArea extends Component {

  constructor(props) {
    super(props);
    this.state = {
      text: ''
    };
    this.setText = this.setText.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  setText(event) {
    this.setState({text: event.target.value});
  }

  submitText() {
    this.props.onSubmit(this.state.text);
    this.setState({text: ''});
  }

  handleClick() {
    this.submitText()
  }

  handleKeyPress(event) {
    if (event.key == 'Enter') {
      this.submitText()
    }
  }

  render() {
    return (
      <div>
        <input value={this.state.text} onChange={this.setText} onKeyPress={this.handleKeyPress}/>
        <button onClick={this.handleClick}>Add</button>
      </div>
    );
  }

}
InputArea.PropTypes = {
  onSubmit: React.PropTypes.func.isRequired
};

export class BeerList extends Component {
  render() {
    return this.props.items ? (
      <ul>
        {this.props.items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>)
    : null;
  }
}
BeerList.PropTypes = {
  items: React.PropTypes.array.isRequired
};
