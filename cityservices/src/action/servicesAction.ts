import { action } from "../framework"

/**
 * Provides list of available services.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#services
 */
export const servicesAction = action(() => {
  const serverUrl = process.env.SERVER_URL || `http://localhost`
  const serverPort = process.env.PORT || 5001
  return [
    {
      id: "parking",
      icon: `${serverUrl}:${serverPort}/assets/images/parking.png`,
      name: "Parking",
      description: "Park your car!",
      paid: true,
      type: "type-d",
      vehicleType: "none",
    },
    {
      id: "bridge",
      icon: `${serverUrl}:${serverPort}/assets/images/bridge.png`,
      name: "Bridge",
      description: "Pay for bridge",
      paid: true,
      type: "type-d",
      vehicleType: "none",
    },
  ]
})
