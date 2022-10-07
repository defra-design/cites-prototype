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


//*************  Start of v07 additions *************//

// Are you applying on behalf of someone else?
router.get('/are-you-applying-on-behalf-of-someone-else', function (req, res) {
  res.render(viewsFolder + 'are-you-applying-on-behalf-of-someone-else')
})

router.post('/are-you-applying-on-behalf-of-someone-else', function (req, res) {
if (req.session.data['isAgent'] == 'yes') {
  res.redirect('enter-your-contact-details-agent')
} else {
  res.redirect('enter-your-contact-details-applicant')
}
})

// Add to list GDS
router.get('/add-to-list-gds', function (req, res) {
  res.render(viewsFolder + 'add-to-list-gds')
})

router.post('/add-to-list-gds', function (req, res) {
  let specimenInput = req.session.data['specimenInput']
  res.redirect('#')
})

// Add a species
router.get('/add-a-species', function (req, res) {
  res.render(viewsFolder + 'add-a-species')
})

router.post('/add-a-species', function (req, res) {
  res.redirect('add-a-species-added')
})

// Add a species added
router.get('/add-a-species-added', function (req, res) {
  res.render(viewsFolder + 'add-a-species-added')
})

router.post('/add-a-species-added', function (req, res) {
  res.redirect('where-did-you-source-your-specimen-from')
})

// Agent contact details
router.get('/agent-contact-details', function (req, res) {
  res.render(viewsFolder + 'agent-contact-details')
})

router.post('/agent-contact-details', function (req, res) {
  res.redirect('what-is-your-address')
})

// Add any other information
router.get('/add-any-other-information', function (req, res) {
  res.render(viewsFolder + 'add-any-other-information')
})

router.post('/add-any-other-information', function (req, res) {
  req.session.data['currentSpecimenCount'] = (req.session.data['specimenCount'] + 1)
  if (req.session.data['specimenCount'] == req.session.data['totalSpecimens1']) {
    res.redirect('file-upload')
  } else {
  // req.session.data['specimenCount'] = req.session.data['specimenCount'] + 1
  res.redirect('cya')
}
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

  if (permitType === 'export') {
        res.redirect('who-is-importing-the-specimen')
    }


  if (permitType === 're-export') {
    if (sendingToSomeoneElse === 'yes') {
        res.redirect('who-is-importing-the-specimen')
      }
    }

    if (permitType === 're-export') {
      if (sendingToSomeoneElse === 'no') {
        if (isAlive === 'alive') {
          res.redirect('where-will-you-keep-your-specimen')
        }
      }
    }

  if (permitType === 're-export') {
    if (sendingToSomeoneElse === 'no') {
      if (isAlive === 'dead') {
        res.redirect('where-is-the-specimens-country-of-origin')
      }
    }
  }
})

// Contact details
router.get('/contact-details', function (req, res) {
  res.render(viewsFolder + 'contact-details')
})

router.post('/contact-details', function (req, res) {
  res.redirect('permit-details')
})

// Permit details
router.get('/permit-details', function (req, res) {
  res.render(viewsFolder + 'permit-details')
})

router.post('/permit-details', function (req, res) {
  res.redirect('add-any-other-information')
})

// Specimen details
router.get('/specimen-details', function (req, res) {
  res.render(viewsFolder + 'specimen-details')
})

router.post('/specimen-details', function (req, res) {
  res.redirect('permit-details')
})

// Specimen history
router.get('/specimen-history', function (req, res) {
  res.render(viewsFolder + 'specimen-history')
})

router.post('/specimen-history', function (req, res) {
  res.redirect('check-your-answers-new')
})

// Check your answers new
router.get('/check-your-answers-new', function (req, res) {
  res.render(viewsFolder + 'check-your-answers-new')
})

router.post('/check-your-answers-new', function (req, res) {
  res.redirect('file-upload')
})







//*************  End of v07 additions *************//



