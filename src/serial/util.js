const {SerialPort} = require("serialport");

const get_serials = async ()  => {

    return (await SerialPort.list())
        .map(item => ({
            name: item.path + " - " + item.manufacturer,
            com: item.path
        }));

}

module.exports = {get_serials}