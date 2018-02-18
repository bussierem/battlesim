import React, { Component } from 'react';
import {Modal,Button,FormGroup,ControlLabel,FormControl} from 'react-bootstrap';
import Select from 'react-select'; 
import 'react-select/dist/react-select.css';
const getInitialState = ()=> {
  return {
    show:false,
    selectedPlayers:[],
    selectedEnemies:[],
    battleName:""
  }
};

//TODO There's shared code i think between this and CreateCombatant-can we abstract this out???
class CreateBattle extends Component{
  constructor(props){
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = getInitialState();
  }
  
  handleSubmit(){
    const battle = {
      enemies:this.state.selectedEnemies.map(selectedEnemy=>selectedEnemy.value),
      players:this.state.selectedPlayers.map(selectedPlayer=>selectedPlayer.value),
      name:this.state.battleName
    };
    /*const respFns = {
      success:this.handleClose,
      loading:this.props.loading
    };
    this.props.endpoint.post(battle,respFns);*/
    console.log(battle);
  }
  handleClose(){
    this.setState(getInitialState());
  }
  handleShow(){
    this.setState({show:true});
  }
  
  render(){
    const mapCombatants = combatants=>{
      return combatants.map(combatant=>{
        return {label:combatant.name,value:combatant._id.$oid}
      });
    }
    const showSaveBattle = this.state.battleName && this.state.selectedPlayers.length && this.state.selectedEnemies.length;
    return this.state.show ? 
    <Modal.Dialog show={this.state.show}>
      <Modal.Header closeButton={true} onHide={this.handleClose}>
        <Modal.Title>Create Battle </Modal.Title>
      </Modal.Header>
      <Modal.Body scroll>
        <FormGroup>
          <ControlLabel> Battle Name </ControlLabel>
          <FormControl type='text'
                       onChange={e=>this.setState({battleName:e.target.value})}/>
        </FormGroup>
        <h5> Players </h5>
            <Select options = {mapCombatants(this.props.players)} 
            value = {this.state.selectedPlayers} 
            onChange = {selectedPlayers=>this.setState({selectedPlayers})}
            multi/>
        <h5> Enemies </h5>
        <Select options = {mapCombatants(this.props.enemies)} 
            value = {this.state.selectedEnemies} 
            onChange = {selectedEnemies=>this.setState({selectedEnemies})}
            multi/>
       {showSaveBattle ? <Button onClick={this.handleSubmit}> Save Battle </Button> : null}
      </Modal.Body>
    </Modal.Dialog> :
    <Button onClick = {this.handleShow}> Create Battle </Button>;
  }
}

export default CreateBattle;