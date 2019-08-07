import { action } from "../framework"
import { getRepository } from "typeorm"
import { UsageEntity } from "../entity/UsageEntity"

/**
 * Finishes current trip.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#complete
 */
export const completeAction = action(async ({ query }) => {
  const userId = query("userId", true)
  const serviceId = query("serviceId", true)

  // load service usage for current user that we need to complete
  const usage = await getRepository(UsageEntity).findOneOrFail({
    userId,
    serviceId,
    completed: false,
  })

  // mark as completed and save the trip
  usage.completed = true
  await getRepository(UsageEntity).save(usage)

  return {
    status: "success",
  }
})
