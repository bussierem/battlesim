import React, { Component } from 'react';
import {Panel} from 'react-bootstrap';
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
         "regenerators":0
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
         "regenerators":0
      }
    ]};
    this.buildAccordionFromObject = this.buildAccordionFromObject.bind(this);
	}
	
  buildAccordionFromObject(obj,title){
    if(obj === Object(obj)){
      return <Accordion accordion={false}>
        <AccordionItem>
        {
          <AccordionItemTitle> <h4> {title || "No title?"} </h4> </AccordionItemTitle>
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
		return <Panel defaultExpanded>
    <Panel.Title toggle>
      <h3> {this.props.type || "No type specified :^ ("} </h3>
    </Panel.Title>
    <Panel.Collapse>
    <Panel.Body>
      {this.state.beings.map(being=>this.buildAccordionFromObject(being,being.name))}
    </Panel.Body>
    </Panel.Collapse>
    </Panel>;
	}
}
export default BeingList;