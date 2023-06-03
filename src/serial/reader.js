const {SerialPort} = require("serialport");

const BAUD_RATE = 9600;

const createSerial = (com, callback) => new SerialPort({ path: com, baudRate: BAUD_RATE, autoDestroy: true }, callback);

const on = (serial, event, callback) => {

    serial.on("data", (data) => {

        console.log(data);
        if(data.startsWith(event)) {
            
           data = data.replace(event, "");
           callback(data);
            
        }
        
    })

}

const send = (serial, event) => {

    serial.write(event)

}

const close = (serial) => {



}

module.exports = {createSerial, on, close, send}
