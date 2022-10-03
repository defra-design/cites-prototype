const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const rootAppDirectory = require('../../config').rootAppDirectory // Used when a full path is required, e.g. '/Users/dave/Documents/NODE/projects/DEFRA/ivory-prototype/app' or '/app/app' on Heroku
const viewsFolder = path.join(__dirname, '/../views/public/') // Set the views with a relative path (haven't yet found a better way of doing this yet)
let versionRegex = process.platform === 'win32' ? /app\\(.[^\\]*?)\\routes/ : /app\/(.[^\/]*?)\/routes/
const version = __dirname.match(versionRegex)[1]// Gets the version, e.g. v10 (ensure this handles Heroku's __direname being /app/app/vXX/routes)
// accessible autocomplete end


/// ///////////////////////////////////////////////////////////////////////////
// LOGGER (not great, but may help)
function logger (req, msg) {
  if (!msg) {
    msg = ''
  }
  console.log('DEBUG.routes ' + req.method + req.route.path + ': ' + msg)
}

//Using req.session.data['aVariable'] = 1 to set a variable//
// List of car makes
// router.get('/list-of-car-makes', function (req, res) {
//   res.render(viewsFolder + 'list-of-car-makes')
// })
//
// router.post('/list-of-car-makes', function (req, res) {
//   req.session.data['rowCount'] = 1 // total cars in list
//   res.redirect('enter-the-reg-number')
// })
//
// // Enter the reg number
// router.get('/enter-the-reg-number', function (req, res) {
//   res.render(viewsFolder + 'enter-the-reg-number')
// })
//
// router.post('/enter-the-reg-number', function (req, res) {
//   if (req.session.data['rowCount'] === 2) {
//     res.redirect('next-page') // go to next page in flow
//   } else
//     res.redirect('enter-the-reg-number') // stay on page and capture next car reg
// })
//*************  End of how to set a variable *************//



//*************  Start of CITES code *************//


// Are the details the same for each specimen?
router.get('/are-the-details-the-same-for-each-specimen', function (req, res) {
  res.render(viewsFolder + 'are-the-details-the-same-for-each-specimen')
})

router.post('/are-the-details-the-same-for-each-specimen', function (req, res) {
let sameDetails = req.session.data['sameDetails']

if (sameDetails === 'yes') {
  res.redirect('do-you-want-to-apply-for-multiple-permits')
} else {
  res.redirect('are-the-specimens-alive') //only if there are more specimens to process
}
})

// Do you want to apply for multiple permits?
router.get('/do-you-want-to-apply-for-multiple-permits', function (req, res) {
  res.render(viewsFolder + 'do-you-want-to-apply-for-multiple-permits')
})

router.post('/do-you-want-to-apply-for-multiple-permits', function (req, res) {
let multiplePermits = req.session.data['multiplePermits']

if (multiplePermits === 'yes') {
  res.redirect('#') // goes to how 'many permits and number of specimens per permit' page
}

if (multiplePermits === 'no') {
  req.session.data['specimenCount'] = req.session.data['totalSpecimens1']
  res.redirect('what-will-you-use-your-permit-for') // if there are no more specimens to process
}
})

// if (multiplePermits === 'yes') {
//   res.redirect('start') // goes to how 'many permits and number of specimens per permit' page
// }
// else if (req.session.data['loopCount'] === req.session.data['noOfSpecies']) {
//   res.redirect('what-will-you-use-your-permit-for') // if there are no more specimens to process
// }
// else {
//   res.redirect('are-the-specimens-alive') // if there are more specimens to process
// }
// })


// Species add to list 0
router.get('/species-add-to-list-0', function (req, res) {
  res.render(viewsFolder + 'species-add-to-list-0')
})

router.post('/species-add-to-list-0', function (req, res) {
  req.session.data['noOfSpecies'] = 1
  req.session.data['noOfSpecimens'] = 1
  req.session.data['noOfPermits'] = 1
  req.session.data['speciesCount'] = 1
  req.session.data['specimenCount'] = 1
  req.session.data['permit'] = 1
  req.session.data['speciesName'] = "Species name"
  req.session.data['loopCount'] = 1
  res.redirect('species-add-to-list-1')
})

// Species add to list 1
router.get('/species-add-to-list-1', function (req, res) {
  res.render(viewsFolder + 'species-add-to-list-1')
})

router.post('/species-add-to-list-1', function (req, res) {
  req.session.data['noOfSpecies'] = req.session.data['noOfSpecies'] + 1
  req.session.data['speciesName'] = req.session.data['species-name-1']
  res.redirect('species-add-to-list-2')
})

// Species add to list 2
router.get('/species-add-to-list-2', function (req, res) {
  req.session.data['speciesName'] = req.session.data['species-name-1']
  res.render(viewsFolder + 'species-add-to-list-2')
})

router.post('/species-add-to-list-2', function (req, res) {
  req.session.data['noOfSpecies'] = req.session.data['noOfSpecies'] + 1
  res.redirect('how-many-specimens')
})

// Species remove row 1 from list 2
router.get('/species-remove-row-1', function (req, res) {
  res.render(viewsFolder + 'species-remove-row-1')
})

router.post('/species-remove-row-1', function (req, res) {
  res.redirect('#')
})

// Species remove row 2 from list 2
router.get('/species-remove-row-2', function (req, res) {
  res.render(viewsFolder + 'species-remove-row-2')
})

router.post('/species-remove-row-2', function (req, res) {
  res.redirect('#')
})

// How many specimens?
router.get('/how-many-specimens', function (req, res) {
  res.render(viewsFolder + 'how-many-specimens')
})

router.post('/how-many-specimens', function (req, res) {
  req.session.data['noOfSpecimens1'] = req.session.data['totalSpecimens1']
  req.session.data['noOfSpecimens2'] = req.session.data['totalSpecimens2']
  res.redirect('are-the-specimens-alive')
})

// Are the specimens alive
router.get('/are-the-specimens-alive', function (req, res) {
  res.render(viewsFolder + 'are-the-specimens-alive')
})

router.post('/are-the-specimens-alive', function (req, res) {
  res.redirect('description-dynamic')
})

// Are the specimens alive specimen 2
router.get('/are-the-specimens-alive-specimen-2', function (req, res) {
  res.render(viewsFolder + 'are-the-specimens-alive-specimen-2')
})

router.post('/are-the-specimens-alive-specimen-2', function (req, res) {
  res.redirect('description-dynamic')
})