// Species add to list 0
router.get('/species-add-to-list-0', function (req, res) {
  req.session.data['noOfSpecies'] = 1
  req.session.data['noOfSpecimens'] = 1
  req.session.data['noOfPermits'] = 1
  req.session.data['speciesCount'] = 1
  req.session.data['specimenCount'] = 1
  req.session.data['permit'] = 1
  // req.session.data['speciesName'] = "Species name"
  req.session.data['loopCount'] = 1
  res.render(viewsFolder + 'species-add-to-list-0')
})

router.post('/species-add-to-list-0', function (req, res) {
  res.redirect('species-add-to-list-1')
})

// Species add to list 1
router.get('/species-add-to-list-1', function (req, res) {
  req.session.data['speciesName'] = req.session.data['species-name-1']
  res.render(viewsFolder + 'species-add-to-list-1')
})

router.post('/species-add-to-list-1', function (req, res) {
  req.session.data['noOfSpecies'] = req.session.data['noOfSpecies'] + 1
  req.session.data['speciesName'] = req.session.data['species-name-1']

    res.redirect('species-add-to-list-2')
})

// // Single species application
// router.get('/single-species', function (req, res) {
//   req.session.data['speciesName'] = req.session.data['species-name-1']
//   res.render(viewsFolder + 'how-many-specimens')
// })


// Species add to list 2
router.get('/species-add-to-list-2', function (req, res) {
  req.session.data['speciesName'] = req.session.data['species-name-1']
  res.render(viewsFolder + 'species-add-to-list-2')
})

