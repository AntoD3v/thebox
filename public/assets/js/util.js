const format_time = (time) => {

    let date = new Date(time)

    return date.getMinutes() + "min " + date.getSeconds() + "sec";

}

const format_time_msm = (time) => {

    let date = new Date(time);

    let millis = date.getMilliseconds().toLocaleString('fr-FR', {
        minimumIntegerDigits: 3,
        useGrouping: false
    })

    let minutes = date.getMinutes().toLocaleString('fr-FR', {
        minimumIntegerDigits: 1,
        useGrouping: false
    })

    let seconds = date.getSeconds().toLocaleString('fr-FR', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })

    return minutes + ":" + seconds + "<i>" + millis + "</i>"

}


const format_time_ms = (time) => {

    let date = new Date(time);

    let minutes = date.getMinutes().toLocaleString('fr-FR', {
        minimumIntegerDigits: 1,
        useGrouping: false
    })

    let seconds = date.getSeconds().toLocaleString('fr-FR', {
        minimumIntegerDigits: 2,
        useGrouping: false
    })

    return minutes + ":" + seconds

}