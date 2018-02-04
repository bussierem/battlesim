import React, { Component } from 'react';
import {Panel,Button} from 'react-bootstrap';
import {Accordion,AccordionItem,AccordionItemTitle,AccordionItemBody} from 'react-accessible-accordion';

class BeingList extends Component{
	
	constructor(props){
		super(props);
    this.state = {};
    this.handleDelete = this.handleDelete.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.buildAccordionFromObject = this.buildAccordionFromObject.bind(this);
	}
	
  handleDelete(e,id){
    e.stopPropagation();
    this.props.endpoint.del(id,{loading:this.props.loading});
  }
  
  handleEdit(e,id){
    e.stopPropagation();
    this.props.setCombatant(this.props.beings.filter(being=>being._id.$oid===id)[0]);
  }
  
  buildAccordionFromObject(obj,title="No title?",root=false){
    if(title==="_id" && !root){
      return;
    }
    if(obj === Object(obj)){
      return <Accordion accordion={false}>
        <AccordionItem>
        {
          <AccordionItemTitle> 
            { root? 
              <div id='accordionTitle'>
                <span> {title} </span> 
                <Button bsStyle="success" className='pull-right' onClick = {e=>this.handleEdit(e,obj._id.$oid)}>+</Button>
                <Button bsStyle="danger" className='pull-right' onClick={e=>this.handleDelete(e,obj._id.$oid)}>-</Button>
              </div> : <span> {title} </span> 
            }
          </AccordionItemTitle>
        }
        <AccordionItemBody>
        {
          (Array.isArray(obj)) ? obj.map((item,spot)=>this.buildAccordionFromObject(item,spot+1)) : Object.keys(obj).map(prop=>this.buildAccordionFromObject(obj[prop],prop))
        }
        </AccordionItemBody>
        </AccordionItem>
        </Accordion>;
    }
    return <p>{`${title}:${obj}`}</p>;
  }
  
	render(){
    const beings = this.props.beings;
		return <Panel defaultExpanded>
    <Panel.Title toggle>
      <h3> {this.props.type || "No type specified :^ ("} </h3>
    </Panel.Title>
    <Panel.Collapse>
    <Panel.Body>
      {beings.map(being=>this.buildAccordionFromObject(being,being.name,true))}
    </Panel.Body>
    </Panel.Collapse>
    </Panel>;
	}
}
export default BeingList;