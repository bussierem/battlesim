import React, { Component } from 'react';
import {Modal,Button} from 'react-bootstrap';

class CreateCombatant extends Component{
  constructor(props){
    super(props);
    //const schema = require(`../../schemas/${this.props.type}`);
    //console.log(schema);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      show:false
    }
  }
  handleClose(){
    this.setState({show:false});
  }
  handleShow(){
    this.setState({show:true});
  }
  render(){
    return this.state.show ? 
    <Modal.Dialog show={this.state.show}>
      <Modal.Header>
        <Modal.Title>Create {this.props.type}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick = {this.handleClose}> Close </Button>
        <Button> Add </Button>
      </Modal.Footer>
    </Modal.Dialog> :
    <Button onClick = {this.handleShow}> Create {this.props.type} </Button>;
  }
}

export default CreateCombatant;