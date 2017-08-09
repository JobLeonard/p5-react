import React, { Component } from 'react';
import { Sketch } from './components/sketch';

const sketch = (width, height, props) => {
  return function (p5) {

    p5.setup = () => {
      p5.strokeWeight(10);
    }

    p5.draw = () => {
      p5.fill(0, 5);
      p5.noStroke();
      p5.rect(0, 0, width, height);
      p5.stroke(255);
      p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    };

    p5.receiveProps = (sketchProps) => {
      console.log({ sketchProps });
    };
  }
};

class App extends Component {
  render() {
    return (
        <Sketch
          sketch={sketch}
          style={{ width: "80%", height: "80%", margin: '10% auto' }} />
    );
  }
}

export default App;
