import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { Container, Col, Row, Form, Button } from 'react-bootstrap';
import axios from 'axios'
import RandomGames from './components/RandomGames'

const App = () => {
  const [steamID, setSteamID] = useState('')
  const [minHours, setMinHours] = useState(0)
  const [maxHours, setMaxHours] = useState(999999)
  const [randomGames, setRandomGames] = useState([])
  const [numberOfPossible, setNumberOfPossible] = useState(0)
  const [error, setError] = useState(false)

  //Sends steamID to backend which will give the accounts games
  const onSubmitHandler = (event) => {
    setRandomGames([])
    event.preventDefault()
    if (steamID.length < 1) {
      setError(true)
    } else {
      axios.get(`http://localhost:3001/steamuser/${steamID}`).then(res => {
        const games = res.data
        //if we have access to account the games will go towards to next function
        if (res.data.response.game_count > 0) {
          getGames(games)
          setError(false)
        } else {
          setError(true)
        }
      })
    }
  }

  //Simple functions to save user input
  const changeSteamID = (event) => {
    setSteamID(event.target.value)
  }

  const changeMin = (event) => {
    const newNumber = parseInt(event.target.value) * 60
    if (Number.isNaN(newNumber)) {
      setMinHours(0)
    } else {
      setMinHours(newNumber)
    }
  }

  const changeMax = (event) => {
    const newNumber = parseInt(event.target.value) * 60
    if (Number.isNaN(newNumber)) {
      setMaxHours(999999)
    } else {
      setMaxHours(newNumber)
    }
  }

  //Function looks through the accounts games and gives three random games with the allowed limitations
  const getGames = (games) => {
    const gamesArray = games
    //First loops through the array to exclude the games with either too many or too little hours set by the user input
    if (gamesArray.response !== undefined) {
      const filteredGames = gamesArray.response.games.filter(game => {
        if (game.playtime_forever > minHours && game.playtime_forever < maxHours) {
          return game
        } else {
          return null
        }
      })

      setNumberOfPossible(filteredGames.length)

      //If we have three or less matches we return them, if over five we make an array with three random unique games (no duplicates)
      if (filteredGames.length !== null) {
        if (filteredGames.length <= 3) {
          setRandomGames(filteredGames)
        } else {
          let randomArray = []
          while (randomArray.length < 3) {
            let rand = Math.floor(Math.random() * filteredGames.length)
            if (randomArray.indexOf(rand) === -1) {
              randomArray.push(rand)
            }
          }
          const threeGames = filteredGames.filter(game => {
            if (randomArray.includes(filteredGames.indexOf(game))) {
              return game
            } else {
              return null
            }
          })
          setRandomGames(threeGames)
        }
      }
    }
  }
  return (
    <div className="mainContainer">
      <Container className="mainContainer">
        <Row>
          <Col className="title">SteamGameChooser</Col>
        </Row>
        <Form className="formContainer" onSubmit={onSubmitHandler}>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Enter Your SteamID</Form.Label>
              <Form.Control type="text" placeholder="Steam ID" value={steamID} onChange={changeSteamID} />
              <Form.Text muted>Steam account must be public for this to work.</Form.Text>
            </Form.Group>
          </Form.Row>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Minimum Hours:</Form.Label>
              <Form.Control type="number" onChange={changeMin} />
            </Form.Group>
            <Form.Group as={Col}>
              <Form.Label>Maximum Hours:</Form.Label>
              <Form.Control type="number" onChange={changeMax} />
            </Form.Group>
          </Form.Row>
          <Form.Row className="justify-content-center">
            <Button type="submit" variant="dark" className="submitButton">Submit</Button>
          </Form.Row>
        </Form>
        <Row className="resultContainer">
          {randomGames.length > 0 ? <RandomGames games={randomGames} number={numberOfPossible} /> : null}
        </Row>
        {error ? <Col className="error">You must enter a valid public Steam id</Col> : null}
      </Container>
    </div>
  )
}

export default App;
