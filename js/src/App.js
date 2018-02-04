import React, { Component } from 'react';
import {Grid,Row,Col,Panel} from 'react-bootstrap';
import {Accordion} from 'react-accessible-accordion';
import Loadable from 'react-loading-overlay';
import './libs/react-accessible-accordion.css';
import './libs/bootstrap.min.css';
import './App.css';

import BeingList from './BeingList'
import CreateCombatant from './CreateCombatant';
const Api = require('./Api');
const SchemaLoader = require('./SchemaLoader');

class App extends Component {
  constructor(props){
    super(props);
    const allSchemas = SchemaLoader("Player","Enemy");
    this.validateSchema = this.validateSchema.bind(this);
    this.loading = this.loading.bind(this);
    this.state = {
      players:[],
      enemies:[],
      round:-1,
      allSchemas,
      loading:true
    };
  }
  
  componentDidMount(){
    this.loading();
  }
  
  loading(loading){
    
    //IDK about this, can we use promises somehow uggg
    const refreshAll = (refreshFns,successProps,cb)=>{
      const fnChain = [];
      let i;
      for(i = 0; i<refreshFns.length; i++){
        const curSpot = i;
        const curFn = refreshFns[curSpot];
        const nextFn = i === refreshFns.length-1 ? cb : ()=>fnChain[curSpot+1]();
        fnChain.push(()=>curFn({
          success:(prop)=>{
            console.log("setting state");
            const newState = {[successProps[curSpot]]:prop};
            console.log(newState);
            this.setState(newState);
            nextFn();
          },
          fail:nextFn
        }));
      }
      fnChain[0](0)
    };
    if(!loading){
      refreshAll([Api.player.getAll,Api.enemy.getAll],["players","enemies"],()=>this.setState({loading}));
    }
    else{
      this.setState({loading});
    }
  }
  
  validateSchema(fullBody,errors){
    const rollPropNames = ['damage'];
    const valid = rollProp=> (rollProp || "").match(/\d+(?:d|\-)\d+(?:[+\-]\d+)?/);
    const checkKey = (obj,error,name) =>{
      //console.log(`checking ${JSON.stringify(obj)} with ${name}`);
      if(obj === Object(obj)){
        if(Array.isArray(obj)){
          obj.forEach((item,spot)=>checkKey(item,error[spot]));
        }
        else{
          Object.keys(obj).forEach(prop=>checkKey(obj[prop],error[prop],prop));
        }
      }
      else if(rollPropNames.includes(name) && !valid(obj)){
        error.addError(`${name} must be in valid dice roll (xdy+z) format`);
      }
    }
    checkKey(fullBody,errors);
    return errors;
  }
  
  render() {
    return (
      <div className="app">
      <Loadable
        spinner
        active={this.state.loading}>
      <div className='pageHeader'>
        <h2>Battle Simulator <small> v 0.00001 </small></h2>
      </div>
      <Grid>
      <Row className='row' id='headerRow'>
      <Col xs={12}>
      <Panel defaultExpanded>
      <Panel.Title toggle>
        <h3> Actions </h3>
      </Panel.Title>
      <Panel.Collapse>
      <Panel.Body>
        <CreateCombatant schema={this.state.allSchemas["Player"]} validateSchema={this.validateSchema} loading = {this.loading} endpoint={Api.player}/>
        <CreateCombatant schema={this.state.allSchemas["Enemy"]} validateSchema = {this.validateSchema} loading = {this.loading} endpoint = {Api.enemy}/>
      </Panel.Body>
      </Panel.Collapse>
      </Panel>
      </Col>
      </Row>
			<Row className='row' id='topRow'>
				<Col sm = {6} className='col'>
          <BeingList beings={this.state.players} loading = {this.loading} endpoint={Api.player} type="Players"/>     
				</Col>
				<Col sm = {6} className='col'>
					<BeingList beings={this.state.enemies} loading = {this.loading} endpoint={Api.enemy} type="Enemies"/>
				</Col>
			</Row>
			<Row className='row' id='bottomRow'>
          <h3> Round </h3>
				 <Col xs={4} className='pull-left'>
					<h3>Player</h3>
				</Col>
        <Col xs={4} className='center'>
					<h3>Battle</h3>
				</Col>
        <Col xs={4} className ='pull-right'>
					<h3>Enemy</h3>
				</Col>
			</Row>
		</Grid>
    </Loadable>
    </div>
    );
  }
}

export default App;
