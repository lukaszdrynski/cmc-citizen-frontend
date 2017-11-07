import * as express from 'express'
import { FormValidator } from 'forms/validation/formValidator'
import { Paths } from 'offer/paths'
import { Paths as DashboardPaths } from 'dashboard/paths'
import { Form } from 'forms/form'
import { DefendantResponse } from 'offer/form/models/defendantResponse'
import { Offer } from 'offer/form/models/offer'
import { ErrorHandling } from 'common/errorHandling'
import User from 'idam/user'
import { OfferGuard } from 'offer/guards/offerGuard'
import { StatementType } from 'offer/form/models/statementType'

function renderView (
  form: Form<DefendantResponse>, res: express.Response, next: express.NextFunction) {
  const offer: Offer = res.locals.user.claim.defendantOffer
  if (!offer) {
    const user: User = res.locals.user
    res.redirect(DashboardPaths.claimantPage.evaluateUri({ externalId: user.claim.externalId }))
  } else {
    res.render(Paths.responsePage.associatedView, {
      form: form,
      claim : res.locals.user.claim,
      offer: offer
    })
  }
}

export default express.Router()
  .get(
    Paths.responsePage.uri,
    OfferGuard.requestHandler,
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      renderView(Form.empty(), res, next)
    }))
  .post(
    Paths.responsePage.uri,
    OfferGuard.requestHandler,
    FormValidator.requestHandler(DefendantResponse, DefendantResponse.fromObject),
    ErrorHandling.apply(async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
      const form: Form<DefendantResponse> = req.body
      if (form.hasErrors()) {
        renderView(form, res, next)
      } else {
        const user: User = res.locals.user
        switch (form.model.option) {
          case StatementType.ACCEPTATION:
            res.redirect(Paths.makeAgreementPage.evaluateUri({ externalId: user.claim.externalId }))
            break
          case StatementType.REJECTION:
            res.redirect(Paths.rejectedPage.evaluateUri({ externalId: user.claim.externalId }))
            break

          default:
            res.redirect(Paths.responsePage.evaluateUri({ externalId: user.claim.externalId }))
        }
      }
    }))