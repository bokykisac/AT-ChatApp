import React from 'react';
import './App.css';
import axios from './axios';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {

  state = {
    username: '',
    password: '',
    messageAll: '',
    messageUser: '',
    isSigningUp: false,
    isLoggedIn: false,
    loggedUser: '',
    users: [],
    sendToUser: ''
  }

  componentDidMount() {

    // if(sessionStorage.getItem('username')){
    //   this.setState({isLoggedIn: true, loggedUser: sessionStorage.getItem('username')})
    // }

    let socket;
    const host = "ws://localhost:8080/WAR2020/ws";

    try {
      socket = new WebSocket(host);
      console.log('connect: Socket Status: ' + socket.readyState);

      socket.onopen = function () {
        console.log('onopen: Socket Status: ' + socket.readyState + ' (open)');
      }

      socket.onmessage = function (msg) {
        console.log('onmessage: Received: ' + msg.data);
      }

      socket.onclose = function () {
        socket = null;
      }

    } catch (exception) {
      console.log('Error' + exception);
    }
  }

  onClick = () => {
    axios.post("rest/chat/post/asdfasd", {})
      .then(res => console.log(res))
      .catch(err => console.log(err));
  }

  onSwitchFormHandler = () => {
    this.setState({ isSigningUp: !this.state.isSigningUp });
  }

  onRegisterHandler = (e) => {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password
    };

    axios.post("rest/chat/users/register", user)
      .then(res => {
        alert('Uspesna registracija');
        const oldUsers = [...this.state.users];
        oldUsers.push(user.username);
        this.setState({ isSigningUp: false, users: oldUsers })
      })
      .catch(err => alert("Greska pri registraciji/username vec postoji"));
  }

  onLoginHandler = (e) => {
    e.preventDefault();

    const user = {
      username: this.state.username,
      password: this.state.password
    };

    axios.post("rest/chat/users/login", user)
      .then(res => {
        this.setState({ isLoggedIn: true, loggedUser: user.username });
        // sessionStorage.setItem('username', user.username);
      })
      .catch(err => console.log(err));
  }

  onLogoutHandler = () => {
    axios.delete("rest/chat/users/loggedIn/" + this.state.loggedUser)
      .then(res => {
        console.log(res);
        this.setState({ isLoggedIn: false, loggedUser: '' })
      })
      .catch(err => console.log(err))
  }

  onGetLoggedUsersHandler = () => {
    axios.get("rest/chat/users/loggedIn")
      .then(res => alert("Success, proveriti consolu u WildFly"))
      .catch(err => console.log(err));
  }

  onGetRegisteredUsersHandler = () => {
    axios.get("rest/chat/users/registered")
      .then(res => alert("Success, proveriti consolu u WildFly"))
      .catch(err => console.log(err));
  }

  onSendMessageToAll = (msg) => {

    const message = {
      message: msg
    }

    console.log(msg);

    axios.post("rest/chat/messages/all", message)
      .then(res => console.log(res))
      .catch(err => console.log(err))
    this.setState({messageAll: ''})
  }

  onSendMessageToUser = (msg, to) => {
    
    const message = {
      message: msg,
      sendTo: to
    }

    axios.post("rest/chat/messages/user", message)
      .then(res => console.log(res))
      .catch(err => console.log(err));

  }

  onGetInboxHandler = () => {
    axios.get("rest/chat/messages/" + this.state.loggedUser)
      .then(res => alert("Success, proveriti konsolu."))
      .catch(err => console.log(err));
  }

  render() {

    let form = (
      <div className="row">
        <form style={{ margin: 'auto' }}>
          {this.state.isSigningUp
            ? <h5>Register new user</h5>
            : <h5>Login</h5>}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={this.state.username}
              onChange={(e) => this.setState({ username: e.target.value })} />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              className="form-control"
              id="password"
              name="password"
              value={this.state.password}
              onChange={(e) => this.setState({ password: e.target.value })}
            />
          </div>

          <div>
            {this.state.isSigningUp
              ? <button className="btn btn-primary" type="button" style={{ marginRight: '10px' }} onClick={(e) => this.onRegisterHandler(e)}>Register</button>
              : <button className="btn btn-primary" type="submit" style={{ marginRight: '10px' }} onClick={e => this.onLoginHandler(e)}>Login</button>}

            {this.state.isSigningUp
              ? <button className="btn btn-primary" type="button" onClick={this.onSwitchFormHandler} style={{ margin: '10px 0px' }}>Switch to Login</button>
              : <button className="btn btn-primary" type="button" onClick={this.onSwitchFormHandler} style={{ margin: '10px 0px' }}>Switch to Register</button>}
          </div>
        </form>
      </div>
    );

    if (this.state.isLoggedIn) {
      form = <div className="row">
        <h5>Logovani ste kao <strong>{this.state.loggedUser}</strong></h5>
      </div>;
    }

    return (
      <div className="container">
        <div className="row">
          <h1 style={{ margin: 'auto' }}>Chat APP</h1>
        </div>

        <hr />

        {form}

        <hr />

        <div className="row">
          <div className="col">
            <button className="btn btn-primary" type="button" onClick={this.onGetLoggedUsersHandler}>Get all logged users</button>
          </div>
          <div className="col">
            <button className="btn btn-primary" type="button" onClick={this.onGetRegisteredUsersHandler}>Get all registered users</button>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col">
            <div className="row">
              <label htmlFor="messageAll">Send message to all users</label>
            </div>
            <div className="row">
              <textarea
                name="messageAll"
                id="messageAll"
                cols="30"
                rows="3"
                value={this.state.messageAll}
                onChange={(e) => this.setState({messageAll: e.target.value})}></textarea>
            </div>
            <div className="row">
              <button className="btn btn-primary" style={{ margin: '10px 0px' }} onClick={() => this.onSendMessageToAll(this.state.messageAll)}>Send</button>
            </div>
          </div>

          <div className="col">
            <div className="row">
              <label htmlFor="selectUser">Send message to user:</label>
              <select name="selectUser" id="selectUser" style={{ margin: '0px 10px 10px 10px' }} value={this.state.sendToUser}
              onChange={(e) => this.setState({sendToUser: e.target.value})} >
                <option value="" hidden></option>
                {this.state.users.map(user => {
                  return <option key={user} value={user}>{user}</option>;
                })}
              </select>
            </div>

            <div className="row">
              <textarea name="messageUser" id="messageUser" cols="30" rows="3" value={this.state.messageUser} onChange={(e) => this.setState({messageUser: e.target.value})}></textarea>
            </div>

            <div className="row">
              <button className="btn btn-primary" style={{ margin: '10px 0px' }} onClick={() => this.onSendMessageToUser(this.state.messageUser, this.state.sendToUser)}>Send</button>
            </div>
          </div>
        </div>

        <hr />

        <div className="row">
          <div className="col">
            {this.state.isLoggedIn ? <button className="btn btn-primary" onClick={this.onGetInboxHandler}>Show all my messages</button> : null}
          </div>

          <div className="col">
            {this.state.isLoggedIn ? <button className="btn btn-danger" type="button" onClick={this.onLogoutHandler}>Logout</button> : null}
          </div>
        </div>

      </div >
    );
  }

}

export default App;
