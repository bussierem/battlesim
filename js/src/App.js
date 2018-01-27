import './libs/react-accessible-accordion.css';
import './App.css';
import './libs/bootstrap.min.css';
import React, { Component } from 'react';
import {Grid,Row,Col,PageHeader} from 'react-bootstrap';
import {Accordion} from 'react-accessible-accordion';

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
    const battle = Api.getBattle().then((battle)=>{
      console.log(battle);
      this.setState({
        players:battle.steps[0].players,
        enemies:battle.steps[0].enemies
      });
    });
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
