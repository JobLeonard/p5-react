# p5-react

A component wrapping [the p5js library](https://p5js.org/). It uses [p5's `instance mode`](https://github.com/processing/p5.js/wiki/Global-and-instance-mode), but adds a few subtle differences and conveniences.

Instead of a function that is passed a p5 object, use a function that is passed a width, height and props, and returns a p5 object. Compare:

```js
// Regular p5js instance mode sketch,
// don't use this!
const sketch = (p5) => {
   // p5 code
}
```
```js
// This function which will be called by the Sketch component,
// its arguments are the width and height the canvas will be,
// in pixels, and the props that were passed to the Sketch component.
// It returns the actual sketch function that will be used by p5,
// optionally closing over width, height and props.
const sketch = (width, height, props) => {
    return (p5) => {
        // p5 code,
    }
}

```
- **DO NOT USE `createCanvas` in p5.setup!** The size depends on the container that holds the sketch, and the Sketch component handles this logic.
- You can either use CSS to give it a size, or pass a `width` and/or `height` prop (which can be both a number or CSS again).
- The sketch remounts upon resize, making sure it is the correct size if, for example, you pass a percentage
- An optional `p5.receiveProps` function can be defined to pass props passed to the Sketch component onto the p5 sketch code.
- An optional `p5.unmount` function can be defined, in case the sketch needs to handle something before unmounting the component

An example sketch:
```js
const sketch = (width, height, props) => {
  return function (p5) {
    let value = props.value;
    p5.setup = () => {
      p5.strokeWeight(50);
    }

    p5.draw = () => {
      p5.fill(value, 16);
      p5.noStroke();
      p5.rect(0, 0, width, height);
      p5.stroke((value + 128) % 256);
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
```