// Setup
router.get('/setup', function (req, res) {
    res.render(viewsFolder + 'setup?permitType=import&isAlive=alive&total-specimens-alive-1=6')
})

router.post('/setup', function (req, res) {
  res.redirect('#')
})

// Parameters
router.get('/parameters', function (req, res) {
  res.render(viewsFolder + 'parameters')
})

router.post('/parameters', function (req, res) {
  res.redirect('#')
})

// Add any other information
router.get('/add-any-other-information', function (req, res) {
  res.render(viewsFolder + 'add-any-other-information')
})

router.post('/add-any-other-information', function (req, res) {
  res.redirect('check-your-answers')
})

// Add to list
router.get('/add-to-list', function (req, res) {
  res.render(viewsFolder + 'add-to-list')
})

router.post('/add-to-list', function (req, res) {
  res.redirect('#')
})

// Application complete
router.get('/application-complete', function (req, res) {
  res.render(viewsFolder + 'application-complete')
})

router.post('/application-complete', function (req, res) {
  res.redirect('#')
})

// Are you sending the specimen to someone else?
router.get('/are-you-sending-the-specimen-to-someone-else', function (req, res) {
  res.render(viewsFolder + 'are-you-sending-the-specimen-to-someone-else')
})

router.post('/are-you-sending-the-specimen-to-someone-else', function (req, res) {
  let permitType = req.session.data['permitType']
  let sendingToSomeoneElse = req.session.data['sendingToSomeoneElse']
  let isAlive = req.session.data['isAlive']

  if (permitType === 're-export') {
    if (sendingToSomeoneElse === 'yes') {
        res.redirect('who-is-receiving-the-specimen')
      }
    }

    if (permitType === 're-export') {
      if (sendingToSomeoneElse === 'no') {
        if (isAlive === 'alive') {
          res.redirect('where-will-you-keep-your-specimen')
        } else {
          res.redirect('where-is-the-specimens-country-of-origin')
          }
        }
      }
  })



// ************************************************************************************************
// Check your answers
  router.get('/check-your-answers', function (req, res) {
    res.render(viewsFolder + 'check-your-answers')
  })

  router.post('/check-your-answers', function (req, res) {
    if (req.session.data['specimenCount'] === req.session.data['totalSpecimens1']) {
      req.session.data['speciesName'] = req.session.data['species-name-2']
      if (req.session.data['speciesCount'] === req.session.data['noOfSpecies']) {
        res.redirect('application-complete')
    } else {
        req.session.data['speciesCount'] = req.session.data['speciesCount'] + 1
        res.redirect('is-the-specimen-alive')
      }
    } else {
      req.session.data['specimenCount'] = req.session.data['specimenCount'] + 1
      res.redirect('is-the-specimen-alive')
    }
  })

  // router.post('/check-your-answers', function (req, res) {
  //   if (req.session.data['specimenCount'] === req.session.data['noOfSpecimens']) {
  //     req.session.data['speciesName'] = req.session.data['species-name-2']
  //     if (req.session.data['speciesCount'] === req.session.data['noOfSpecies']) {
  //       res.redirect('application-complete')
  //   } else {
  //       req.session.data['specimenCount'] = req.session.data['specimenCount'] + 1
  //       req.session.data['speciesCount'] = req.session.data['speciesCount'] + 1
  //       res.redirect('is-the-specimen-alive')
  //     }
  //   } else {
  //     res.redirect('is-the-specimen-alive')
  //   }
  // })

  // let multiplePermits = req.session.data['multiplePermits']
  //
  // if (multiplePermits === 'yes') {
  //   res.redirect('#') // goes to how 'many permits and number of specimens per permit' page
  // }
  //
  // if (multiplePermits === 'no') {
  //   res.redirect('what-will-you-use-your-permit-for') // if there are no more specimens to process
  //   // if (req.session.data['loopCount'] === req.session.data['noOfSpecies']) {
  //   // res.redirect('what-will-you-use-your-permit-for') // if there are no more specimens to process
  //   // }
  //   // else {
  //   //   req.session.data['loopCount'] = req.session.data['loopCount'] + 1
  //   //   // req.session.data['speciesName'] = req.session.data['species-name-2']
  //   //   res.redirect('are-the-specimens-alive') // if there are no more specimens to process
  //   // }
  // }
  // })


  // ************************************************************************************************



// Confirm your address
router.get('/confirm-your-address', function (req, res) {
  res.render(viewsFolder + 'confirm-your-address')
})

router.post('/confirm-your-address', function (req, res) {
  res.redirect('what-type-of-permit-or-certificate-are-you-applying-for')
})

// Confirm you have the owner's consent
router.get('/confirm-you-have-the-owners-consent', function (req, res) {
  res.render(viewsFolder + 'confirm-you-have-the-owners-consent')
})

router.post('/confirm-you-have-the-owners-consent', function (req, res) {
  res.redirect('enter-the-owners-contact-details')
})

// Confirm owner address
router.get('/confirm-owner-address', function (req, res) {
  res.render(viewsFolder + 'confirm-owner-address')
})

router.post('/confirm-owner-address', function (req, res) {
  let theOwner = req.session.data['isOwner']
if (theOwner === 'yes') {
  res.redirect('what-type-of-permit-or-certificate-are-you-applying-for')
} else {
  res.redirect('enter-proxy-contact-details')
}
})

// Confirm proxy address
router.get('/confirm-proxy-address', function (req, res) {
  res.render(viewsFolder + 'confirm-proxy-address')
})

router.post('/confirm-proxy-address', function (req, res) {
  res.redirect('what-type-of-permit-or-certificate-are-you-applying-for')
})

// Description dynamic
router.get('/description-dynamic', function (req, res) {
  let isAlive = req.session.data['isAlive']
  let specimen = req.session.data['specimen']
  let specimenType = req.session.data['specimenType']
  res.render(viewsFolder + 'description-dynamic')
})

router.post('/description-dynamic', function (req, res) {
  let permitType = req.session.data['permitType']

  if (req.session.data['permitType'] == 'import') {
      res.redirect('where-are-you-importing-the-specimen-from')
  }
  else if (req.session.data['permitType'] == 'export') {
      res.redirect('where-are-you-exporting-the-specimen-to')
  }
  else if (req.session.data['permitType'] == 're-export') {
      res.redirect('where-was-the-specimen-last-re-exported-from')
  }
  else {
      res.redirect('#') }
})

// Describe the specimen
router.get('/describe-the-specimen', function (req, res) {
  res.render(viewsFolder + 'describe-the-specimen')
})


