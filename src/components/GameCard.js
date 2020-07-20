import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Col, Card } from 'react-bootstrap'

const GameCard = (props) => {
  const [appInfo, setAppInfo] = useState()
  const [ready, setReady] = useState(false)
  const appid = props.game.appid


  useEffect(() => {
    axios.get(`http://localhost:3001/steamapps/${appid}`).then(res => {
      setAppInfo(res.data)
      setReady(true)
    })
  },[])

  return (
      <Col>
       {ready ? 
        <Card>
          <Card.Img variant="top" src={appInfo[appid].data.header_image} />
          <Card.Body>
            <Card.Title>{appInfo[appid].data.name}</Card.Title>
            <Card.Text></Card.Text>
          </Card.Body>
        </Card> : null}
      </Col>
  )
}

export default GameCard