import './libs/react-accessible-accordion.css';
import './App.css';
import './libs/bootstrap.min.css';
import React, { Component } from 'react';
import {Grid,Row,Col,PageHeader} from 'react-bootstrap';
import {Accordion} from 'react-accessible-accordion';

import BeingList from './BeingList'
const schemaLoader = require('./SchemaLoader');

const faker = require('faker');

class App extends Component {
  constructor(props){
    super(props);
    schemaLoader('Combatant');
    const playerSchema = {
      name:()=>faker.name.findName(),
      health:()=>Math.random()*100,
      spells:()=>{
        let i;
        const spells = [];
        for(i = 0; i<Math.random()*5; i++){
          spells.push(faker.name.findName());
        }
        return spells;
      },
      perception:()=>Math.random()*20,
    };
    const enemySchema = {
      name:()=>faker.name.findName(),
      health: ()=>Math.random()*50,
      damage: ()=>Math.random()*5,
    };
    const createPlayer = (props)=>createBeing(playerSchema,props);
    const createEnemy = (props)=>createBeing(enemySchema,props);
    const createBeing = (schema,props={})=>{
      const being = {};
      Object.keys(schema).forEach(key=>{
        being[key] = props[key] || schema[key]();
      });
      return being;
    };
    const createDefaultBeings = (creationFn,numBeings = 20)=>{
      let i;
      const beings = [];
      for(i = 0; i<numBeings; i++){
        beings.push(creationFn());
      }
      return beings;
    };
    const players = createDefaultBeings(createPlayer);
    const enemies = createDefaultBeings(createEnemy,15);
    players.push(createPlayer({
      health:400,
      spells:"Ice blast",
      perception:10,
      resources:"1 health pot, 2 biscuits",
      name:"Abhorsen"
    }));
    enemies.push(createEnemy({
      health:30,
      damage:5,
      name:"Dragon 1"
    }));
    this.state = {players,enemies};
  }
  render() {
    return (
      <div className="app">
      <PageHeader>
        Battle Simulator <small> v 0.00001 </small>
      </PageHeader>
      <Grid>
			<Row className='row' id='topRow'>
				<Col xs={6} md = {4} className='col'>
          <BeingList beings={this.state.players}/>     
				</Col>
				<Col xs={6} md = {4} className='col'>
					<BeingList beings={this.state.enemies}/>
				</Col>
			</Row>
			<Row className='row' id='bottomRow'>
				 <Col xs={12} md={8}>
					Battle Simulation
				</Col>
			</Row>
		</Grid>
      </div>
    );
  }
}

export default App;
