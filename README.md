# API for 3rd party providers

This repository provides api documentation and code examples how to create providers for Citopia app.


## API

If you want to create your own app for Citopia, 
you need to implement a web api with listed endpoints:

### `/services`

Lists all services provider provides.
It can be anything - car share, bike rent, parking, etc.

Endpoint must return `Service[]`.

```typescript
type Service = {
  /**
   * Unique service id for this provider.
   */
  id: string;

  /**
   * Service icon url.
   */
  icon: string;

  /**
   * Service name.
   */
  name: string;

  /**
   * Service description.
   */
  description: string;

  /**
   * Indicates if service will be paid or not.
   * Paid services user will be able to pay via Citopia app.
   */
  paid: boolean;

  /**
   * Services has different flows.
   * Each service type described in the document.
   */
  type: "type-a" | "type-b" | "type-c" | "type-d";

  /**
   * Vehicle type is used to understand what is used for the trip.
   * (for example, if current trip is walking or biking - we don't need to suggest a parking lot)
   */
  vehicleType: "none" | "bike" | "car" | "taxi";
};
```

Example:

```typescript
app.get("/services", function(req, res) {
  res.json([
    {
      id: "taxi",
      icon: `http://localhost:3000/assets/images/taxi.png`,
      name: "Taxi",
      description: "Cheapest taxi in Citopia!",
      paid: true,
      type: "type-c",
      vehicleType: "taxi",
    },
    {
      id: "scooter"
      icon: `http://localhost:3000/assets/images/scooter.png`,
      name: "Scooter",
      description: "Rent a scooter and rule the world!",
      paid: true,
      type: "type-b",
      vehicleType: "bike",
    }
  ]);
});
```

### `/bits`

Bit is a marker on the map. It can be anything - car, bike, shop, parking lot, etc.
It can also represent different states of the same item.

Endpoint must return `Bit[]`.

```typescript
type Bit = {
  /**
   * Unique bit id for this provider.
   */
  id: string;

  /**
   * Bit icon url.
   */
  icon: string;

  /**
   * Bit name.
   */
  name: string;

  /**
   * Bit description.
   */
  description: string;

  /**
   * Bit color on the map.
   */
  color: string;
};
```

Example:

```typescript
app.get("/bits", function(req, res) {
  res.json([
    {
      id: "taxi",
      icon: `http://localhost:3000/assets/images/taxi-bit.png`,
      name: "Car",
      color: "#fffb25",
      description: "Call taxi",
    },
    {
      id: "scooter",
      icon: `http://localhost:3000/assets/images/scooter-bit.png`,
      name: "Scooter",
      color: "#65ffdd",
      description: "Rent scooter",
    },
  ]);
});
```

### `/register`

Starts process of using particular service. 
For example, it can be a new trip or parking usage.

Endpoint accepts following query parameters:

| Query Param    | Description                                                                                  | Can be empty |
|----------------|----------------------------------------------------------------------------------------------|--------------|
| userId         | user id, trip initiator                                                                      | no           |
| serviceId      | service id to be registered for usage                                                        | no           |
| currentLat     | trip initiator current position (latitude)                                                   | no           |
| currentLng     | trip initiator current position (longitude)                                                  | no           |
| destinationLat | geo position (longitude) of selected location (empty if user didn't select any point)        | yes          |
| destinationLng | geo position (latitude) of selected location (empty if user didn't select any point)         | yes          |
| mapBitId       | selected bit on the map (used in some service types)                                         | yes          |
| activeTripId   | if user already has an active trip, its id will be sent to this endpoint                     | yes          |

Endpoint must return `StatusResponse` object.

```typescript
type StatusResponse = {
  /**
   * Executed operation result.
   */
  status: "success" | "invalid" | "error" | "not-found"
  
  /**
   * Optional status message to inform about error, 
   * useful for debugging purposes.
   */
  message?: string
};
```

Example:

```typescript
app.get("/register", function(req, res) {
  const userId = req.query.userId;
  const serviceId = req.query.serviceId;
  const currentLat = req.query.currentLat;
  const currentLng = req.query.currentLng;
  const destinationLat = req.query.destinationLat; // optional
  const destinationLng = req.query.destinationLng; // optional
  const mapBitId = req.query.mapBitId; // optional
  const activeTripId = req.query.activeTripId; // optional

  // here, we need to register service usage in our database
  
  res.json({
    status: "success"
  });
});
```

### `/complete`

Finishes trip or any other service usage. 
For example, when user stops riding a bike and presses "finish ride" button.

Endpoint accepts following query parameters:

| Query Param    | Description                            | Can be empty |
|----------------|----------------------------------------|--------------|
| userId         | user whose trip will be completed      | no           |
| serviceId      | service to be completed                | no           |
  
Endpoint must return `StatusResponse` object.

```typescript
type StatusResponse = {
  /**
   * Executed operation result.
   */
  status: "success" | "invalid" | "error" | "not-found"
  
  /**
   * Optional status message to inform about error, 
   * useful for debugging purposes.
   */
  message?: string
};
```

Example:

```typescript
app.get("/complete", function(req, res) {
  const userId = req.query.userId;
  const status = req.query.status;

  res.json({
    status: "success"
  });
});
```

### `/track`

Tracks user location during service usage.
For example, when user walks we need to track his geo position to count his scores.

Endpoint accepts following query parameters:

| Query Param    | Description                                                  | Can be empty |
|----------------|--------------------------------------------------------------|--------------|
| userId         | user whose trip will be completed                            | no           |
| currentLat     | geo position (latitude) where user is currently located      | no           |
| currentLng     | geo position (longitude) where user is currently located     | no           |
  
Endpoint must return `StatusResponse` object.

```typescript
type StatusResponse = {
  /**
   * Executed operation result.
   */
  status: "success" | "invalid" | "error" | "not-found"
  
  /**
   * Optional status message to inform about error, 
   * useful for debugging purposes.
   */
  message?: string
};
```

Example:

```typescript
app.get("/track", function(req, res) {
  const userId = req.query.userId;
  const currentLat = req.query.currentLat;
  const currentLng = req.query.currentLng;

  // here we can store information about user position change

  // then return back success result
  res.json({
    status: "success"
  });
});
```

### `/service-info`

Provides information about available and used services.
For example if Uber cars were selected, it shows all cars available near user location.

Endpoint accepts following query parameters:

| Query Param                | Description                                                                                  | Can be empty |
|----------------------------|----------------------------------------------------------------------------------------------|--------------|
| userId                     | user id, trip initiator                                                                      | no           |
| serviceId                  | service id to be registered for usage                                                        | no           |
| currentLat                 | trip initiator current position (latitude)                                                   | no           |
| currentLng                 | trip initiator current position (longitude)                                                  | no           |
| destinationLat             | geo position (longitude) of selected location (empty if user didn't select any point)        | yes          |
| destinationLng             | geo position (latitude) of selected location (empty if user didn't select any point)         | yes          |
| recordingServiceTypes      | if user already has an active trip, its id will be sent to this endpoint                     | yes          |
| recordingServiceTypes      | if user already has an active trip, its id will be sent to this endpoint                     | yes          |
| activeTripId               | if user already has an active trip, its id will be sent to this endpoint                     | yes          |

Endpoint must return `ServiceInfo` object.

```typescript
type ServiceInfo = {
  /**
   * Provider id.
   */
  providerId?: string
  
  /**
   * Service id.
   */
  serviceId?: string
  
  /**
   * Bits to be shown realtime on the map.
   * It can be place of parking slots, moving cars, etc.
   */
  mapBits?: MapBit[]
  
  /**
   * Bit currently in usage.
   */
  mapBitId?: string
  
  /**
   * Indicates if service is ready for payment.
   */
  readyForPay?: boolean
  
  /**
   * Indicates if tracking should be enabled.
   * If tracking is enabled, app will send location information to "/track" endpoint.
   */
  track?: boolean
  
  /**
   * Information message about current status of the service usage.
   */
  statusMessage?: string
  
  /**
   * How much money is going to charge this service usage (user representation).
   */
  cost?: string
  
  /**
   * How much money is going to charge this service usage (crypto coins).
   */
  tokens?: number
}

