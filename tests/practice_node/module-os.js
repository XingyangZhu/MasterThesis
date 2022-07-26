const os   = require('os')

// info about current user
const user = os.userInfo()
console.log(user)

// system uptime in seconds
const time = os.uptime()
console.log(`The system is running for ${time / 60 / 60} hours.`)

