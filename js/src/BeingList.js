import React, { Component } from 'react';
import {Panel,Button} from 'react-bootstrap';
import {Accordion,AccordionItem,AccordionItemTitle,AccordionItemBody} from 'react-accessible-accordion';

class BeingList extends Component{
	
	constructor(props){
		super(props);
    this.state = {
      beings:[
      {
         "name":"Joshua Davies",
         "level":1,
         "health":10,
         "init":0,
         "defense":10,
         "attacks":[
            {
               "atk_type":"5",
               "hit_bonus":5,
               "damage":"4d20"
            }
         ],
         "spells":[

         ],
         "consumables":0,
         "regenerators":0,
         "id":3
      },
      {
         "name":"xddddd",
         "level":4,
         "health":15,
         "init":0,
         "defense":90,
         "attacks":[
            {
               "atk_type":"5",
               "hit_bonus":30000,
               "damage":"4d20"
            }
         ],
         "spells":[

         ],
         "consumables":0,
         "regenerators":0,
         "id":5
      }
    ]};
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
    //this.props.endpoint.put(id,{loading:this.props.loading});
  }
  
  buildAccordionFromObject(obj,title="No title?",root=false){
    if(obj === Object(obj)){
      return <Accordion accordion={false}>
        <AccordionItem>
        {
          <AccordionItemTitle> 
            { root? 
              <div id='accordionTitle'>
                <span> {title} </span> 
                <Button bsStyle="success" className='pull-right' onClick = {e=>this.handleEdit(e,obj.id)}>+</Button>
                <Button bsStyle="danger" className='pull-right' onClick={e=>this.handleDelete(e,obj.id)}>-</Button>
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
    return title !== 'id' ? <p>{`${title}:${obj}`}</p> : null;
  }
  
	render(){
    const beings = this.props.beings.length ? this.props.beings : this.state.beings;
    console.log(this.props.beings);
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