type MapBit = {
  /**
   * Unique MapBit id.
   */
  id: string

  /**
   * Bit to be used for this MapBit.
   * It can be id of any registered Bit.
   */
  bitId: string

  /**
   * Bit current geo position on the map (latitude).
   */
  lat: number

  /**
   * Bit current geo position on the map (longitude).
   */
  lng: number

  /**
   * Indicates if map bit should be placed on a current user point.
   */
  currentPosition: boolean

  /**
   * Indicates if map bit should be placed on a user destination point.
   */
  destinationPosition: boolean
}
```

Example:

```typescript
app.get("/service-info", async function(req, res) {
  
  const serviceId = req.query.serviceId;
  const userId = req.query.userId;
  const currentLat = req.query.currentLat;
  const currentLng = req.query.currentLng;
  const destinationLat = req.query.destinationLat;
  const destinationLng = req.query.destinationLng;

  // load exist trip for the current user from the database
  const trip = await loadTripFromDatabase({ userId, serviceId })

  // if there is no trip for the current user,
  // simply return all services we have
  if (!trip) {
    res.json([
      { serviceId: "owner-vehicle" },
      { serviceId: "owner-bike" },
      { serviceId: "owner-walk" },
    ])
    return
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

  res.json([
    {
      serviceId: trip.serviceId,
      mapBits,
      statusMessage,
      track: true,
      cost: "",
      tokens: 0,
    },
  ])
});
```

## Examples

There are 3 sample provider implementations that show you how you can implement your own providers easily:

* [CityRide](./cityride) - provides services to run your own vehicle or just walking
* [CityServices](./cityservices) - provides paid services during trips, like parking and paid bridge
* [RideRent](./riderent) - provides complex services like taxi and scooter rent