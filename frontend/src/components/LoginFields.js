import React from "react";
import * as Realm from "realm-web";
import {
  app,
  client
} from "../index";
import {
  Navbar,
  Nav,
  Button,
  Form,
  FormControl
} from "react-bootstrap";

export default function LoginFields(props) {

  const { loggedIn, setLoggedIn } = props;
  const { setShowRanking } = props;
  const { setShowLastGame } = props;

  const [username, setUsername] = React.useState(
    app.currentUser ? app.currentUser.profile.email : ""
  );
  const [password, setPassword] = React.useState("");

  // Handle login
  async function handleLogin(event) {
    try {
      event.preventDefault();
      const user = await app.logIn(Realm.Credentials.emailPassword(username, password));
      console.log("Successfully email/password logged in!", user.id);
      setLoggedIn(
        app.currentUser ? true : false
      );
      await client.clearStore()
      await client.resetStore()
    } catch (err) {
      try {
        await app.emailPasswordAuth.registerUser(username, password);
        const user = await app.logIn(Realm.Credentials.emailPassword(username, password));
        console.log("Successfully email/password logged in!", user.id);
        setLoggedIn(
          app.currentUser ? true : false
        );
        await client.clearStore()
        await client.resetStore()
      } catch (error) {
        console.error("Failed to log in", error.message);
        alert(`Ops!, ${error.error}`);
      }
    }
  }

  // Handle logout
  async function handleLogout() {
    try {
      const user = app.currentUser;
      if (user.id === app.currentUser.id) {
        app.currentUser.logOut();
        await app.removeUser(user);
      }
      setLoggedIn(
        app.currentUser ? true : false
      );
    } catch (err) {
      console.error("Failed to logout", err.message);
    }
  }

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  return (
    <Navbar bg="dark" expand="lg" variant="dark">
      <Navbar.Brand href="#home">
        {loggedIn ? (`Signed in as: ${username}`) : ("Please, Login or Register")}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse className="justify-content-start">
        <Nav className="mr-auto">
          <Nav.Link>
            {loggedIn &&
              <Button
                onClick={() => setShowRanking(true)}
                variant="secondary"
                disabled={!loggedIn}>Ranking
              </Button>
            }
          </Nav.Link>
          <Nav.Link>
            {loggedIn &&
              <Button
                onClick={() => setShowLastGame(true)}
                variant="secondary"
                disabled={!loggedIn}>Game Stats
              </Button>
            }
          </Nav.Link>
        </Nav>
        <Form className="d-flex" inline onSubmit={handleLogin}>
          <FormControl
            type="text"
            placeholder="Enter email"
            className="mr-sm-2"
            value={username}
            onChange={(e) => setUsername(e.target.value)} />
          <FormControl
            type="password"
            placeholder="Password"
            className="mr-sm-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          {loggedIn ?
            (<Button onClick={handleLogout} variant="secondary">Logout</Button>) :
            (<Button type="submit" variant="success" disabled={!validateForm()}>Login/Register</Button>)}
        </Form>
      </Navbar.Collapse>
    </Navbar>
  );
}