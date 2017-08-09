import { Component } from 'react';

import { debounce } from 'lodash';

import MobileDetect from 'mobile-detect';

export class RemountOnResize extends Component {
	constructor(props) {
		super(props);

		this.state = {
			resizing: true,
			isPortrait: window.innerHeight > window.innerWidth
		};

		// On certain mobile devices, the software keyboard
		// triggers a resize event. In that case, we do not
		// want to trigger the remount. Instead, we want
		// to trigger a resize only when switching between
		// portrait and landscape modes.
		// This assumes the keyboard does not take up more
		// than half of the screen, which is not always
		// true but it's a decent enough hack.
		const isMobile = new MobileDetect(window.navigator.userAgent).mobile();
		const resize = isMobile ? (
			() => {
				let isPortrait = window.innerHeight > window.innerWidth;
				if (isPortrait !== this.state.isPortrait || !this.state.resizing) {
					this.setState({
						resizing: true,
						isPortrait
					});
				}
			}
		) : (
			() => {
				if (!this.state.resizing) {
					this.setState({
						resizing: true
					});
				}
			}
		);

		// Because the resize event can fire very often when
		// dragging a window, we add a debouncer to minimise
		// pointlessly unmounting, remounting and resizing
		// of the child nodes, with 200 ms as the default
		let delay = props.delay !== undefined ? props.delay : 200;
		this.setResize = debounce(resize, delay);
	}

	componentDidMount() {
		window.addEventListener('resize', this.setResize);
		this.setState({ resizing: false });
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.setResize);
		this.setResize.cancel();
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.watchedVal !== nextProps.watchedVal) {
			this.setState({ resizing: true });
		}
	}

	componentDidUpdate(prevProps, prevState) {
		// Yes, this triggers another update.
		// That is the whole point: to cycle between
		// unmounting and remounting upon certain
		// triggers.
		if (!prevState.resizing && this.state.resizing) {
			this.setState({ resizing: false });
		}
	}

	render() {
		return this.state.resizing ? null : this.props.children;
	}
}