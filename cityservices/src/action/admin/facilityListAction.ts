import { action } from "../../framework"
import { getRepository } from "typeorm"
import { FacilityEntity } from "../../entity/FacilityEntity"

/**
 * Returns all facilities.
 */
export const facilityListAction = action(async () => {
  return getRepository(FacilityEntity).find()
})
