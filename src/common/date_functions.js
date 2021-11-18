const getTime = date => {
    //used to return 2 digit minutes, e.g, it returns 02 instead of 2.
    const minutes = ('0' + date.getMinutes()).slice(-2)

    const formattedTime = `${date.getHours()}:${minutes}`
    return formattedTime
}

const getDate = date => {

    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const LongDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

    return LongDate
}

const getCompleteDate = date => `${getDate(date)} ${getTime(date)}`

const mergeDateAndTime = (dateString, time) => {
    const splitTime = time.split(':')

    const minutes = splitTime[1]
    const hours = splitTime[0]

    var date = new Date(dateString)
    date.setHours(hours, minutes)

    return date

}
module.exports = { getTime, mergeDateAndTime, getDate, getCompleteDate }