import React, { Component } from 'react';
import {Grid,Row,Col} from 'react-bootstrap';
import {Accordion} from 'react-accessible-accordion';
import './libs/react-accessible-accordion.css';
import './libs/bootstrap.min.css';
import './App.css';

import BeingList from './BeingList'
const Api = require('./Api');

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      players:[],
      enemies:[],
      step:0
    };
    const battle = Api.getBattle().then((response)=>{
      response.json().then((battle)=>{
         this.setState({
            players:battle.steps[0].players,
            enemies:battle.steps[0].enemies
         });
      });
    });
  }
  render() {
    return (
      <div className="app">
      <div className='pageHeader'>
        <h2>Battle Simulator <small> v 0.00001 </small></h2>
      </div>
      <Grid>
			<Row className='row' id='topRow'>
				<Col sm = {6} className='col'>
          <BeingList beings={this.state.players} type="Players"/>     
				</Col>
				<Col sm = {6} className='col'>
					<BeingList beings={this.state.enemies} type="Enemies"/>
				</Col>
			</Row>
			<Row className='row' id='bottomRow'>
				 <Col xs={12} md={8}>
					<h3>Battle Simulation</h3>
				</Col>
			</Row>
		</Grid>
      </div>
    );
  }
}

export default App;
