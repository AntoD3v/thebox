const {SerialPort, ReadlineParser} = require("serialport");

const BAUD_RATE = 9600;

const createSerial = (com, callback) => {
    let serial =  new SerialPort({path: com, baudRate: BAUD_RATE, autoDestroy: true}, callback)
    serial.com = com;
    serial.parser = new ReadlineParser();
    serial.pipe(serial.parser)
    return serial;
};

const on = (serial, event, callback) => {

    serial.parser.on("data", (data) => {

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

module.exports = {createSerial, on, send}
