import { action } from "../framework"

/**
 * Provides list of available services.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#services
 */
export const servicesAction = action(() => {
  const serverUrl = process.env.SERVER_URL || `http://localhost`
  const serverPort = process.env.PORT || 5000
  return [
    {
      id: "owner-vehicle",
      icon: `${serverUrl}:${serverPort}/assets/images/vehicle.png`,
      name: "Car",
      description: "Drive your own vehicle",
      paid: false,
      type: "type-c",
      vehicleType: "car",
    },
    {
      id: "owner-bike",
      icon: `${serverUrl}:${serverPort}/assets/images/bike.png`,
      name: "Bike",
      description: "Drive your own bike",
      paid: false,
      type: "type-b",
      vehicleType: "bike",
    },
    {
      id: "owner-walk",
      icon: `${serverUrl}:${serverPort}/assets/images/walk.png`,
      name: "Walk",
      description: "Walk on your own!",
      paid: false,
      type: "type-a",
      vehicleType: "none",
    },
  ]
})
