import { action } from "../../framework"
import { getRepository } from "typeorm"
import { FacilityEntity } from "../../entity/FacilityEntity"

/**
 * Used to save a new or exist facility.
 */
export const facilitySaveAction = action(async ({ body }) => {
  await getRepository(FacilityEntity).save(body as {
    id: string
    name: string
    lat: number
    lng: number
    price: number
  })

  return {
    status: "success",
  }
})
