import BLE from './ble';
import EventEmitter2 from 'eventemitter2';
import { IBleOptions } from './ble';

function createBle(options: IBleOptions) {
  const emitter = new EventEmitter2();
  const ble = new BLE(options, emitter);

  ble.init();
  
  return ble;
}

export {
  createBle,
};