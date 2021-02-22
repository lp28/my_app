import React, { Component } from 'react';
import Button from 'react-bootstrap/Button'
import TextDisplay from './TextDisplay';



class ArcComponent extends Component {
    state = {  }
    render() { 
        return ( 
            <div>
                <h2>{this.props.title}</h2>
                <TextDisplay text={this.props.description}></TextDisplay>
                <Button onClick={this.props.next}>GO</Button>
            </div>
         );
    }
}
 
export default ArcComponent;