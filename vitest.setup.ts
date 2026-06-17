import '@testing-library/jest-dom'
import 'whatwg-fetch'

// Polyfill matchMedia for jsdom
if (!window.matchMedia) {
	Object.defineProperty(window, 'matchMedia', {
		configurable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {},
			removeListener: () => {},
			dispatchEvent: () => false,
		}),
	})
}

// Polyfill element scroll methods used in components
if (typeof window.HTMLElement !== 'undefined') {
	if (!window.HTMLElement.prototype.scrollTo) {
		Object.defineProperty(window.HTMLElement.prototype, 'scrollTo', {
			configurable: true,
			value: () => {},
		})
	}
	if (!window.HTMLElement.prototype.scrollBy) {
		Object.defineProperty(window.HTMLElement.prototype, 'scrollBy', {
			configurable: true,
			value: () => {},
		})
	}
}
