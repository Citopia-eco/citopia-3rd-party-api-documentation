import { action } from "../framework"

/**
 * Returns all bits that app shows on the map.
 *
 * Bit is a marker on the map.
 * It can be anything - car, bike, shop, parking lot, etc.
 * It can also represent different states of the same item.
 *
 * @see https://github.com/mobi-dlt/citopia-3rd-party-api-documentation#bits
 */
export const bitsAction = action(() => {
  const serverUrl = process.env.SERVER_URL || `http://localhost`
  const serverPort = process.env.PORT || 5001
  return [
    {
      id: "parking",
      icon: `${serverUrl}:${serverPort}/assets/images/parking-bit.png`,
      name: "Parking",
      color: "#50adff",
      description: "Park your car here",
    },
    {
      id: "bridge",
      icon: `${serverUrl}:${serverPort}/assets/images/bridge-bit.png`,
      name: "Bridge",
      color: "#a56700",
      description: "Pay for bridge",
    },
  ]
})
