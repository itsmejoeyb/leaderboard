import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './2019-Legendary-Lion-Main-Full-Color.png'
import './App.css';

function PlayerForm({addPlayer}) {
  const defaultState = {
    first: "",
    last: "",
    company: "",
    email: "",
    url: "",
    time: ""
  }
  const [state, setState] = useState(defaultState)
  const {first, last, company, email, url, time } = state

  const handleSubmit = e => {
    e.preventDefault()
    if(!state) return
    addPlayer(state)
    setState(defaultState)
  }

  function handleChange(e) {
    const target = e.target
    setState(prevState => ({
      ...prevState, [target.name]: target.value
    }))
  }

  return (
    <Form className="form" onSubmit={handleSubmit}>
      <Form.Row>
        <Col>
          <Form.Group controlId="formGroupFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control required
              type="text" 
              placeholder="Enter first name" 
              value={first}
              name={"first"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formGroupLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control required
              type="text" 
              placeholder="Enter last name" 
              value={last}
              name={"last"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formGroupEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control required
              type="text" 
              placeholder="Enter email" 
              value={email}
              name={"email"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formGroupCompany">
            <Form.Label>Company Name</Form.Label>
            <Form.Control required
              type="text" 
              placeholder="Enter company name" 
              value={company}
              name={"company"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formGroupUrl">
            <Form.Label>Website</Form.Label>
            <Form.Control required
              type="text" 
              placeholder="Enter website" 
              value={url}
              name={"url"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formGroupUrl">
            <Form.Label>Time</Form.Label>
            <Form.Control required
              type="text" 
              placeholder="Enter time" 
              value={time}
              name={"time"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Form.Row>
      <Button type="submit">Submit</Button>
    </Form>
  )
}

function Player({ player, index, removePlayer }) {
  return(
    <Row className="player align-items-center text-center">
      <Col lg={1}><h3>{index + 1}</h3></Col>
      <Col lg={4}><h3>{player.name}</h3></Col>
      <Col lg={5}><h3><a href={player.url} target="_blank" rel="noopener noreferrer">{player.url}</a></h3></Col>
      <Col lg={1}><h3>{player.time}</h3></Col>
      <Col lg={1}><button className="btn btn-primary" onClick={() => removePlayer(index, player)}>Delete</button></Col>
    </Row>
  )
}

function App() {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    fetch('https://hidden-badlands-09770.herokuapp.com/get_players', {
      mode: 'cors',
    })
    .then(res => res.json())
    .then(data => {
      setPlayers(data.sort((a, b) => a.time - b.time))
    })
  }, [])

  const addPlayer = state => {
    const first = state.first, last= state.last, company = state.company, email = state.email, url = state.url, time = state.time

    const newPlayer = [...players, {first, last, email, company, url, time}]
    newPlayer.sort((a, b) => a.time - b.time)
    setPlayers(newPlayer)
    fetch('https://hidden-badlands-09770.herokuapp.com/new_player', {
      // mode: 'cors',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ first, last, email, company, url, time })
    })
    .then(res => console.log(res))
  }

  const removePlayer = (index, player) => {
    const newPlayers = [...players]
    newPlayers.splice(index, 1)
    fetch(`https://hidden-badlands-09770.herokuapp.com/player/${player.url}`, {
      method: 'DELETE'
    })
    setPlayers(newPlayers)
  }

  return (
    <Container className="App">
      <Row className="header text-center align-items-center">
        <Col lg={3}>
          <Image className="logo" src={Logo} rounded/>
        </Col>
        <Col lg={6}>
          <h4 className="title-small">legendarylion.com</h4><h1 className="title-large">#GETLOADED</h1>
        </Col>
        <Col lg={3}></Col>
      </Row>
      <Row className="text-center">
        <Col lg={1}><h3 className="column-title">Rank</h3></Col>
        <Col lg={4}><h3 className="column-title">Company</h3></Col>
        <Col lg={5}><h3 className="column-title">Website</h3></Col>
        <Col lg={1}><h3 className="column-title">Time</h3></Col>
        <Col lg={1}></Col>
      </Row>
      <div className="loaded-list">
        {players.map((player, index) => (
          <Player 
            key={index} 
            index={index} 
            player={player} 
            removePlayer={removePlayer} 
          />
        ))}
      </div>
      <PlayerForm addPlayer={addPlayer} />
    </Container>
  );
}

export default App;
