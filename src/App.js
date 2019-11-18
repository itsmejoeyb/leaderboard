import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Image, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import Logo from './2019-Legendary-Lion-Main-Full-Color.png'
import './style.css'
import './App.css';

const dev = 'http://localhost:3200'
const live = 'http://leaderboard-api.legendarydevelopment.net/api'

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
    <Form id="form" className="form" onSubmit={handleSubmit}>
      <Form.Row>
        <Col>
          <Form.Group controlId="formGroupCompany">
            <Form.Control required
              type="text"
              placeholder="Company Name"
              value={company}
              name={"company"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col lg={8}>
          <Form.Group controlId="formGroupUrl">
            <Form.Control required
              type="text"
              placeholder="Website"
              value={url}
              name={"url"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col lg={4}>
          <Form.Group controlId="formGroupUrl">
            <Form.Control required
              type="text"
              placeholder="Time"
              value={time}
              name={"time"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Form.Row>
      <hr/>
      <Form.Row >
        <Col>
          <h5 className="pb-3">Where should we send your report?</h5>
        </Col>
      </Form.Row>
      <Form.Row>
        <Col>
          <Form.Group controlId="formGroupFirstName">
            <Form.Control required
              type="text" 
              placeholder="First Name" 
              value={first}
              name={"first"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col>
          <Form.Group controlId="formGroupLastName">
            <Form.Control required
              type="text" 
              placeholder="Last Name" 
              value={last}
              name={"last"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Form.Row>
      <Form.Row>  
        <Col>
          <Form.Group controlId="formGroupEmail">
            <Form.Control required
              type="text" 
              placeholder="Email" 
              value={email}
              name={"email"}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Form.Row>
    </Form>
  )
}

function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
}

function Player({ player, index, removePlayer }) {
  return(
    <Row className="player align-items-center">
      <Col lg={1}><h3>{ordinal_suffix_of(index + 1)}</h3></Col>
      <Col lg={4}><h3>{player.company}</h3></Col>
      <Col lg={5}><h3><a href={'https://' + player.url} target="_blank" rel="noopener noreferrer">{player.url}</a></h3></Col>
      <Col lg={1}><h3 className="text-right">{player.time}</h3></Col>
      <Col lg={1} className="text-right"><button className="btn" onClick={() => removePlayer(index, player)}><span className="close-icon" aria-hidden="true">&times;</span></button></Col>
    </Row>
  )
}

function App() {
  const [players, setPlayers] = useState([])

  useEffect(() => {
    fetch(`${live}/get_players`, {
      mode: 'cors',
    })
      .then(res => res.json())
      .then(data => {
        setPlayers(data.sort((a, b) => a.time - b.time))
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetch(`${live}/get_players`, {
        mode: 'cors',
      })
      .then(res => res.json())
      .then(data => {
        setPlayers(data.sort((a, b) => a.time - b.time))
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const addPlayer = state => {
    const { first, last, company, email, url, time } = state

    const newPlayer = [...players, {first, last, email, company, url, time}]
    newPlayer.sort((a, b) => a.time - b.time)
    setPlayers(newPlayer)
    fetch(`${live}/new_player`, {
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
    fetch(`${live}/player/${player.url}`, {
      method: 'DELETE'
    })
    setPlayers(newPlayers)
  }

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div className="App">
      <Container className="loaded-list h-100">
        <Row className="header sticky-top align-items-end pb-3">
          <Col lg={3}>
            <Image className="logo" src={Logo} rounded />
          </Col>
          <Col lg={6}>
            <h4 className="title-small">legendarylion.com</h4><h1 className="title-large">#GETLOADED</h1>
          </Col>
          <Col lg={3} className="text-right align-self-center">
            <Button className="btn btn-lg btn-outline-light" variant="outline" onClick={handleShow}>Add New</Button>
          </Col>
          <Col lg={12}>
            {/* <Row className="pt-5">
              <Col lg={1}><h5 className="column-title">Rank</h5></Col>
              <Col lg={4}><h5 className="column-title">Company</h5></Col>
              <Col lg={5}><h5 className="column-title">Website</h5></Col>
              <Col lg={1}><h5 className="column-title">Time</h5></Col>
              <Col lg={1}></Col>
            </Row> */}
          </Col>
        </Row>
        {players.map((player, index) => (
          <Player 
            key={index} 
            index={index} 
            player={player} 
            removePlayer={removePlayer} 
          />
        ))}
      </Container>
      
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>New Score</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <PlayerForm addPlayer={addPlayer} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose} type="submit" form="form">
            Submit
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
}

export default App;