router.post('/describe-the-specimen', function (req, res) {
  res.redirect('enter-the-quantity')
})

// Do you own the specimen?
router.get('/do-you-own-the-specimen', function (req, res) {
  res.render(viewsFolder + 'do-you-own-the-specimen')
})

router.post('/do-you-own-the-specimen', function (req, res) {
  let isOwner = req.session.data['isOwner']

  if (isOwner === 'yes') {
    res.redirect('enter-your-contact-details')
  } else {
    res.redirect('interruption-owner-is-non-uk-resident')
  }
})

// Drop out
router.get('/drop-out', function (req, res) {
  res.render(viewsFolder + 'drop-out')
})

router.post('/drop-out', function (req, res) {
  res.redirect('#')
})

// Enter the owner's contact details
router.get('/enter-the-owners-contact-details', function (req, res) {
  res.render(viewsFolder + 'enter-the-owners-contact-details')
})

router.post('/enter-the-owners-contact-details', function (req, res) {
  res.redirect('whats-the-owners-address')
})

// Enter the quantity
router.get('/enter-the-quantity', function (req, res) {
  res.render(viewsFolder + 'enter-the-quantity')
})

router.post('/enter-the-quantity', function (req, res) {
  res.redirect('what-is-the-total-weight-of-your-specimen')
})

// Enter proxy contact details
router.get('/enter-proxy-contact-details', function (req, res) {
  res.render(viewsFolder + 'enter-proxy-contact-details')
})

router.post('/enter-proxy-contact-details', function (req, res) {
  res.redirect('what-is-your-proxy-address')
})

// Enter your contact details
router.get('/enter-your-contact-details', function (req, res) {
  res.render(viewsFolder + 'enter-your-contact-details')
})

router.post('/enter-your-contact-details', function (req, res) {
  res.redirect('what-is-your-address')
})

// Find address
router.get('/find-address', function (req, res) {
  res.render(viewsFolder + 'find-address')
})

router.post('/find-address', function (req, res) {
  res.redirect('select-owner-address')
})

// Has the specimen ever moved from its country of origin?
router.get('/has-the-specimen-ever-moved-from-its-country-of-origin', function (req, res) {
  res.render(viewsFolder + 'has-the-specimen-ever-moved-from-its-country-of-origin')
})

router.post('/has-the-specimen-ever-moved-from-its-country-of-origin', function (req, res) {
  let hasMovedBefore = req.session.data['hasMovedBefore']

  if (hasMovedBefore === 'yes') {
    res.redirect('where-was-the-specimen-last-re-exported-from')
  } else {
    res.redirect('where-will-you-keep-your-specimen')
  }
  })

  // How many specimens per species?
    router.get('/how-many-specimens-per-species', function (req, res) {
      res.render(viewsFolder + 'how-many-specimens-per-species')
    })

    router.post('/how-many-specimens-per-species', function (req, res) {
      res.redirect('is-the-specimen-alive')
    })

// Inperuptioon - UK resident
  router.get('/interruption-owner-is-uk-resident', function (req, res) {
    res.render(viewsFolder + 'interruption-owner-is-uk-resident')
  })

  router.post('/interruption-owner-is-uk-resident', function (req, res) {
    res.redirect('what-are-your-contact-details')
  })

// Inperuptioon owner is a non-UK resident
  router.get('/interruption-owner-is-non-uk-resident', function (req, res) {
    res.render(viewsFolder + 'interruption-owner-is-non-uk-resident')
  })

  router.post('/interruption-owner-is-non-uk-resident', function (req, res) {
    res.redirect('confirm-you-have-the-owners-consent')
  })

// Is this the country of origin?
router.get('/is-this-the-country-of-origin', function (req, res) {
  res.render(viewsFolder + 'is-this-the-country-of-origin')
})

router.post('/is-this-the-country-of-origin', function (req, res) {
let isCountryOfOrigin = req.session.data['isCountryOfOrigin']

if (isCountryOfOrigin === 'yes') {
  res.redirect('tell-us-about-the-specimens-country-of-origin-export-permit')
} else {
  res.redirect('where-is-the-specimens-country-of-origin')
}
})

// Is the specimen alive?
router.get('/is-the-specimen-alive', function (req, res) {
  res.render(viewsFolder + 'is-the-specimen-alive')
})

router.post('/is-the-specimen-alive', function (req, res) {
  let isAlive = req.session.data['isAlive']
  let specimen = req.session.data['specimen']

  if (isAlive === 'alive') {
    if (specimen === 'tortoise') {
      res.redirect('is-the-specimens-plastron-longer-than-60mm')
    } else {
        res.redirect('description-dynamic')
      }
  }

  if (isAlive === 'dead') {
          res.redirect('description-dynamic')
    }
})

// Is this specimen correct
router.get('/is-this-specimen-correct', function (req, res) {
  res.render(viewsFolder + 'is-this-specimen-correct')
})

router.post('/is-this-specimen-correct', function (req, res) {
  let correctSpecimen = req.session.data['correctSpecimen']
  if (correctSpecimen === 'yes') {
      res.redirect('is-the-specimen-alive')
  } else {
      res.redirect('what-is-the-name-of-your-specimen')
    }
})

// Is the specimens plastron longer than 60mm
router.get('/is-the-specimens-plastron-longer-than-60mm', function (req, res) {
  res.render(viewsFolder + 'is-the-specimens-plastron-longer-than-60mm')
})

router.post('/is-the-specimens-plastron-longer-than-60mm', function (req, res) {
  let plastron = req.session.data['plastron']

  if (plastron === 'yes') {
    res.redirect('live-animals-and-derivatives')
  } else {
    res.redirect('when-was-the-specimens-hatch-date')
  }
})

// Is this the only time the specimen has moved from its country of origin?
router.get('/is-this-the-only-time-the-specimen-has-moved-from-its-country-of-origin', function (req, res) {
  res.render(viewsFolder + 'is-this-the-only-time-the-specimen-has-moved-from-its-country-of-origin')
})

router.post('/is-this-the-only-time-the-specimen-has-moved-from-its-country-of-origin', function (req, res) {
  let theOnlyTimeMoved = req.session.data['theOnlyTimeMoved']

  if (theOnlyTimeMoved === 'yes') {
    res.redirect('where-are-you-importing-the-specimen-from')
  } else {
    res.redirect('where-was-the-specimen-last-re-exported-from')
  }
  })

  // Select proxy address
  router.get('/select-proxy-address', function (req, res) {
    res.render(viewsFolder + 'select-proxy-address')
  })

  router.post('/select-proxy-address', function (req, res) {
    res.redirect('confirm-proxy-address')
  })

