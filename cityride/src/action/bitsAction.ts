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
  const serverPort = process.env.PORT || 5000
  return [
    {
      id: "owner-vehicle",
      icon: `${serverUrl}:${serverPort}/assets/images/vehicle-bit.png`,
      name: "Your car",
      color: "#fffb25",
      description: "Your car",
    },
    {
      id: "owner-bike",
      icon: `${serverUrl}:${serverPort}/assets/images/bike-bit.png`,
      name: "Your bike",
      color: "#ff012e",
      description: "Your bike",
    },
    {
      id: "owner-walk",
      icon: `${serverUrl}:${serverPort}/assets/images/walk-bit.png`,
      name: "You",
      color: "#3e9360",
      description: "You",
    },
  ]
})
