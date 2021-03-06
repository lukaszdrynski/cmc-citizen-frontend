import { MomentFormatter } from 'utils/momentFormatter'
import { NumberFormatter } from 'utils/numberFormatter'
import { InterestMapper } from 'app/pdf/mappers/interestMapper'
import { Claim } from 'claims/models/claim'

export class ClaimMapper {

  static createClaimDetails (claim: Claim): object {
    const data = {
      submittedDate: MomentFormatter.formatLongDateAndTime(claim.createdAt),
      claimNumber: claim.claimNumber,
      amount: NumberFormatter.formatMoney(claim.claimData.amount.totalAmount()),
      issueFee: NumberFormatter.formatMoney(claim.claimData.paidFeeAmount),
      totalAmountTillDateOfIssue: NumberFormatter.formatMoney(claim.totalAmountTillDateOfIssue),
      reason: claim.claimData.reason
    }

    if (claim.claimData.interest) {
      data['interest'] = InterestMapper.createInterestData(claim)
    }

    if (claim.claimData.statementOfTruth) {
      data['statementOfTruth'] = {
        signerName: claim.claimData.statementOfTruth.signerName,
        signerRole: claim.claimData.statementOfTruth.signerRole
      }
    }

    return data
  }
}