// Start page
  router.get('/start', function (req, res) {
    res.render(viewsFolder + 'start')
  })

// Select your address
  router.get('/select-your-address', function (req, res) {
    res.render(viewsFolder + 'select-your-address')
  })

  router.post('/select-your-address', function (req, res) {
    res.redirect('confirm-your-address')
  })

// Select owners address
  router.get('/select-owner-address', function (req, res) {
    res.render(viewsFolder + 'select-owner-address')
  })

  router.post('/select-owner-address', function (req, res) {
    res.redirect('confirm-owner-address')
  })

// Tell us about the specimen's country of origin export permit
router.get('/tell-us-about-the-specimens-country-of-origin-export-permit', function (req, res) {
  res.render(viewsFolder + 'tell-us-about-the-specimens-country-of-origin-export-permit')
})

router.post('/tell-us-about-the-specimens-country-of-origin-export-permit', function (req, res) {
  let isCountryOfOrigin = req.session.data['isCountryOfOrigin']
  let permitType = req.session.data['permitType']

  if (permitType === 'import') {
    if (isCountryOfOrigin === 'yes') {
      res.redirect('has-the-specimen-ever-moved-from-its-country-of-origin')
    } else {
      res.redirect('is-this-the-only-time-the-specimen-has-moved-from-its-country-of-origin')
    }
  }

  if (permitType === 're-export') {
      res.redirect('what-will-you-use-your-permit-for')
  }
  })

  // You cannot use this service yet
  router.get('/you-cannot-use-this-service-yet', function (req, res) {
    res.render(viewsFolder + 'you-cannot-use-this-service-yet')
  })

  router.post('/you-cannot-use-this-service-yet', function (req, res) {
    res.redirect('start')
  })

// What is the name of your specimen?
router.get('/what-is-the-name-of-your-specimen', function (req, res) {
  res.render(viewsFolder + 'what-is-the-name-of-your-specimen')
})

router.post('/what-is-the-name-of-your-specimen', function (req, res) {
  let specimenName = req.session.data['specimen-name']
  res.redirect('is-this-specimen-correct')
})

// What is your proxy address
router.get('/what-is-your-proxy-address', function (req, res) {
  res.render(viewsFolder + 'what-is-your-proxy-address')
})

router.post('/what-is-your-proxy-address', function (req, res) {
  res.redirect('select-proxy-address')
})

// What is the total weight of the specimen? (Coral)
router.get('/what-is-the-total-weight-of-the-specimen', function (req, res) {
  res.render(viewsFolder + 'what-is-the-total-weight-of-the-specimen')
})

router.post('/what-is-the-total-weight-of-the-specimen', function (req, res) {
  res.redirect('#')
})

// What is the last re-export certificate number?
router.get('/what-is-the-last-re-export-certificate-number', function (req, res) {
  res.render(viewsFolder + 'what-is-the-last-re-export-certificate-number')
})

router.post('/what-is-the-last-re-export-certificate-number', function (req, res) {
  let permitType = req.session.data['permitType']

  if (req.session.data['permitType'] == 'import') {
    res.redirect('where-will-you-keep-your-specimen')
  } else {
    res.redirect('where-are-you-exporting-the-specimen-to')
  }

})

// What is your address
router.get('/what-is-your-address', function (req, res) {
  res.render(viewsFolder + 'what-is-your-address')
})

router.post('/what-is-your-address', function (req, res) {
  res.redirect('select-your-address')
})

// What will you use your permit for?
router.get('/what-will-you-use-your-permit-for', function (req, res) {
  res.render(viewsFolder + 'what-will-you-use-your-permit-for')
})

router.post('/what-will-you-use-your-permit-for', function (req, res) {
  res.redirect('add-any-other-information')
})

// What type of permit or certificate are you applying for?
router.get('/what-type-of-permit-or-certificate-are-you-applying-for', function (req, res) {
  res.render(viewsFolder + 'what-type-of-permit-or-certificate-are-you-applying-for')
})

router.post('/what-type-of-permit-or-certificate-are-you-applying-for', function (req, res) {
  let permitType = req.session.data['permitType']
  if (permitType === 'import') {
    res.redirect('species-add-to-list-0')
  }
  if (permitType === 'export') {
    res.redirect('species-add-to-list-0')
  }
  if (permitType === 're-export') {
    res.redirect('species-add-to-list-0')
  }
  if (permitType === 'A10') {
    res.redirect('#')
  }
  if (permitType === 'other') {
    res.redirect('you-cannot-use-this-service-yet')
  }
})

// When was the specimen's hatch date
router.get('/when-was-the-specimens-hatch-date', function (req, res) {
  res.render(viewsFolder + 'when-was-the-specimens-hatch-date')
})

router.post('/when-was-the-specimens-hatch-date', function (req, res) {
  res.redirect('enter-the-quantity')
})

// Where are you importing the specimen from?
router.get('/where-are-you-importing-the-specimen-from', function (req, res) {
  res.render(viewsFolder + 'where-are-you-importing-the-specimen-from')
})

router.post('/where-are-you-importing-the-specimen-from', function (req, res) {
  res.redirect('is-this-the-country-of-origin')
})

// Where are you exporting the specimen to?
router.get('/where-are-you-exporting-the-specimen-to', function (req, res) {
  res.render(viewsFolder + 'where-are-you-exporting-the-specimen-to')
})

router.post('/where-are-you-exporting-the-specimen-to', function (req, res) {
  res.redirect('are-you-sending-the-specimen-to-someone-else')
})

// Where did you source your specimen from?
router.get('/where-did-you-source-your-specimen-from', function (req, res) {
  res.render(viewsFolder + 'where-did-you-source-your-specimen-from')
})

router.post('/where-did-you-source-your-specimen-from', function (req, res) {
  let permitType = req.session.data['permitType']

  if (permitType === 'import') {
    res.redirect('are-the-details-the-same-for-each-specimen')
    // res.redirect('what-will-you-use-your-permit-for')
  }

  if (permitType === 're-export') {
      res.redirect('tell-us-about-the-specimens-country-of-origin-export-permit')
  }
})

// Where is the specimen’s country of origin?
router.get('/where-is-the-specimens-country-of-origin', function (req, res) {
  res.render(viewsFolder + 'where-is-the-specimens-country-of-origin')
})

