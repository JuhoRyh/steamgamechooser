import React, { useState, useEffect } from 'react';
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

  const onSubmitHandler = (event) => {
    setRandomGames([])
    event.preventDefault()
    if(steamID.length < 1){
      setError(true)
    }else{
      axios.get(`http://localhost:3001/steamuser/${steamID}`).then(res => {
      const games = res.data

      if(res.data.response.game_count > 0){
        getGames(games)
        setError(false)
      }else{
        setError(true)
      }})
    }
  }

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


  const getGames = (games) => {

    console.log(games)
    const gamesArray = games
    if(gamesArray.response == undefined){
      console.log('vittu')
    }else{
      const filteredGames = gamesArray.response.games.filter(game => {
      if (game.playtime_forever > minHours && game.playtime_forever < maxHours) {
        return game
      } else {
        return null
      }
    })

    setNumberOfPossible(filteredGames.length)



    if (filteredGames.length !== null) {
      console.log('ei sopivia')
    } else if (filteredGames.length <= 3) {
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
        }
      })
      setRandomGames(threeGames)
    }
  }
}
  return (
    <div class="gridContainer">
      <Container className="mainContainer">
        <Row>
          <Col className="title">SteamGameChooser</Col>
        </Row>
        <Form className="formContainer" onSubmit={onSubmitHandler}>
          <Form.Row>
            <Form.Group as={Col}>
              <Form.Label>Enter Your SteamID</Form.Label>
              <Form.Control type="text" placeholder="Steam ID" value={steamID} onChange={changeSteamID} />
              <Form.Text muted>Your Steam account must be public for this to work.</Form.Text>
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
