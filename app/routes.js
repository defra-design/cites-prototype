const express = require('express')
const router = express.Router()

// Route index page
router.get('/', function (req, res) {
  res.render('./index')
})

// router.use('/v01', require('./v01/routes/routes'))
// router.use('/v02', require('./v02/routes/routes'))
// router.use('/v03', require('./v03/routes/routes'))
// router.use('/v04', require('./v04/routes/routes'))
// router.use('/v05', require('./v05/routes/routes'))
// router.use('/v05-1', require('./v05-1/routes/routes'))
// router.use('/v05-2', require('./v05-2/routes/routes'))
// router.use('/v05-3', require('./v05-3/routes/routes'))
// router.use('/v06', require('./v06/routes/routes'))
router.use('/v07', require('./v07/routes/routes'))
// router.use('/v07-A', require('./v07-A/routes/routes'))
// router.use('/v07-B', require('./v07-B/routes/routes'))




module.exports = router
