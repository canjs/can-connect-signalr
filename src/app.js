import DefineMap from 'can-define/map/'
import template from './index.stache!steal-stache';
import 'ccsr/chat/';
import can from 'can-util/namespace';
window.__can = can;

const AppViewModel = DefineMap.extend({
	title: {
		value: 'can-connect-signalr-chat',
		serialize: false
	}
});

const appVm = new AppViewModel();
const frag = template(appVm);

document.body.appendChild(frag);