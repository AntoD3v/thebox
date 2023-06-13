const {SerialPort, ReadlineParser} = require("serialport");

const BAUD_RATE = 9600;

const parser = new ReadlineParser()
const createSerial = (com, callback) => {
    let serial =  new SerialPort({path: com, baudRate: BAUD_RATE, autoDestroy: true}, callback);
    serial.pipe(parser)
    return serial;
};

const on = (serial, event, callback) => {

    parser.on("data", (data) => {

        data = data.toString('utf8').trim();
        if(data.startsWith(event)) {
            console.log(data)
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
