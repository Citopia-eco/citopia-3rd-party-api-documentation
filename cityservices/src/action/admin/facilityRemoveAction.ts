import { action } from "../../framework"
import { getRepository } from "typeorm"
import { FacilityEntity } from "../../entity/FacilityEntity"

/**
 * Used to remove a facility.
 */
export const facilityRemoveAction = action(async ({ params }) => {
  const id = params("id", true)

  // find and remove a facility
  const facility = await getRepository(FacilityEntity).findOneOrFail(id)
  await getRepository(FacilityEntity).remove(facility)

  return {
    status: "success",
  }
})
