import React, { Component } from 'react';
import {Modal,Button} from 'react-bootstrap';
import Form from 'react-jsonschema-form';

class CreateCombatant extends Component{
  constructor(props){
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.generateSchema = this.generateSchema.bind(this);
    this.state = {
      show:false
    }
  }
  
  handleSubmit(combatant){
    const respFns = {
      success:this.handleClose,
      loading:this.props.loading
    };
    if(this.props.combatant){
      this.props.endpoint.put(this.props.combatant._id.$oid,combatant.formData,respFns);
    }
    else{
      this.props.endpoint.post(combatant.formData,respFns);
    }
  }
  handleClose(){
    this.setState({show:false});
    this.props.clearCombatant();
  }
  handleShow(){
    this.setState({show:true});
  }
  
  generateSchema(schema,combatant){
    if(combatant){
      Object.keys(combatant).filter(key=>schema.properties[key]).forEach(key=>{
        schema.properties[key].default = combatant[key]
      });
    }
    return schema;
  }
  
  componentWillReceiveProps(nextProps){
    if(nextProps.combatant){
      this.handleShow();
    }
  }
  
  render(){
    return this.state.show ? 
    <Modal.Dialog show={this.state.show}>
      <Modal.Header closeButton={true} onHide={this.handleClose}>
        <Modal.Title>Create {this.props.schema.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body scroll>
        <Form schema={this.generateSchema(this.props.schema,this.props.combatant)} onSubmit={this.handleSubmit} liveValidate={true} validate={this.props.validateSchema}/>
      </Modal.Body>
    </Modal.Dialog> :
    <Button onClick = {this.handleShow}> Create {this.props.schema.title} </Button>;
  }
}

export default CreateCombatant;