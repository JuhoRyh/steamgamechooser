import React from 'react'
import { Row, Col, } from 'react-bootstrap'
import GameCard from './GameCard'

const RandomGames = (props) => {
  const games = props.games

  return (
    <Col className="gamesContainer">
      <Row className="justify-content-center">
        <Col className="subtitleContainer">
          <h3 className="subtitle">How About one of these!</h3>
          <p className="subtitle">Games that fit your search: {props.number}</p>
        </Col>
      </Row>
      <Row className="justify-content-center cardContainer">
        {games.map(game => {
          return <GameCard key={game.appid} game={game} />
        })}
      </Row>
    </Col>
  )
}

export default RandomGames