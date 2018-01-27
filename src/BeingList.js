import React, { Component } from 'react';
import {Accordion,AccordionItem,AccordionItemTitle,AccordionItemBody} from 'react-accessible-accordion';

class BeingList extends Component{
	
	constructor(props){
		super(props);
	}
	
	render(){
		return <Accordion accordion={false}>
    {
      (this.props.beings || []).map(being=>{
        return <AccordionItem>
          <AccordionItemTitle>
            <h4>{being.name || "No name specified :^ ("}</h4>
          </AccordionItemTitle>
            <AccordionItemBody>
              {Object.keys(being || {}).filter(key=>key!=='name').map(attrName=>{
                return <p>{`${attrName}:${being[attrName]}`}</p>
              })}
            </AccordionItemBody>
        </AccordionItem>
      })
    }
    </Accordion>;
	}
}
export default BeingList;