router.post('/where-is-the-specimens-country-of-origin', function (req, res) {
  res.redirect('tell-us-about-the-specimens-country-of-origin-export-permit')
})

// Where was the specimen last re-exported from?
router.get('/where-was-the-specimen-last-re-exported-from', function (req, res) {
  res.render(viewsFolder + 'where-was-the-specimen-last-re-exported-from')
})

router.post('/where-was-the-specimen-last-re-exported-from', function (req, res) {
  let permitType = req.session.data['permitType']

  if (req.session.data['permitType'] == 're-export') {
    res.redirect('what-is-the-last-re-export-certificate-number')
  } else {
    res.redirect('what-is-the-last-re-export-certificate-number')
  }
  })

// Where will you keep your specimen?
router.get('/where-will-you-keep-your-specimen', function (req, res) {
  res.render(viewsFolder + 'where-will-you-keep-your-specimen')
})

router.post('/where-will-you-keep-your-specimen', function (req, res) {
  let permitType = req.session.data['permitType']

  if (permitType === 'import') {
        res.redirect('where-did-you-source-your-specimen-from')
      }

  if (permitType === 'export') {
        res.redirect('where-did-you-source-your-specimen-from')
      }

  if (permitType === 're-export') {
        res.redirect('where-is-the-specimens-country-of-origin')
      }

  })

// Who is receiving the specimen?
router.get('/who-is-receiving-the-specimen', function (req, res) {
  res.render(viewsFolder + 'who-is-receiving-the-specimen')
})

router.post('/who-is-receiving-the-specimen', function (req, res) {
  let permitType = req.session.data['permitType']
  let sendingToSomeoneElse = req.session.data['sendingToSomeoneElse']
  let isAlive = req.session.data['isAlive']

  if (permitType === 'export') {
      if (isAlive === 'alive') {
        res.redirect('where-will-you-keep-your-specimen')
      } else {
        res.redirect('where-did-you-source-your-specimen-from')
        }
    } else {
      res.redirect('where-will-you-keep-your-specimen')
      }

  if (permitType === 're-export') {
    if (sendingToSomeoneElse === 'yes') {
      if (isAlive === 'alive') {
        res.redirect('where-will-you-keep-your-specimen')
      } else {
        res.redirect('where-did-you-source-your-specimen-from')
        }
    } else {
      res.redirect('where-did-you-source-your-specimen-from')
      }
    }
  })


//************************ END OF USED PAGES IN V05 ************************************************************

// What's the owner's address
router.get('/whats-the-owners-address', function (req, res) {
  res.render(viewsFolder + 'whats-the-owners-address')
})

router.post('/whats-the-owners-address', function (req, res) {
  res.redirect('select-owner-address')
})

//// Owner details ////
// router.post('/confirm-owner-address', function (req, res) {
//   res.redirect('enter-proxy-contact-details')
// })

// In what capacity are you completing this application
// router.get('/in-what-capacity-are-you-completing-this-application', function (req, res) {
//   res.render(viewsFolder + 'in-what-capacity-are-you-completing-this-application')
// })
//
// router.post('/in-what-capacity-are-you-completing-this-application', function (req, res) {
//   let applicantType = req.session.data['applicantType']
//   if (applicantType === 'business') {
//     res.redirect('enter-proxy-contact-details')
//   }
//   if (applicantType === 'individual') {
//     res.redirect('enter-proxy-contact-details')
//   }
//   if (applicantType === 'agent') {
//     res.redirect('enter-proxy-contact-details')
//   }
// })
//
// //// Proxy details ////
// // Enter proxy contact details
// router.get('/enter-proxy-contact-details', function (req, res) {
//   res.render(viewsFolder + 'enter-proxy-contact-details')
// })
//
// router.post('/enter-proxy-contact-details', function (req, res) {
//   res.redirect('what-is-your-proxy-address')
// })
//
// // What is your proxy address
// router.get('/what-is-your-proxy-address', function (req, res) {
//   res.render(viewsFolder + 'what-is-your-proxy-address')
// })
//
// router.post('/what-is-your-proxy-address', function (req, res) {
//   res.redirect('select-proxy-address')
// })
//
// // Search for proxy address
// router.get('/search-for-proxy-address', function (req, res) {
//   res.render(viewsFolder + 'search-for-proxy-address')
// })
//
// router.post('/search-for-proxy-address', function (req, res) {
//   res.redirect('select-proxy-address')
// })
//
//
// // Enter proxy address manually
// router.get('/enter-proxy-address-manually', function (req, res) {
//   res.render(viewsFolder + 'enter-proxy-address-manually')
// })
//
// router.post('/enter-proxy-address-manually', function (req, res) {
//   res.redirect('confirm-proxy-address')
// })
//
// // Select proxy address
// router.get('/select-proxy-address', function (req, res) {
//   res.render(viewsFolder + 'select-proxy-address')
// })
//
// router.post('/select-proxy-address', function (req, res) {
//   res.redirect('confirm-proxy-address')
// })
//
// // Confirm proxy address
// router.get('/confirm-proxy-address', function (req, res) {
//   res.render(viewsFolder + 'confirm-proxy-address')
// })
//
// router.post('/confirm-proxy-address', function (req, res) {
//   res.redirect('what-type-of-permit-or-certificate-are-you-applying-for')
// })
//
// // Enter proxy international address
// router.get('/enter-proxy-international-address', function (req, res) {
//     res.render(viewsFolder + 'enter-proxy-international-address')
// })
//
// router.post('/enter-proxy-international-address', function (req, res) {
//   res.redirect('confirm-proxy-international-address')
// })



// Confirm proxy international address
router.get('/confirm-proxy-international-address', function (req, res) {
  res.render(viewsFolder + 'confirm-proxy-international-address')
})

router.post('/confirm-proxy-international-address', function (req, res) {
  res.redirect('what-type-of-permit-or-certificate-are-you-applying-for')
})


// // Who is applying for the permit
// router.get('/who-is-applying-for-the-permit', function (req, res) {
//   res.render(viewsFolder + 'who-is-applying-for-the-permit')
// })
//
// router.post('/who-is-applying-for-the-permit', function (req, res) {
//     // res.redirect('is-the-owner-a-uk-resident')
//     let isAgent = req.session.data['applicant']
//     if (isAgent === 'agent') {
//       res.redirect('is-the-owner-a-uk-resident')
//     } else {
//       res.redirect('what-type-of-permit-or-certificate-are-you-applying-for')
//     }
// })
//

