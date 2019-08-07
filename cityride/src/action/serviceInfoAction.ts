import { action } from "../framework"
import { getRepository } from "typeorm"
import { TripEntity } from "../entity/TripEntity"

/**
 * Provides information about services and currently active trips.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#service-info
 */
export const serviceInfoAction = action(async ({ query }) => {
  const userId = query("userId", true)

  // load exist trip for the current user from the database
  const trip = await getRepository(TripEntity).findOne({
    userId,
    completed: false,
  })

  // if there is no trip for the current user,
  // simply return all services we have
  if (!trip) {
    return [
      { serviceId: "owner-vehicle" },
      { serviceId: "owner-bike" },
      { serviceId: "owner-walk" },
    ]
  }

  // but if there is a trip, we return a service information about it

  // build list of map bits we show on the map
  const mapBits: any[] = []
  if (trip.serviceId === "owner-vehicle") {
    mapBits.push({
      id: "owner-vehicle-id",
      bitId: "owner-vehicle",
      currentPosition: true,
    })
  } else if (trip.serviceId === "owner-bike") {
    mapBits.push({
      id: "owner-bike-id",
      bitId: "owner-bike",
      currentPosition: true,
    })
  } else if (trip.serviceId === "owner-walk") {
    mapBits.push({
      id: "owner-walk-id",
      bitId: "owner-walk",
      currentPosition: true,
    })
  }

  // build a status message we should show during the trip
  let statusMessage = ""
  if (trip.serviceId === "owner-vehicle") {
    statusMessage = "Driving a vehicle..."
  } else if (trip.serviceId === "owner-bike") {
    statusMessage = "Driving a bike..."
  } else if (trip.serviceId === "owner-walk") {
    statusMessage = "Walking..."
  }

  return [
    {
      serviceId: trip.serviceId,
      mapBits,
      statusMessage,
      track: true,
      cost: "",
      tokens: 0,
    },
  ]
})
