import * as config from 'config'
import * as express from 'express'
import { PostcodeInfoClient } from '@hmcts/postcodeinfo-client'

import { Paths as AppPaths } from 'app/paths'
import { request } from 'client/request'
import * as Logging from '@hmcts/nodejs-logging'

const postcodeClient = new PostcodeInfoClient(config.get<string>('postcodeLookup.apiKey'), request)
const logger = Logging.getLogger('postcode-lookup')

/* tslint:disable:no-default-export */
export default express.Router()
  .get(AppPaths.postcodeLookupProxy.uri, function (req, res) {
    postcodeClient.lookupPostcode(req.query.postcode)
      .then((postcodeInfoResponse) => {
        console.log(postcodeInfoResponse)
        res.json(postcodeInfoResponse)
      }).catch((err: Error) => {
      logger.error(err.stack)
      res.status(500).json(err.message)
    })
  })
