import React, { PureComponent } from 'react';

import { RemountOnResize } from './remount';

import p5 from 'p5';

class SketchComponent extends PureComponent {

	constructor(props) {
		super(props);
		this.mountedView = this.mountedView.bind(this);
		this.state = {};
	}

	mountedView(view) {
		// Scaling lets us adjust the painter function for
		// high density displays and zoomed browsers.
		// Painter functions decide how to use scaling
		// on a case-by-case basis.
		if (view) {
			const ratio = window.devicePixelRatio || 1;
			const width = (view.clientWidth * ratio) | 0;
			const height = (view.clientHeight * ratio) | 0;
			let newState = { view, width, height, ratio };
			let { sketch, sketchProps, noCanvas } = this.props;
			if (sketch) {
				const _sketch = (p5) => {
					p5.willUnmount = () => {
						p5.remove();
					}
					sketch(width, height, sketchProps)(p5);
					const _setup = p5.setup ? p5.setup : () => {};
					p5.setup = noCanvas ? () => {
						p5.noCanvas();
						_setup();
					} : () => {
						p5.createCanvas(width, height);
						_setup();
					};

				}
				newState.sketch = new p5(_sketch, view);
			}
			this.setState(newState);
		}
	}

	componentWillReceiveProps(nextProps) {
		// pass relevant props to sketch
		const { sketch } = this.state;
		if (sketch.receiveProps && nextProps.sketchProps) {
			sketch.receiveProps(nextProps.sketchProps);
		}
	}

	componentWillUnmount() {
		console.log(this.state)
		if (this.state.sketch) {
			this.state.sketch.willUnmount();
		}
	}

	render() {
		// The way canvas interacts with CSS layouting is a bit buggy
		// and inconsistent across browsers. To make it dependent on
		// the layout of the parent container, we only render it after
		// mounting view, that is: after CSS layouting is done.
		return (
			<div
				ref={this.mountedView}
				style={this.props.style}
			/>
		);
	}
}

// A simple helper component, wrapping retina logic for canvas and
// auto-resizing the canvas to fill its parent container.
// To determine size/layout, we just use CSS on the div containing
// the Canvas component (we're using this with flexbox, for example).
// Expects a "paint" function that takes a "context" to draw on
// Whenever this component updates it will call this paint function
// to draw on the canvas. For convenience, pixel dimensions are stored
// in context.width, context.height and contex.pixelRatio.
export class Sketch extends PureComponent {
	render() {
		// If not given a width or height prop, make these fill their parent div
		// This will implicitly set the size of the <Canvas> component, which
		// will then call the passed paint function with the right dimensions.
		const { props } = this;
		let style = Object.assign({}, props.style);
		let { width, height } = props;
		if (width) {
			style['minWidth'] = (width | 0) + 'px';
			style['maxWidth'] = (width | 0) + 'px';
		}
		if (height) {
			style['minHeight'] = (height | 0) + 'px';
			style['maxHeight'] = (height | 0) + 'px';
		}
		return (
			<RemountOnResize
				/* Since canvas interferes with CSS layouting,
				we unmount and remount it on resize events */
				watchedVal={props.watchedVal}
			>
				<SketchComponent
					sketch={props.sketch}
					sketchProps={props.sketchProps}
					noCanvas={props.noCanvas}
					className={props.className}
					style={style}
				/>
			</RemountOnResize>
		);
	}
}