// Is the owner a UK resident
// router.get('/is-the-owner-a-uk-resident', function (req, res) {
//   res.render(viewsFolder + 'is-the-owner-a-UK-resident')
// })
//
// router.post('/is-the-owner-a-uk-resident', function (req, res) {
//   let isUK = req.session.data['isUK']
//   if (isUK === 'yes') {
//     res.redirect('interruption-owner-is-uk-resident')
//   } else {
//     res.redirect('interruption-owner-is-non-uk-resident')
//   }
// })

// Search for owner address
// router.get('/search-for-owner-address', function (req, res) {
//   res.render(viewsFolder + 'search-for-owner-address')
// })
//
// router.post('/search-for-owner-address', function (req, res) {
//   res.redirect('select-owner-address')
// })
//

// Enter the owner's international address
// router.get('/enter-the-owners-international-address', function (req, res) {
//   res.render(viewsFolder + 'enter-the-owners-international-address')
// })
//
// router.post('/enter-the-owners-international-address', function (req, res) {
//   res.redirect('confirm-owner-international-address')
// })
//
// // Confirm owner international address
// router.get('/confirm-owner-international-address', function (req, res) {
//   res.render(viewsFolder + 'confirm-owner-international-address')
// })
//
// router.post('/confirm-owner-international-address', function (req, res) {
//   res.redirect('enter-proxy-contact-details')
// })
//

// What are your contact details
// router.get('/what-are-your-contact-details', function (req, res) {
//   res.render(viewsFolder + 'what-are-your-contact-details')
// })
//
// router.post('/what-are-your-contact-details', function (req, res) {
//   res.redirect('select-address')
// })
//
//
//
// // What are your contact details manual entry
// router.get('/what-are-your-contact-details-manual-entry', function (req, res) {
//   res.render(viewsFolder + 'what-are-your-contact-details-manual-entry')
// })
//
// router.post('/what-are-your-contact-details-manual-entry', function (req, res) {
//   res.redirect('confirm-you-have-the-owners-consent')
// })
//
//
//
// // Where should we send the permit
// router.get('/where-should-we-send-the-permit', function (req, res) {
//   res.render(viewsFolder + 'where-should-we-send-the-permit')
// })
//
// router.post('/where-should-we-send-the-permit', function (req, res) {
//   res.redirect('where-should-we-send-the-permit')
// })
//


// // Are you moving the specimen for commercial activities
// router.get('/are-you-moving-the-specimen-for-commercial-activities', function (req, res) {
//   res.render(viewsFolder + 'are-you-moving-the-specimen-for-commercial-activities')
// })
//
// router.post('/are-you-moving-the-specimen-for-commercial-activities', function (req, res) {
//   let isSelling = req.session.data['isSelling']
//   if (isSelling === 'selling') {
//     res.redirect('what-is-the-name-of-your-specimen')
//   } else {
//     res.redirect('what-is-the-name-of-your-specimen')
//   }
// })
//




// DESCRIPTION
// router.get('/description', function (req, res) {
//   if (req.session.data['specimen-name'] == 'tortoise') {
//       res.render(viewsFolder + 'is-the-specimens-plastron-longer-than-60mm')
//   }
// else {
//       res.render(viewsFolder + 'description-dynamic')
//     }
// })
//
// router.post('/description', function (req, res) {
//   res.redirect('enter-the-quantity')
// })
//
// // Leather goods
// router.get('/leather-goods', function (req, res) {
//   res.render(viewsFolder + 'leather-goods')
// })
//
// router.post('/leather-goods', function (req, res) {
//   res.redirect('enter-the-quantity')
// })
//

// Live animals and derivatives
// router.get('/live-animals-and-derivatives', function (req, res) {
//   res.render(viewsFolder + 'live-animals-and-derivatives')
// })
//
// router.post('/live-animals-and-derivatives', function (req, res) {
//   res.redirect('enter-the-quantity')
// })
//
// // Plants
// router.get('/plants', function (req, res) {
//   res.render(viewsFolder + 'plants')
// })
//
// router.post('/plants', function (req, res) {
//   res.redirect('enter-the-quantity')
// })
//
// // Coral
// router.get('/coral', function (req, res) {
//   res.render(viewsFolder + 'coral')
// })
//
// router.post('/coral', function (req, res) {
//   res.redirect('what-is-the-total-weight-of-your-specimen')
// })


// What is the certificate number
// router.get('/what-is-the-certificate-number', function (req, res) {
//   res.render(viewsFolder + 'what-is-the-certificate-number')
// })
//
// router.post('/what-is-the-certificate-number', function (req, res) {
//   res.redirect('where-are-you-importing-the-specimen-from')
// })
//


// Upload agent authourisation
router.get('/upload-agent-authorisation', function (req, res) {
  res.render(viewsFolder + 'upload-agent-authorisation')
})

router.post('/upload-agent-authorisation', function (req, res) {
  res.redirect('your-documents')
})

// Your documents
router.get('/your-documents', function (req, res) {
  res.render(viewsFolder + 'your-documents')
})

router.post('/your-documents', function (req, res) {
  res.redirect('what-type-of-permit-or-certificate-are-you-applying-for')
})

// Upload document
router.get('/add-photo', function (req, res) {
  res.render(viewsFolder + 'add-photo')
})


////// End of CITES code /////


/// ///////////////////////////////////////////
// START-PROTOTYPE_1
router.get('/start-prototype', function (req, res) {

  // Remove the previous photo (no need to store it for the prototype.  Heroku will remove them everytime it restarts anyway, but might as well be tidy)
  // This isn't perfect, but removes most of the images floating about unnecessarily.
  if (req.session.data['imageName']) {
    const imagePath = path.join(__dirname, './uploads/', req.session.data['imageName'])
    fs.unlink(imagePath, err => {
      if (err) logger(req, err)
      else logger(req, 'Image removed = ' + imagePath)
    })
  }

  req.session.destroy(function (err) {
    if (err) logger(req, err)
    else logger(req, 'Previous session destroyed')
  })

  res.redirect('what-type-of-item-is-it')
  // res.redirect('choose-exemption')
  // res.redirect('is-it-a-musical-instrument')
})


/// ///////////////////////////////////////////////////////////////////////////
// COMMON PHOTO FUNCTIONS
function deletePhoto (req, photo) {

  // Remove photo from photos array session variable
  const indexOfPhoto = req.session.data.photos.indexOf(photo)
  req.session.data.photos.splice(indexOfPhoto, 1)

  // Delete photo from storage
  const photoPath = path.join(rootAppDirectory, version, '/photos/', photo)
  fs.unlink(photoPath, err => {
    if (err) {
      console.log(err)
    }
  })

  console.log(`photo deleted: ${photo}`)
  console.log(`photos array: ${req.session.data.photos}`)
}


