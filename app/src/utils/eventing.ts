import EventEmitter from 'eventemitter3';

const eventing = new EventEmitter();

eventing.on('connected', () => {
  console.log('\nsSuccess:  Wallet connected\n');
});

eventing.on('disconnected', () => {
  console.log('\nSuccess: Wallet disconnected\n');
});

export { eventing };
