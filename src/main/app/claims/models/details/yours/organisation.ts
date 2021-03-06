import { Party } from './party'
import { PartyType } from 'app/common/partyType'
import { Address } from 'claims/models/address'

export class Organisation extends Party {
  contactPerson?: string

  constructor (
              name?: string,
              address?: Address,
              correspondenceAddress?: Address,
              mobilePhone?: string,
              email?: string,
              contactPerson?: string) {
    super(PartyType.ORGANISATION.value, name, address, correspondenceAddress, mobilePhone, email)
    this.contactPerson = contactPerson
  }

  deserialize (input: any): Organisation {
    if (input) {
      Object.assign(this, new Party().deserialize(input))
      this.contactPerson = input.contactPerson
      this.type = PartyType.ORGANISATION.value
    }
    return this
  }
}
