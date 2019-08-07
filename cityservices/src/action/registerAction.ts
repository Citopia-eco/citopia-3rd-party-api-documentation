import { action } from "../framework"
import { getRepository } from "typeorm"
import { UsageEntity } from "../entity/UsageEntity"

/**
 * Registers a new service usage.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#register
 */
export const registerAction = action(async ({ query }) => {
  const serviceId = query("serviceId", true)
  const userId = query("userId", true)
  const currentLat = query("currentLat", true)
  const currentLng = query("currentLng", true)
  const mapBitId = query("mapBitId", true)
  const activeTripId = query("activeTripId", true)

  // save a new service usage
  await getRepository(UsageEntity).save({
    userId,
    serviceId,
    facilityId: mapBitId,
    tripId: activeTripId,
    currentLat,
    currentLng,
    completed: false,
    startTime: Math.floor(new Date().getTime() / 1000),
  })

  return {
    status: "success",
  }
})
