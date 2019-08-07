import { action } from "../framework"
import { getRepository } from "typeorm"
import { FacilityEntity } from "../entity/FacilityEntity"
import { UsageEntity } from "../entity/UsageEntity"
import { isCurrentPointAroundGivenPoint } from "../utils"

/**
 * Provides information about services and currently active trips.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#service-info
 */
export const serviceInfoAction = action(async ({ query }) => {
  const userId = query("userId", true)
  const currentLat = query("currentLat")
  const currentLng = query("currentLng")
  const destinationLat = query("destinationLat")
  const destinationLng = query("destinationLng")
  const recordingServiceTypes = query("recordingServiceTypes", true).split(",")
  const recordingVehicleTypes = query("recordingVehicleTypes", true).split(",")
  const activeTripId = query("activeTripId") as string

  // if user doesn't have an active trip, we don't need to return any services
  if (!activeTripId) {
    return []
  }

  // we suggest services only if there are "trips" in the recording services
  if (
    recordingServiceTypes.indexOf("type-a") === -1 &&
    recordingServiceTypes.indexOf("type-b") === -1 &&
    recordingServiceTypes.indexOf("type-c") === -1
  ) {
    return []
  }

  // we dont return any service if user don't use car service currently
  if (recordingVehicleTypes.indexOf("car") === -1) {
    return []
  }

  // load available facilities
  const facilities = await getRepository(FacilityEntity).find()

  // if we already completed provided service for this trip, we don't show services again
  const useServiceRecords = await getRepository(UsageEntity).find({
    userId,
    tripId: activeTripId,
    completed: true,
  })
  if (useServiceRecords.length) {
    return []
  }

  const serviceInfos: any[] = []
  for (let facility of facilities) {
    // check if there is facility usage in a current trip
    const usage = await getRepository(UsageEntity).findOne({
      userId: userId,
      facilityId: facility.id,
      completed: false,
    })

    // if there is no usage, we check if facility around us to show it
    if (!usage) {
      // if there is no record, we need to make sure our parking is in the range of user vehicle
      const isAround = isCurrentPointAroundGivenPoint({
        currentLat,
        currentLng,
        lat: facility.lat!,
        lng: facility.lng!,
        radius: 1000,
        units: "meters",
      })

      // if we aren't around, skip
      if (isAround === false) continue
    }

    // if there is facility usage in a current trip we build additional information
    let cost: string = "",
      tokens: number = 0,
      statusMessage: string = ""
    if (usage) {
      const facility = facilities.find(facility => {
        return facility.id === usage.facilityId
      })!

      if (facility.type === "parking") {
        statusMessage = "Using parking..."
      } else if (facility.type === "bridge") {
        statusMessage = "Using bridge..."
      }

      cost = "$" + facility.price
      tokens = facility.price!
    }

    // determine bit id
    let bitId: string = ""
    if (facility.type === "parking") {
      bitId = "parking"
    } else if (facility.type === "bridge") {
      bitId = "bridge"
    }

    // create a map bit (facility to be shown on the map)
    const mapBit = {
      id: facility.id!,
      bitId: bitId,
      lat: facility.lat!,
      lng: facility.lng!,
    }

    serviceInfos.push({
      serviceId: facility.type,
      mapBits: [mapBit],
      cost,
      tokens,
      statusMessage,
    })
  }
  return serviceInfos
})
