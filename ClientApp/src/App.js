import React from 'react';
import './App.css';
import axios from './axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

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
    onlineUsers: [],
    sendToUser: '',
    messages: [],
    subjectAll: '',
    subjectUser: ''
  }

  ws = null;

  componentDidMount() {

    if(localStorage.getItem('user') !== null){

      const user = {
        username: localStorage.getItem('user'),
        password: localStorage.getItem('password')
      };

      axios.post("rest/chat/users/login", user)
      .then(res => {

        localStorage.setItem('user', user.username);
        localStorage.setItem('password', user.password);

        this.ws = new WebSocket("ws://localhost:8080/WAR2020/ws/" + user.username);

        this.ws.onopen = (evt) => {
          console.log('onopen: Socket Status: ' + this.ws.readyState + ' (open)');


          const users = res.data.map(user => {
            return user.username;
          })

          this.setState({ onlineUsers: users });
        }

        this.ws.onmessage = (msg) => {
          console.log('onmessage: Received: ' + msg.data);

          if (msg.data.includes("LOGIN:")) {
            const user = msg.data.substring(6);
            console.log(`User ${user} is online.`);

            for (let onlineUser of this.state.onlineUsers) {
              if (onlineUser === user) {
                return;
              }
            }

            const users = [...this.state.onlineUsers];
            users.push(user);
            this.setState({ onlineUsers: users });
          }



          if (msg.data.includes("LOGOUT:")) {
            const user = msg.data.substring(7);
            console.log(`User ${user} logged off.`);

            const users = [...this.state.onlineUsers];

            const index = users.indexOf(user);

            if (index > -1) {
              users.splice(index, 1);
            }
            this.setState({ onlineUsers: users });
          }

        }

        this.ws.onclose = (evt) => {

          console.log(evt);

          // const users = [...this.state.onlineUsers];

          // const index = users.indexOf(this.state.loggedUser);
          // if (index > -1) {
          //   users.splice(index, 1);
          //   console.log("NASAO");
          // }

          // this.setState({ onlineUsers: users });
          this.onLogoutHandler();
          console.log("Session closed");

          this.ws = null;
        }

        this.setState({ isLoggedIn: true, loggedUser: user.username });
      })
      .catch(err => console.log(err));
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

        localStorage.setItem('user', user.username);
        localStorage.setItem('password', user.password);

        this.ws = new WebSocket("ws://localhost:8080/WAR2020/ws/" + user.username);

        this.ws.onopen = (evt) => {
          console.log('onopen: Socket Status: ' + this.ws.readyState + ' (open)');


          const users = res.data.map(user => {
            return user.username;
          })

          this.setState({ onlineUsers: users });
        }

        this.ws.onmessage = (msg) => {
          console.log('onmessage: Received: ' + msg.data);

          if (msg.data.includes("LOGIN:")) {
            const user = msg.data.substring(6);
            console.log(`User ${user} is online.`);

            for (let onlineUser of this.state.onlineUsers) {
              if (onlineUser === user) {
                return;
              }
            }

            const users = [...this.state.onlineUsers];
            users.push(user);
            this.setState({ onlineUsers: users });
          }



          if (msg.data.includes("LOGOUT:")) {
            const user = msg.data.substring(7);
            console.log(`User ${user} logged off.`);

            const users = [...this.state.onlineUsers];

            const index = users.indexOf(user);

            if (index > -1) {
              users.splice(index, 1);
            }
            this.setState({ onlineUsers: users });
          }

        }

        this.ws.onclose = (evt) => {

          console.log(evt);

          // const users = [...this.state.onlineUsers];

          // const index = users.indexOf(this.state.loggedUser);
          // if (index > -1) {
          //   users.splice(index, 1);
          //   console.log("NASAO");
          // }

          // this.setState({ onlineUsers: users });
          this.onLogoutHandler();
          console.log("Session closed");

          this.ws = null;
        }

        this.setState({ isLoggedIn: true, loggedUser: user.username });
      })
      .catch(err => console.log(err));
  }

  onLogoutHandler = () => {
    axios.delete("rest/chat/users/loggedIn/" + this.state.loggedUser)
      .then(res => {
        localStorage.removeItem('user');
        localStorage.removeItem('password');
        window.location.reload();
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
      sender: this.state.loggedUser,
      message: msg,
      subject: this.state.subjectAll
    }

    console.log(message);

    axios.post("rest/chat/messages/all", message)
      .then(res => alert("Poruka poslata svim registrovanim korisnicima"))
      .catch(err => console.log(err))
    this.setState({ messageAll: '', subjectAll: '' })
  }

  onSendMessageToUser = (msg, to) => {

    const message = {
      message: msg,
      reciver: to,
      sender: this.state.loggedUser,
      subject: this.state.subjectUser
    }

    console.log(message);

    axios.post("rest/chat/messages/user", message)
      .then(res => alert("Poruka poslata korisniku " + to))
      .catch(err => console.log(err));

    this.setState({ messageUser: '', subjectUser: '' });

  }

  onGetInboxHandler = () => {
    axios.get("rest/chat/messages/" + this.state.loggedUser)
      .then(res => this.setState({ messages: res.data }))
      .catch(err => console.log(err));
  }

  render() {

    let form = (
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
    );

    if (this.state.isLoggedIn) {
      form = <div className="container">
        <div className="row">
          <h5>Logovani ste kao <strong>{this.state.loggedUser}</strong></h5>
        </div>
        <div className="row">
          <button className="btn btn-danger" type="button" onClick={this.onLogoutHandler}>Logout</button>
        </div>
      </div>;
    }

    return (
      <div className="container">
        <div className="row">
          <h1 style={{ margin: 'auto' }}>Chat APP</h1>
        </div>

        <hr />

        <div className="row">
          <div className="col-8">
            {form}
          </div>
          {this.state.isLoggedIn ? <div className="col-4">
            <h5>Online users</h5>
            <ul className="list-group" style={{ height: '100px', overflowY: 'auto' }}>
              {this.state.onlineUsers.map(user => {
                return <li className="list-group-item" key={user}>{user}</li>
              })}
            </ul>
          </div> : null}
        </div>



        <hr />

        {this.state.isLoggedIn
          ? <div>
            <div className="row">
              <div className="col">
                <button className="btn btn-primary" type="button" onClick={this.onGetLoggedUsersHandler}>Get all logged users</button>
              </div>
              <div className="col">
                <button className="btn btn-primary" type="button" onClick={this.onGetRegisteredUsersHandler}>Get all registered users</button>
              </div>

              <div className="col">
                <button className="btn btn-primary" onClick={this.onGetInboxHandler}>Show all my messages</button>
              </div>
            </div>

            <hr />

            <div className="row">
              <div className="col">
                <div className="row">
                  <label htmlFor="messageAll">Send message to all users:</label>
                </div>
                <div className="row">
                  <input
                    style={{ margin: '5px 0px' }}
                    name="subjectAll"
                    value={this.state.subjectAll}
                    onChange={(e) => this.setState({ subjectAll: e.target.value })}
                    placeholder="Subject" />
                </div>
                <div className="row">
                  <textarea
                    name="messageAll"
                    id="messageAll"
                    cols="30"
                    rows="3"
                    value={this.state.messageAll}
                    onChange={(e) => this.setState({ messageAll: e.target.value })}></textarea>
                </div>
                <div className="row">
                  <button className="btn btn-primary" style={{ margin: '10px 0px' }} onClick={() => this.onSendMessageToAll(this.state.messageAll)}>Send</button>
                </div>
              </div>

              <div className="col">
                <div className="row">
                  <label htmlFor="selectUser">Send message to user:</label>
                  <select name="selectUser" id="selectUser" style={{ margin: '0px 10px 10px 10px' }} value={this.state.sendToUser}
                    onChange={(e) => this.setState({ sendToUser: e.target.value })} >
                    <option value="" hidden></option>
                    {this.state.onlineUsers.map(user => {
                      return <option key={user} value={user}>{user}</option>;
                    })}
                  </select>
                </div>

                <div className="row">
                  <input
                    style={{ margin: '5px 0px' }}
                    name="subjectUser"
                    value={this.state.subjectUser}
                    onChange={(e) => this.setState({ subjectUser: e.target.value })}
                    placeholder="Subject" />
                </div>

                <div className="row">
                  <textarea name="messageUser" id="messageUser" cols="30" rows="3" value={this.state.messageUser} onChange={(e) => this.setState({ messageUser: e.target.value })}></textarea>
                </div>

                <div className="row">
                  <button className="btn btn-primary" style={{ margin: '10px 0px' }} onClick={() => this.onSendMessageToUser(this.state.messageUser, this.state.sendToUser)}>Send</button>
                </div>
              </div>
            </div>


            <hr />

            {this.state.messages.length === 0 ? null :
              this.state.messages.map(message => {
                const date = new moment(message.msgDate).format("DD-MM-YYYY, hh:mm:ss");
                return (
                  <div className="card" key={message.msgDate}>
                    <div className="card-body">
                      <h5 className="card-title">FROM: {message.sender.username}</h5>
                      <h6 className="card-subtitle mb-2 text-muted">Subject: {message.subject}</h6>
                      <p className="card-text">{message.message}</p>
                      <footer className="blockquote-footer">{date}</footer>
                    </div>
                  </div>
                );
              })
            }



          </div>
          : null
        }




      </div >
    );
  }

}

export default App;