/// ///////////////////////////////////////////////////////////////////////////
// ADD PHOTO
// if (req.session.data.photos && req.session.data.photos.length) {

router.get('/add-photo', function (req, res) {

  var backUrl
  backUrl = 'what-type-of-item-is-it'

  if (req.session.data['checkYourAnswers'] == 'hub') {
    backUrl = 'your-photos'
  }

  res.render(viewsFolder + 'add-photo', {
    backUrl: backUrl
  })

})


router.post('/add-photo', function (req, res) {

  // Set back button URL
  req.session.data['backUrl'] = 'add-photo'

  // Prepare for the photo upload code
  const upload = multer({
    dest: path.join(rootAppDirectory, version, '/photos'),
    limits: {
      fileSize: 8 * 1024 * 1024 // 8 MB (max file size in bytes)
    }
  }).array('fileToUpload') /* name attribute of <file> element in the html form */

  // Upload the chosen file to the multer 'dest'
  upload(req, res, function (err) {

    // Handle errors
    if (err) {
      logger(req, 'Multer threw an error' + err)
    }

    // Handle no file chosen
    if (!req.files.length) {

      logger(req, 'No file chosen/uploaded')
      res.render(viewsFolder + 'add-photo', {
        errorNoFile: 'Choose a photo'
      })

    } else {

      for ( i=0; i < req.files.length; i++ ) {

        // Handle a wrong file type
        const multerDestPath = req.files[i].path
        var fileExt = path.extname(req.files[i].originalname).toLowerCase()
        if (fileExt !== '.png' && fileExt !== '.jpg' && fileExt !== '.jpeg') {
          logger(req, 'Wrong file type')
          fs.unlink(multerDestPath, err => {
            if (err) console.log(err)
          })
          res.render(viewsFolder + 'add-photo', {
            errorNoFile: 'The photo must be JPG, JPEG or PNG'
          })
        }

        // Passes all validation, so move/rename it to the persistent location
        // (We need to initially save it somewhere to get the file extension otherwise we'd need an additional module to handle the multipart upload)
        var photo = new Date().getTime().toString() + i + fileExt // getTime() gives the milliseconds since 1970...
        const targetPath = path.join(rootAppDirectory, version, '/photos/', photo)

        fs.rename(multerDestPath, targetPath, function (err) {
          if (err) {
            console.log('err = ' + err)
          }
        })

        // Handle session variables
        // Add a photo to the photos array (and create array if it doesn't exist yet)
        if (!req.session.data.photos) {
          req.session.data.photos = []
        }
        req.session.data.photos.push(photo)
        console.log(`photo added: ${photo}`)
        console.log(`photo array: ${req.session.data.photos}`)

      }


      if (err) {
        console.log('err = ' + err)
      } else {

        res.redirect('your-photos')

      }

    }
  })
})


/// ///////////////////////////////////////////////////////////////////////////
// YOUR PHOTOS
router.get('/your-photos', function (req, res) {

  // If we've come from the CYA page, make that the Back link destination
  var backUrl
  backUrl = 'what-type-of-item-is-it'
  if (req.session.data['checkYourAnswers'] == 'hub') {
    backUrl = 'check-your-answers'
  }

  // Reset the what next decision
  req.session.data['photos-what-next'] = ''

  // If there are photos in the array, build the array expected by the GOV.UK summary list
  if (req.session.data.photos && req.session.data.photos.length) {
    const photosSummaryList = req.session.data.photos.map((photo, position) => {
      return {
        key: {
          classes: 'your-photos-key',
          text: `Photo ${position + 1}`
        },
        value: {
          classes: 'your-photos-value',
          html: `<img class="your-photos-img" src="${res.locals.baseUrl}/photos/${photo}" />`
        },
        actions: {
          classes: 'your-photos-actions',
          items: [
            {
              href: `${res.locals.baseUrl}/public/remove-photo/${photo}`,
              text: 'Remove',
              visuallyHiddenText: `Photo ${position + 1}`
            }
          ]
        }
      }
    })

    res.render(viewsFolder + 'your-photos', {

      backUrl: backUrl,
      photosSummaryList: photosSummaryList

    })

    // If there are no photos in the array, redirect to add-photo
  } else {
    res.redirect('add-photo')
  }
})


router.post('/your-photos', function (req, res) {
  // Set back button URL
  req.session.data['backUrl'] = 'your-photos'

  if (req.session.data['checkYourAnswers'] == 'hub') {
    res.redirect('check-your-answers')
  } else {
    res.redirect('describe-the-item')
  }

})


/// ///////////////////////////////////////////////////////////////////////////
// CONFIRM REMOVE PHOTO
router.get('/confirm-remove-photo/:filename', function (req, res) {

  res.render(viewsFolder + 'confirm-remove-photo', {

    // backUrl:  'your-photos',
    // const photo = req.params.filename

    backUrl: `${res.locals.baseUrl}/public/your-photos`,
    photo: req.params.filename
    // photo: req.session.data.photos[req.session.data.photos.length - 1]
  })
})

router.post('/confirm-remove-photo/:filename', function (req, res) {
  // Set back button URL
  // req.session.data['backUrl'] = 'what-type-of-item-is-it'
  // res.redirect('your-photos')
  const photo = req.params.filename
  res.redirect(`${res.locals.baseUrl}/public/remove-photo/` + photo)
})



/// ///////////////////////////////////////////////////////////////////////////
// DELETE PHOTOS
router.get('/remove-photo/:filename', (req, res) => {
  const photo = req.params.filename
  deletePhoto(req, photo)
  res.redirect(`${res.locals.baseUrl}/public/your-photos`) // Dave: This is an explicit path because my computer/browser was having problems with relative paths, which was particularly confusing when the relative path was appended to 'delete-photo'.
})




//* ****************************************************
// add-photo
router.get('/add-photo-1', function (req, res) {
  res.render(viewsFolder + 'add-photo-1')
})

router.post('/add-photo-1', function (req, res) {
  console.log('DEBUG.routes.add-photo-1.post: ' + req.session.data['photograph'])
  res.redirect('add-description')
})



