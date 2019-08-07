import { action } from "../framework"
import { getRepository } from "typeorm"
import { TripEntity } from "../entity/TripEntity"

/**
 * Finishes current trip.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#complete
 */
export const completeAction = action(async ({ query }) => {
  const userId = query("userId", true)
  const serviceId = query("serviceId", true)

  // load trip for current user that we need to complete
  const trip = await getRepository(TripEntity).findOneOrFail({
    userId,
    serviceId,
    completed: false,
  })

  // mark as completed and save the trip
  trip.completed = true
  await getRepository(TripEntity).save(trip)

  return {
    status: "success",
  }
})