router.post('/species-add-to-list-2', function (req, res) {
  req.session.data['noOfSpecies'] = req.session.data['noOfSpecies'] + 1
  res.redirect('specimen-details')
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

// Are all the specimens alive
router.get('/are-all-the-specimens-alive', function (req, res) {
  res.render(viewsFolder + 'are-all-the-specimens-alive')
})

router.post('/are-all-the-specimens-alive', function (req, res) {
  res.redirect('description-dynamic')
})

// How many specimens
router.get('/how-many-specimens', function (req, res) {
  let specimenCount = 0
  res.render(viewsFolder + 'how-many-specimens')
})

router.post('/how-many-specimens', function (req, res) {
  res.redirect('where-did-you-source-your-specimen-from')
})

// Parameters
router.get('/parameters', function (req, res) {
  res.render(viewsFolder + 'parameters')
})

router.post('/parameters', function (req, res) {
  res.redirect('#')
})


// Check your answers
router.get('/check-your-answers', function (req, res) {
  res.render(viewsFolder + 'check-your-answers')
})

router.post('/check-your-answers', function (req, res) {
  req.session.data['speciesName'] = req.session.data['species-name-2']
  req.session.data['specimenCount'] = 1

    if (req.session.data['speciesCount'] == req.session.data['noOfSpecies']) {
      res.redirect('permit-preview')
  } else {
      req.session.data['speciesCount'] = req.session.data['speciesCount'] + 1
      req.session.data['totalSpecimens1'] = ''
      res.redirect('how-many-specimens')
  }
})

// CYA
router.get('/cya', function (req, res) {
  res.render(viewsFolder + 'cya')
})

router.post('/cya', function (req, res) {

if (req.session.data['useDetails'] === 'yes-one') {
  req.session.data['justThisOne'] = 0
}

  if (req.session.data['specimenCount'] == req.session.data['totalSpecimens1']){
    res.redirect('check-your-answers')
  } else if (req.session.data['useDetails'] === 'no-none') {
    req.session.data['specimenCount'] = req.session.data['specimenCount'] + 1
    res.redirect('specimen-details')
} else {
  req.session.data['specimenCount'] = req.session.data['specimenCount'] + 1
  res.redirect('specimen-details')
}
})

// Confirm the address applicant
router.get('/confirm-the-address-applicant', function (req, res) {
  res.render(viewsFolder + 'confirm-the-address-applicant')
})

router.post('/confirm-the-address-applicant', function (req, res) {
  if (req.session.data['isAgent'] === 'yes') {
    res.redirect('enter-applicant-contact-details')
} else {
  res.redirect('species-add-to-list-0')
}
})

// Confirm your address - agent
router.get('/confirm-your-address-agent', function (req, res) {
  res.render(viewsFolder + 'confirm-your-address-agent')
})

router.post('/confirm-your-address-agent', function (req, res) {
  res.redirect('enter-contact-details-applicant')
})

// Confirm your address - applicant
router.get('/confirm-your-address-applicant', function (req, res) {
  res.render(viewsFolder + 'confirm-your-address-applicant')
})

router.post('/confirm-your-address-applicant', function (req, res) {
  if (req.session.data['address'] == 'address-2') {
    res.redirect('enter-delivery-address')
  } else {
    res.redirect('species-add-to-list-0')
  }
  })

// Confirm delivery address
router.get('/confirm-delivery-address', function (req, res) {
  res.render(viewsFolder + 'confirm-delivery-address')
})

router.post('/confirm-delivery-address', function (req, res) {
  res.redirect('species-add-to-list-0')
})

// Confirm your address - agent led
router.get('/confirm-your-address-agent-led', function (req, res) {
  res.render(viewsFolder + 'confirm-your-address-agent-led')
})

router.post('/confirm-your-address-agent-led', function (req, res) {
  if (req.session.data['delivery-address'] == 'delivery-address-3') {
    res.redirect('enter-delivery-address')
  } else {
    res.redirect('species-add-to-list-0')
  }
  })

// Confirm you have the owner's consent
router.get('/confirm-you-have-the-owners-consent', function (req, res) {
  res.render(viewsFolder + 'confirm-you-have-the-owners-consent')
})

router.post('/confirm-you-have-the-owners-consent', function (req, res) {
  res.redirect('enter-the-owners-contact-details')
})

// Enter applicant contact details
router.get('/enter-applicant-contact-details', function (req, res) {
  res.render(viewsFolder + 'enter-applicant-contact-details')
})

router.post('/enter-applicant-contact-details', function (req, res) {
  res.redirect('what-is-your-address')
})

// Enter your contact details (agent)
router.get('/enter-your-contact-details-agent', function (req, res) {
  res.render(viewsFolder + 'enter-your-contact-details-agent')
})

router.post('/enter-your-contact-details-agent', function (req, res) {
  res.redirect('what-is-your-address-agent')
})

// Enter your contact details applicant
router.get('/enter-your-contact-details-applicant', function (req, res) {
  res.render(viewsFolder + 'enter-your-contact-details-applicant')
})

router.post('/enter-your-contact-details-applicant', function (req, res) {
  res.redirect('what-is-your-address-applicant')
})

// Confirm applicants address
router.get('/confirm-applicants-address', function (req, res) {
  res.render(viewsFolder + 'confirm-applicants-address')
})

router.post('/confirm-applicants-address', function (req, res) {
  // let isAgent = req.session.data['isAgent']
if (req.session.data['isAgent'] == 'no') {
  res.redirect('what-type-of-permit-or-certificate-are-you-applying-for')
} else {
  res.redirect('enter-your-contact-details-agent')
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
  let useDetails = req.session.data['useDetails']

// ************* Check if this is the first instance of specimen
  if (req.session.data['specimenCount'] == 1){
    if (req.session.data['permitType'] == 'import') {
        res.redirect('where-are-you-importing-the-specimen-from')
    }
    else if (req.session.data['permitType'] == 'export') {
        res.redirect('where-are-you-exporting-the-specimen-to')
    }
    else if (req.session.data['permitType'] == 're-export') {
        res.redirect('where-was-the-specimen-last-re-exported-from')
    }
    else if (req.session.data['permitType'] == 'A10') {
        res.redirect('where-is-the-specimens-country-of-origin')
    }
  }

// ************* Check if all the specimens for this species have been processed
// console.log("Total specimens", req.session.data['totalSpecimens1'], typeof req.session.data['totalSpecimens1'])
// console.log("Specimen count", req.session.data['specimenCount'], typeof req.session.data['specimenCount'])
// console.log("Use Deatails", req.session.data['useDetails'], typeof req.session.data['useDetails'])




if (req.session.data['specimenCount'] == req.session.data['totalSpecimens1']){
  if (useDetails === 'no-none') {
    if (req.session.data['permitType'] == 'import') {
        res.redirect('where-are-you-importing-the-specimen-from')
    }
    else if (req.session.data['permitType'] == 'export') {
        res.redirect('where-are-you-exporting-the-specimen-to')
    }
    else if (req.session.data['permitType'] == 're-export') {
        res.redirect('where-was-the-specimen-last-re-exported-from')
    }
    else if (req.session.data['permitType'] == 'A10') {
        res.redirect('where-is-the-specimens-country-of-origin')
    }
    else {
        res.redirect('#') }
  }
}

if (req.session.data['specimenCount'] == req.session.data['totalSpecimens1']){
  if (useDetails === 'yes-one') {
    if (req.session.data['permitType'] == 'import') {
        res.redirect('where-are-you-importing-the-specimen-from')
    }
    else if (req.session.data['permitType'] == 'export') {
        res.redirect('where-are-you-exporting-the-specimen-to')
    }
    else if (req.session.data['permitType'] == 're-export') {
        res.redirect('where-was-the-specimen-last-re-exported-from')
    }
    else if (req.session.data['permitType'] == 'A10') {
        res.redirect('where-is-the-specimens-country-of-origin')
    }
    else {
        res.redirect('#') }
  }
}

if (req.session.data['specimenCount'] == req.session.data['totalSpecimens1']){
    res.redirect('check-your-answers')
  }

  if (useDetails === 'yes-all') {
    req.session.data['specimenCount'] = req.session.data['specimenCount'] + 1
    res.redirect('#')
  }

  if (useDetails === 'no-none') {
    if (req.session.data['permitType'] == 'import') {
        res.redirect('where-are-you-importing-the-specimen-from')
    }
    else if (req.session.data['permitType'] == 'export') {
        res.redirect('where-are-you-exporting-the-specimen-to')
    }
    else if (req.session.data['permitType'] == 're-export') {
        res.redirect('where-was-the-specimen-last-re-exported-from')
    }
    else if (req.session.data['permitType'] == 'A10') {
        res.redirect('where-is-the-specimens-country-of-origin')
    }
    else {
        res.redirect('#') }
  }

if (useDetails == 'yes-one') {
  if (req.session.data['justThisOne'] >= 1) {
    if (req.session.data['permitType'] == 'import') {
        res.redirect('where-are-you-importing-the-specimen-from')
    }
    else if (req.session.data['permitType'] == 'export') {
        res.redirect('where-are-you-exporting-the-specimen-to')
    }
    else if (req.session.data['permitType'] == 're-export') {
        res.redirect('where-was-the-specimen-last-re-exported-from')
    }
    else if (req.session.data['permitType'] == 'A10') {
        res.redirect('where-is-the-specimens-country-of-origin')
    }
  } else {
      req.session.data['justThisOne'] = 1
      req.session.data['specimenCount'] = req.session.data['specimenCount'] + 1
    res.redirect('#')
  }
}
})

  // if (req.session.data['specimenCount'] == req.session.data['totalSpecimens1']){
  //     res.redirect('check-your-answers')
  //   } else if (useDetails === 'yes-all') {
  //       req.session.data['specimenCount'] = req.session.data['specimenCount'] + 1
  //       res.redirect('#')
  //   } else if (useDetails === 'yes-one') {
  //     req.session.data['specimenCount'] = req.session.data['specimenCount'] + 1
  //     req.session.data['justThisOne'] = 1
  //     res.redirect('#')
  //   }


// if (req.session.data['specimenCount'] == req.session.data['totalSpecimens1']){
//   if (useDetails == 'yes-one') {
//     if (req.session.data['justThisOne'] == 1) {
//       req.session.data['specimenCount'] = req.session.data['specimenCount'] + 1
//       res.redirect('where-will-you-keep-your-specimen')
//       } else {
//         req.session.data['justThisOne'] =  req.session.data['justThisOne'] + 1
//         res.redirect('#')
//       }
//     }



// Describe the specimen
router.get('/describe-the-specimen', function (req, res) {
  res.render(viewsFolder + 'describe-the-specimen')
})


router.post('/describe-the-specimen', function (req, res) {
  res.redirect('enter-the-quantity')
})

// Do you know what to pay
router.get('/do-you-know-what-to-pay', function (req, res) {
  res.render(viewsFolder + 'do-you-know-what-to-pay')
})

router.post('/do-you-know-what-to-pay', function (req, res) {
  res.redirect('#')
})


// Drop out
router.get('/drop-out', function (req, res) {
  res.render(viewsFolder + 'drop-out')
})

router.post('/drop-out', function (req, res) {
  res.redirect('#')
})

// Do you know the trade term code
router.get('/do-you-know-the-trade-term-code', function (req, res) {
  res.render(viewsFolder + 'do-you-know-the-trade-term-code')
})

router.post('/do-you-know-the-trade-term-code', function (req, res) {
    let isAlive = req.session.data['isAlive']
    let specimen = req.session.data['specimen']

    if (isAlive === 'alive') {
      if (specimen === 'Tortoise') {
        res.redirect('is-the-specimens-plastron-longer-than-60mm')
      } else {
          res.redirect('description-dynamic')
        }
    }

    if (isAlive === 'dead') {
            res.redirect('description-dynamic')
      }
})

// // // Enter the owner's contact details
// // router.get('/enter-the-owners-contact-details', function (req, res) {
// //   res.render(viewsFolder + 'enter-the-owners-contact-details')
// // })
//
// router.post('/enter-the-owners-contact-details', function (req, res) {
//   res.redirect('whats-the-owners-address')
// })

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

// Enter contact details applicant
router.get('/enter-contact-details-applicant', function (req, res) {
  res.render(viewsFolder + 'enter-contact-details-applicant')
})

router.post('/enter-contact-details-applicant', function (req, res) {
  res.redirect('what-is-your-address-agent-led')
})

// Enter delivery address
router.get('/enter-delivery-address', function (req, res) {
  res.render(viewsFolder + 'enter-delivery-address')
})

router.post('/enter-delivery-address', function (req, res) {
  res.redirect('confirm-delivery-address')
})

// Enter your address manually - agent
router.get('/enter-your-address-manually-agent', function (req, res) {
  res.render(viewsFolder + 'enter-your-address-manually-agent')
})

router.post('/enter-your-address-manually-agent', function (req, res) {
  res.redirect('confirm-your-address-agent')
})

// Enter your address manually - applicant
router.get('/enter-your-address-manually-applicant', function (req, res) {
  res.render(viewsFolder + 'enter-your-address-manually-applicant')
})

router.post('/enter-your-address-manually-applicant', function (req, res) {
  res.redirect('confirm-your-address-applicant')
})

// Enter your address manually - agent led
router.get('/enter-your-address-manually-agent-led', function (req, res) {
  res.render(viewsFolder + 'enter-your-address-manually-agent-led')
})

router.post('/enter-your-address-manually-agent-led', function (req, res) {
  res.redirect('confirm-your-address-agent-led')
})

// File upload
router.get('/file-upload', function (req, res) {
  res.render(viewsFolder + 'file-upload')
})

router.post('/file-upload', function (req, res) {
  res.redirect('check-your-answers')
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

// Is this specimen alive?
router.get('/is-this-specimen-alive', function (req, res) {
  res.render(viewsFolder + 'is-this-specimen-alive')
})

// router.post('/is-this-specimen-alive', function (req, res) {
//   res.redirect('do-you-know-the-trade-term-code')
// })

router.post('/is-this-specimen-alive', function (req, res) {
  let isAlive = req.session.data['isAlive']
  let specimen = req.session.data['speciesName']

  if (isAlive === 'alive') {
    if (specimen === 'Testudo Hermanni, Tortoise') {
      res.redirect('is-the-specimens-plastron-longer-than-60mm')
    } else {
        res.redirect('do-you-know-the-trade-term-code')
      }
  }

  if (isAlive === 'dead') {
          res.redirect('do-you-know-the-trade-term-code')
    }
})

// Is this specimen correct
router.get('/is-this-specimen-correct', function (req, res) {
  res.render(viewsFolder + 'is-this-specimen-correct')
})

router.post('/is-this-specimen-correct', function (req, res) {
  let correctSpecimen = req.session.data['correctSpecimen']
  if (correctSpecimen === 'yes') {
      res.redirect('where-did-you-source-your-specimen-from')
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
    res.redirect('description-dynamic')
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
    res.redirect('add-any-other-information')
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

  // Search for applicant's address
  router.get('/search-for-applicants-address', function (req, res) {
    res.render(viewsFolder + 'search-for-applicants-address')
  })

  router.post('/search-for-applicants-address', function (req, res) {
    res.redirect('select-applicants-address')
  })

  // Search for your address - agent
  router.get('/search-for-your-address-agent', function (req, res) {
    res.render(viewsFolder + 'search-for-your-address-agent')
  })

  router.post('/search-for-your-address-agent', function (req, res) {
    res.redirect('select-your-address-agent')
  })

  // Search for your address - applicant
  router.get('/search-for-your-address-applicant', function (req, res) {
    res.render(viewsFolder + 'search-for-your-address-applicant')
  })

  router.post('/search-for-your-address-applicant', function (req, res) {
    res.redirect('select-your-address-applicant')
  })

  // Search for your address - agent led
  router.get('/search-for-your-address-agent-led', function (req, res) {
    res.render(viewsFolder + 'search-for-your-address-agent-led')
  })

  router.post('/search-for-your-address-agent-led', function (req, res) {
    res.redirect('select-your-address-agent-led')
  })

  // Enter the owner's address
  router.get('/whats-the-owners-address', function (req, res) {
    res.render(viewsFolder + 'whats-the-owners-address')
  })

  router.post('/whats-the-owners-address', function (req, res) {
    res.redirect('select-owner-address')
  })

  // Enter the applicant's international address
  router.get('/enter-the-applicants-international-address', function (req, res) {
    res.render(viewsFolder + 'enter-the-applicants-international-address')
  })

  router.post('/enter-the-applicants-international-address', function (req, res) {
    res.redirect('confirm-applicants-international-address')
  })

  // Enter an international address
  router.get('/enter-an-international-address', function (req, res) {
    res.render(viewsFolder + 'enter-an-international-address')
  })

  router.post('/enter-an-international-address', function (req, res) {
    res.redirect('confirm-applicants-international-address')
  })

  // Confirm owner international address
  router.get('/confirm-applicants-international-address', function (req, res) {
    res.render(viewsFolder + 'confirm-applicants-international-address')
  })

  router.post('/confirm-applicants-international-address', function (req, res) {
    res.redirect('species-add-to-list-0')
  })

  // Permit preview
  router.get('/permit-preview', function (req, res) {
    res.render(viewsFolder + 'permit-preview')
  })

  router.post('/permit-preview', function (req, res) {
    res.redirect('do-you-know-what-to-pay')
  })

  // Permit 1
  router.get('/permit-1', function (req, res) {
    res.render(viewsFolder + 'permit-1')
  })

  router.post('/permit-1', function (req, res) {
    res.redirect('#')
  })

  // Permit 2
  router.get('/permit-2', function (req, res) {
    res.render(viewsFolder + 'permit-2')
  })

  router.post('/permit-2', function (req, res) {
    res.redirect('#')
  })


  // Select an address
    router.get('/select-an-address', function (req, res) {
      res.render(viewsFolder + 'select-an-address')
    })

    router.post('/select-an-address', function (req, res) {
      res.redirect('confirm-the-address-applicant')
    })

    // Select your address - agent
      router.get('/select-your-address-agent', function (req, res) {
        res.render(viewsFolder + 'select-your-address-agent')
      })

      router.post('/select-your-address-agent', function (req, res) {
        res.redirect('confirm-your-address-agent')
      })

      // Select your address - applicant
        router.get('/select-your-address-applicant', function (req, res) {
          res.render(viewsFolder + 'select-your-address-applicant')
        })

        router.post('/select-your-address-applicant', function (req, res) {
          res.redirect('confirm-your-address-applicant')
        })

  // Select your address - agent led
    router.get('/select-your-address-agent-led', function (req, res) {
      res.render(viewsFolder + 'select-your-address-agent-led')
    })

    router.post('/select-your-address-agent-led', function (req, res) {
      res.redirect('confirm-your-address-agent-led')
    })

// Select applicants address
  router.get('/select-applicants-address', function (req, res) {
    res.render(viewsFolder + 'select-applicants-address')
  })

  router.post('/select-applicants-address', function (req, res) {
    res.redirect('confirm-applicants-address')
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

  if (permitType === 'export') {
      res.redirect('add-any-other-information')
  }

  if (permitType === 're-export') {
      res.redirect('add-any-other-information')
  }

  if (permitType === 'A10') {
      res.redirect('was-the-specimen-imported-before-1-january-2021')
  }
  })

  // Tell us about the specimen's import permit
  router.get('/tell-us-about-the-specimens-import-permit', function (req, res) {
    res.render(viewsFolder + 'tell-us-about-the-specimens-import-permit')
  })

  router.post('/tell-us-about-the-specimens-import-permit', function (req, res) {
    res.redirect('add-any-other-information')
  })

  // You cannot use this service yet
  router.get('/you-cannot-use-this-service-yet', function (req, res) {
    res.render(viewsFolder + 'you-cannot-use-this-service-yet')
  })

  router.post('/you-cannot-use-this-service-yet', function (req, res) {
    res.redirect('start')
  })

  // Was the speciment imported before 1 january 2021?
  router.get('/was-the-specimen-imported-before-1-january-2021', function (req, res) {
    res.render(viewsFolder + 'was-the-specimen-imported-before-1-january-2021')
  })

  router.post('/was-the-specimen-imported-before-1-january-2021', function (req, res) {
    if (req.session.data['imported-before'] == 'yes') {
      res.redirect('tell-us-about-the-specimens-import-permit')
    } else {
    res.redirect('add-any-other-information')
  }
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
    res.redirect('add-any-other-information')
  }

  if (req.session.data['permitType'] == 're-export') {
    res.redirect('where-are-you-exporting-the-specimen-to')
  }

})

// What is the applicant's address
router.get('/what-is-the-applicants-address', function (req, res) {
  res.render(viewsFolder + 'what-is-the-applicants-address')
})

router.post('/what-is-the-applicants-address', function (req, res) {
  res.redirect('select-applicants-address')
})


// What is your address
router.get('/what-is-your-address', function (req, res) {
  res.render(viewsFolder + 'what-is-your-address')
})

router.post('/what-is-your-address', function (req, res) {
  res.redirect('select-an-address')
})

// What is your address - agent
router.get('/what-is-your-address-agent', function (req, res) {
  res.render(viewsFolder + 'what-is-your-address-agent')
})

router.post('/what-is-your-address-agent', function (req, res) {
  res.redirect('select-your-address-agent')
})

// What is your address - applicant
router.get('/what-is-your-address-applicant', function (req, res) {
  res.render(viewsFolder + 'what-is-your-address-applicant')
})

router.post('/what-is-your-address-applicant', function (req, res) {
  res.redirect('select-your-address-applicant')
})

// What is your address - agent led
router.get('/what-is-your-address-agent-led', function (req, res) {
  res.render(viewsFolder + 'what-is-your-address-agent-led')
})

router.post('/what-is-your-address-agent-led', function (req, res) {
  res.redirect('select-your-address-agent-led')
})

// What will you use your permit for?
router.get('/what-will-you-use-your-permit-for', function (req, res) {
  res.render(viewsFolder + 'what-will-you-use-your-permit-for')
})

router.post('/what-will-you-use-your-permit-for', function (req, res) {
  res.redirect('specimen-details')
// if (req.session.data['specimen'] == 'Coral') {
//   res.redirect('description-dynamic')
// } else {
// res.redirect('is-this-specimen-alive')
// }
})

// What type of permit or certificate are you applying for?
router.get('/what-type-of-permit-or-certificate-are-you-applying-for', function (req, res) {
  res.render(viewsFolder + 'what-type-of-permit-or-certificate-are-you-applying-for')
})

router.post('/what-type-of-permit-or-certificate-are-you-applying-for', function (req, res) {
  let permitType = req.session.data['permitType']
  if (permitType === 'import') {
    res.redirect('are-you-applying-on-behalf-of-someone-else')
  }
  if (permitType === 'export') {
    res.redirect('are-you-applying-on-behalf-of-someone-else')
  }
  if (permitType === 're-export') {
    res.redirect('are-you-applying-on-behalf-of-someone-else')
  }
  if (permitType === 'A10') {
    res.redirect('what-will-you-use-the-certificate-for')
  }
  if (permitType === 'other') {
    res.redirect('you-cannot-use-this-service-yet')
  }
})

// What will you use the certificate for
router.get('/what-will-you-use-the-certificate-for', function (req, res) {
  res.render(viewsFolder + 'what-will-you-use-the-certificate-for')
})

router.post('/what-will-you-use-the-certificate-for', function (req, res) {
  res.redirect('are-you-applying-on-behalf-of-someone-else')
})


// When was the specimen's hatch date
router.get('/when-was-the-specimens-hatch-date', function (req, res) {
  res.render(viewsFolder + 'when-was-the-specimens-hatch-date')
})

router.post('/when-was-the-specimens-hatch-date', function (req, res) {
  let permitType = req.session.data['permitType']

  if (permitType === 'import') {
  res.redirect('where-are-you-importing-the-specimen-from')
}
if (permitType === 'export') {
res.redirect('where-are-you-exporting-the-specimen-to')
}
if (permitType === 're-export') {
res.redirect('where-was-the-specimen-last-re-exported-from')
}
if (permitType === 'A10') {
res.redirect('#')
}

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
  res.redirect('what-will-you-use-your-permit-for')
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

// Do you want to use the same address?
  router.get('/do-you-want-to-use-the-same-address', function (req, res) {
    res.render(viewsFolder + 'do-you-want-to-use-the-same-address')
  })

router.post('/do-you-want-to-use-the-same-address', function (req, res) {
  let permitType = req.session.data['permitType']


  if (req.session.data['useSameAddress'] === 'yes') {
    if (permitType === 'import') {
          res.redirect('add-any-other-information')
        }
    else if (permitType === 'export') {
          res.redirect('add-any-other-information')
        }
    else if (permitType === 're-export') {
          res.redirect('where-is-the-specimens-country-of-origin')
    }
  }

  if (req.session.data['useSameAddress'] === 'no') {
    res.redirect('where-will-you-keep-your-specimen')
  }
})


// Where will you keep the specimen?
      router.get('/where-will-you-keep-your-specimen', function (req, res) {
        res.render(viewsFolder + 'where-will-you-keep-your-specimen')
      })

      router.post('/where-will-you-keep-your-specimen', function (req, res) {
        let permitType = req.session.data['permitType']


        if (permitType === 'import') {
              res.redirect('add-any-other-information')
            }

        if (permitType === 'export') {
              res.redirect('add-any-other-information')
            }

        if (permitType === 're-export') {
              res.redirect('where-is-the-specimens-country-of-origin')
            }
        })


// Who is importing the specimen?
router.get('/who-is-importing-the-specimen', function (req, res) {
  res.render(viewsFolder + 'who-is-importing-the-specimen')
})

router.post('/who-is-importing-the-specimen', function (req, res) {
  let permitType = req.session.data['permitType']
  let sendingToSomeoneElse = req.session.data['sendingToSomeoneElse']
  let isAlive = req.session.data['isAlive']

  if (permitType === 'export') {
      if (isAlive === 'alive') {
        res.redirect('where-will-you-keep-your-specimen')
      } else {
        res.redirect('add-any-other-information')
      }
    }

    if (permitType === 're-export') {
      if (sendingToSomeoneElse === 'yes') {
        if (isAlive === 'alive') {
          res.redirect('where-will-you-keep-your-specimen')
        }
      }
    }

    if (permitType === 're-export') {
      if (sendingToSomeoneElse === 'yes') {
        if (isAlive === 'dead') {
          res.redirect('where-is-the-specimens-country-of-origin')
        }
      }
    }

  })


// Confirm proxy international address
router.get('/confirm-proxy-international-address', function (req, res) {
  res.render(viewsFolder + 'confirm-proxy-international-address')
})

router.post('/confirm-proxy-international-address', function (req, res) {
  res.redirect('what-type-of-permit-or-certificate-are-you-applying-for')
})


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