//* ****************************************************
// CONFIRMATION EMAIL
router.get('/confirmation-email', function (req, res){

  var exemption = req.query.e
  var contactEmail = "jacky.turner@boltsandratchets.co.uk"
  var contactName
  var contactBusiness

  if (req.session.data['ownerAgent'] == 'owner') {
    contactEmail = req.session.data['ownerEmail']
    contactName = req.session.data['ownerName']
    contactBusiness = req.session.data['addressBusiness']
  } else if (req.session.data['ownerAgent'] == 'agent') {
    contactEmail = req.session.data['agentEmail']
    contactName = req.session.data['agentName']
    contactBusiness = req.session.data['agentAddressBusiness']
  }
  logger(req, 'ownerAgent=' + req.session.data['ownerAgent'] + ', therefore contact email=' + contactEmail)

  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const dayLong = date.toLocaleString('default', { weekday: 'long' })
  const day = date.toLocaleString('default', { day: 'numeric' })
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  const timeOfRegistration = `${hours}:${minutes}`
  const dateOfRegistration = `${dayLong} ${day} ${month} ${year}`

  res.render(viewsFolder + 'confirmation-email', {
    exemption: exemption,
    contactEmail: contactEmail,
    contactName: contactName,
    contactBusiness: contactBusiness,
    dateOfRegistration: dateOfRegistration,
    timeOfRegistration: timeOfRegistration
  })
})

//* ****************************************************
// CONFIRMATION EMAIL RMI - SUCCESS
router.get('/confirmation-email-RMI-success', function (req, res){

  var exemption = req.query.e
  var contactEmail = "jacky.turner@boltsandratchets.co.uk"
  var contactName
  var contactBusiness

  if (req.session.data['ownerAgent'] == 'owner') {
    contactEmail = req.session.data['ownerEmail']
    contactName = req.session.data['ownerName']
    contactBusiness = req.session.data['addressBusiness']
  } else if (req.session.data['ownerAgent'] == 'agent') {
    contactEmail = req.session.data['agentEmail']
    contactName = req.session.data['agentName']
    contactBusiness = req.session.data['agentAddressBusiness']
  }
  logger(req, 'ownerAgent=' + req.session.data['ownerAgent'] + ', therefore contact email=' + contactEmail)

  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const dayLong = date.toLocaleString('default', { weekday: 'long' })
  const day = date.toLocaleString('default', { day: 'numeric' })
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  const timeOfRegistration = `${hours}:${minutes}`
  const dateOfRegistration = `${dayLong} ${day} ${month} ${year}`

  res.render(viewsFolder + 'confirmation-email-RMI-success', {
    exemption: exemption,
    contactEmail: contactEmail,
    contactName: contactName,
    contactBusiness: contactBusiness,
    dateOfRegistration: dateOfRegistration,
    timeOfRegistration: timeOfRegistration
  })
})


//* ****************************************************
// CONFIRMATION EMAIL RMI - REJECT
router.get('/confirmation-email-RMI-reject', function (req, res){

  var exemption = req.query.e
  var contactEmail = "jacky.turner@boltsandratchets.co.uk"
  var contactName
  var contactBusiness

  if (req.session.data['ownerAgent'] == 'owner') {
    contactEmail = req.session.data['ownerEmail']
    contactName = req.session.data['ownerName']
    contactBusiness = req.session.data['addressBusiness']
  } else if (req.session.data['ownerAgent'] == 'agent') {
    contactEmail = req.session.data['agentEmail']
    contactName = req.session.data['agentName']
    contactBusiness = req.session.data['agentAddressBusiness']
  }
  logger(req, 'ownerAgent=' + req.session.data['ownerAgent'] + ', therefore contact email=' + contactEmail)

  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const dayLong = date.toLocaleString('default', { weekday: 'long' })
  const day = date.toLocaleString('default', { day: 'numeric' })
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  const timeOfRegistration = `${hours}:${minutes}`
  const dateOfRegistration = `${dayLong} ${day} ${month} ${year}`

  res.render(viewsFolder + 'confirmation-email-RMI-reject', {
    exemption: exemption,
    contactEmail: contactEmail,
    contactName: contactName,
    contactBusiness: contactBusiness,
    dateOfRegistration: dateOfRegistration,
    timeOfRegistration: timeOfRegistration
  })
})


//* ****************************************************
// REGISTRATION
router.get('/registration', function (req, res) {

  var exemption = req.query.e

  const date = new Date()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const dayLong = date.toLocaleString('default', { weekday: 'long' })
  const day = date.toLocaleString('default', { day: 'numeric' })
  const month = date.toLocaleString('default', { month: 'long' })
  const year = date.getFullYear()
  const timeOfRegistration = `${hours}:${minutes}`
  const dateOfRegistration = `${dayLong} ${day} ${month} ${year}`

  res.render(viewsFolder + 'registration', {
    exemption: exemption,
    dateOfRegistration: dateOfRegistration
  })
})

//* ****************************************************
// GOVPAY LOOKALIKE 1
router.get('/govpay-lookalike-1', function (req, res) {
  res.render(viewsFolder + 'govpay-lookalike-1')
})

router.post('/govpay-lookalike-1', function (req, res) {
  res.redirect('govpay-lookalike-2')
})

//* ****************************************************
// GOVPAY LOOKALIKE 2
router.get('/govpay-lookalike-2', function (req, res) {
  res.render(viewsFolder + 'govpay-lookalike-2')
})

router.post('/govpay-lookalike-2', function (req, res) {
    if (req.session.data['exemptionChoice'] == 'type5') {
      res.redirect('confirmation-RMI')
      } else {
        res.redirect('confirmation')
    }
})

// PAY
router.get('/pay', function (req, res) {
  console.log('DEBUG.routes.pay')

  res.redirect(process.env.GOVUK_PAY_PROTOTYPE_LINK)
})

//* ****************************************************

// DO YOU WANT TO ADD SUPPORTING DOCUMENTS?
router.get('/want-to-add-documents', function (req, res) {
  res.render(viewsFolder + 'want-to-add-documents')
})

router.post('/want-to-add-documents', function (req, res) {
  if (req.session.data['documents'] == 'Yes') {
    res.redirect('add-document')
    } else {
      res.redirect('who-owns-item')
  }
})

// ADD DOCUMENT
router.get('/add-document', function (req, res) {
  res.render(viewsFolder + 'add-document')
})

router.post('/add-document', function (req, res) {
    res.redirect('your-documents')
})

// YOUR DOCUMENTS
router.get('/your-documents', function (req, res) {
  res.render(viewsFolder + 'your-documents')
})

router.post('/your-documents', function (req, res) {
    res.redirect('who-owns-item')
})


module.exports = router
