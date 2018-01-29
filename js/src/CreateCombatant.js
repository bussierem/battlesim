import React, { Component } from 'react';
import {Modal,Button} from 'react-bootstrap';
import Form from 'react-jsonschema-form';

class CreateCombatant extends Component{
  constructor(props){
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      show:false
    }
  }

  handleSubmit(combatant){
    this.props.endpoint.post(combatant.formData,{
      fail:(e)=>{
        console.log(e);
      },
      success:()=>{
        console.log("Created it woo woo woo");
      },
      loading:this.props.loading
    });
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
      <Modal.Header closeButton={true} onHide={this.handleClose}>
        <Modal.Title>Create {this.props.schema.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body scroll>
        <Form schema={this.props.schema} onSubmit={this.handleSubmit} liveValidate={true} validate={this.props.validateSchema}/>
      </Modal.Body>
    </Modal.Dialog> :
    <Button onClick = {this.handleShow}> Create {this.props.schema.title} </Button>;
  }
}

export default CreateCombatant;