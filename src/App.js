import React, { Component } from 'react';
import { Sketch } from './components/sketch';

// There are a few between a regular sketch for instance mode
// First, it takes a width, height, and props, and returns
// the _actual_ sketch that takes a p5 object (closing over
// width, height and props, passed by the React component)
// Second, do not use createCanvas! This is handled by the
// Sketch component. To set the width/height of a sketch,
// either apply CSS on the Sketch or pass it the appropriate
// width/height props.
// Finally, there are two optionally added functions:
// - receiveProps, which can receive props
// - unmount, triggered before a Sketch unmounts
const sketch = (width, height, props) => {
  return function (p5) {
    let value = props.value;
    p5.setup = () => {
      p5.strokeWeight(10);
    }

    p5.draw = () => {
      p5.fill(value, 128);
      p5.noStroke();
      p5.rect(0, 0, width, height);
      p5.stroke(255);
      p5.line(p5.mouseX, p5.mouseY, p5.pmouseX, p5.pmouseY);
    };

    p5.receiveProps = (nextProps) => {
      console.log(nextProps.value)
      value = nextProps.value;
    };

    p5.unmount = () => {
      console.log('The sketch was unmounted. Width was ' + width + ', height was ' + height);
    }
  }
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { value: 0 };
  }
  render() {
    return (
      <div style={{ width: '100%', height: '100%' }} onClick={() => { this.setState({ value: (this.state.value + 5)%256 }) }}>
        <p>
          A simple demonstration of how this component wrapper for p5 works. See <a href='https://github.com/JobLeonard/p5-react'>source code on github</a> for more information.
        </p>
        <Sketch
          sketch={sketch}
          width={'80%'}
          height={'80%'}
          sketchProps={{ value: this.state.value}}
        />
        <p>
          Click to change current value being passed as a prop to the sketch: {this.state.value}
        </p>

      </div>
    );
  }
}

export default App;
