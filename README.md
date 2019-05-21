# API for 3rd party providers

### `/services`

Lists all services provider provides. 
It can be anything - car share, bike rent, parking, etc.

Endpoint must return `Service[]`.

```typescript
type Service = {

  /**
   * Unique service id for this provider.
   */
  id: string

  /**
   * Service icon url.
   */
  icon: string

  /**
   * Service name.
   */
  name: string

  /**
   * Service description.
   */
  description: string

  /**
   * Indicates if service will be paid or not.
   * Paid services user will be able to pay via Citopia app.
   */
  paid: boolean

  /**
   * Services has different flows.
   * Each service type described in the document.
   */
  type: "type-a" | "type-b" | "type-c" | "type-d"

  /**
   * Vehicle type is used to understand what is used for the trip.
   * (for example, if current trip is walking or biking - we don't need to suggest a parking lot)
   */
  vehicleType: "none" | "bike" | "car"
}
```

Example:

```typescript
app.get("/services", function(req, res) {
  res.json([
    {
      id: "bike",
      icon: "https://cdn1.iconfinder.com/data/icons/streamline-transportation/60/cell-0-2-240.png",
      name: "Bike Rent",
      description: "Pick bike and ride for free!",
      paid: false,
      type: "type-b",
      vehicleType: "bike"
    },
    {
      id: "scooter",
      icon: "https://cdn1.iconfinder.com/data/icons/transport-3-11/32/Kick_Scooter-256.png",
      name: "Scooter Rent",
      description: "Pick electricity-based scooter for greener world!",
      paid: true,
      type: "type-c",
      vehicleType: "bike"
    }
  ]);
});
```
  
### `/bits`
  
Bit is a point on the map. It can be anything - car, bike, shop, parking lot, etc.
It can also represent different states of the same item.

Endpoint must return `Bit[]`.

```typescript
type Bit = {

  /**
   * Unique bit id for this provider.
   */
  id: string

  /**
   * Bit icon url.
   */
  icon: string

  /**
   * Bit name.
   */
  name: string

  /**
   * Bit description.
   */
  description: string

  /**
   * Bit color on the map.
   */
  color: string
}
```

Example:

```typescript
app.get("/bits", function(req, res) {
  res.json([
    {
      id: "bike-station",
      icon: "https://cdn1.iconfinder.com/data/icons/streamline-transportation/60/cell-0-2-240.png",
      name: "Bike Rent Station #1",
      description: "Bike Rent Station Downtown",
      color: "#ff8300",
    },
    {
      id: "scooter-station",
      icon: "https://cdn1.iconfinder.com/data/icons/transport-3-11/32/Kick_Scooter-256.png",
      name: "Scooter Rent Station #1",
      description: "Scooter Rent Station Downtown",
      color: "#00a7ff",
    }
  ]);
});
```
  
### `/services-availability`

Checks what services are available at the given moment for the given geo points.

Endpoint accepts following query parameters:

* `currentLatitude` - geo position (latitude) where user is currently located
* `currentLongitude` - geo position (longitude) where user is currently located
* `destinationLatitude` - geo position (longitude) of selected location (can be empty if user didn't select any point)
* `destinationLongitude` - geo position (latitude) of selected location (can be empty if user didn't select any point)

Endpoint must return `string[]`, where each item in the string array is service id.

Example:

```typescript
app.get("/services-availability", function(req, res) {
  const currentLatitude = req.query.currentLatitude;
  const currentLongitude = req.query.currentLongitude;
  const destinationLatitude = req.query.destinationLatitude;
  const destinationLongitude = req.query.destinationLongitude;

  // now we need to return all our service identifiers available for the given geo points
  res.json([
    "bike",
    "scooter",
  ]);
});
```
  
### `/service-info`

Provides information about selected service.
For example if Uber cars were selected, it shows all cars available near user location.

Endpoint accepts following query parameters:

* `serviceId` - requested service id
* `currentLatitude` - geo position (latitude) where user is currently located
* `currentLongitude` - geo position (longitude) where user is currently located
* `destinationLatitude` - geo position (longitude) of selected location (can be empty if user didn't select any point)
* `destinationLongitude` - geo position (latitude) of selected location (can be empty if user didn't select any point)

Endpoint must return `ServiceInfo` object.

```typescript
type ServiceInfo = {
  
  /**
   * Bits to be shown realtime on the map.
   */
  mapBits: {
    
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
    latitude: number
    
    /**
     * Bit current geo position on the map (longitude).
     */
    longitude: number
    
  }[]
}
```

Example:

```typescript
app.get("/service-info", function(req, res) {

  const serviceId = req.query.serviceId;
  const currentLatitude = req.query.currentLatitude;
  const currentLongitude = req.query.currentLongitude;
  const destinationLatitude = req.query.destinationLatitude;
  const destinationLongitude = req.query.destinationLongitude;

  // now we need to return all map bits available for the given service and their geo points

  res.json({
    mapBits: [
      { id: "bike on bulevardi 22", bitId: "bike", latitude: 0, longitude: 0 },
      { id: "scooter on bulevardi 22", bitId: "scooter", latitude: 0, longitude: 0 },
    ]
  });

});
```

### `/trip-register`

Registers a new trip. For example, when user pickups bike and presses "start ride" button.

Endpoint accepts following query parameters:

* `userId` - user id, trip initiator
* `serviceId` - requested service id
* `mapBitId` - selected map bit id. Optional, for some service types it can't be empty

Endpoint must return `TripRegisterInfo` object.

```typescript
type TripRegisterInfo = {

  /**
   * Newly registered trip id.
   */
  tripId: string

}
```

Example:

```typescript
app.get("/trip-register", function(req, res) {

  const userId = req.query.userId;
  const serviceId = req.query.serviceId;
  const mapBitId = req.query.mapBitId; // optional

  // if mapBitId isn't present, its our responsibility to create it for user and register it for the current trip
  // for example Uber provider selects car on his own and store this information in their db

  // here, we need to register trip in our database

  // then return back trip id
  res.json({
    id: "trip #1"
  });

});
```

### `/trip-complete`

Finishes trip. For example, when user stops riding bike and presses "finish ride" button.

Endpoint accepts following query parameters:

* `tripId` - trip id to be finished
* `status` - can be either "finished" or "canceled"

Endpoint must return `StatusResponse` object.

```typescript
type StatusResponse = {

  /**
   * Executed operation result. 
   */
  status: "success"

}
```

Example:

```typescript
app.get("/trip-complete", function(req, res) {

  const tripId = req.query.tripId;
  const status = req.query.status;

  // status can be either: "finished" either "canceled"

  // here we can cancel our trip

  // then return back success result
  res.json({
    status: "success"
  });

});
```

### `/trip-track`

Tracks current trip progress. 
For example, when user walks we need to track his position to count his scores.

Endpoint accepts following query parameters:

* `tripId` - trip id
* `currentLatitude` - geo position (latitude) where user is currently located
* `currentLongitude` - geo position (longitude) where user is currently located

Endpoint must return `StatusResponse` object.

```typescript
type StatusResponse = {

  /**
   * Executed operation result. 
   */
  status: "success"

}
```

Example:

```typescript
app.get("/trip-track", function(req, res) {

  const tripId = req.query.tripId;
  const currentLatitude = req.query.currentLatitude;
  const currentLongitude = req.query.currentLongitude;

  // here we can store information about user position change

  // then return back success result
  res.json({
    status: "success"
  });
});
```

### `/trip-info`

Provides information about active trip.

Endpoint accepts following query parameters:

* `tripId` - trip id

Endpoint must return `TripInfo` object.

```typescript
type TripInfo = {

  /**
   * Trip id.
   */
  id: string

  /**
  * Trip status.
  */
  status: "waiting" | "in-progress" | "finished" | "canceled"

  /**
  * Information message about current status of the trip.
  */
  statusMessage: string

  /**
  * How much money is going to charge this trip.
  */
  cost: string

  /**
  * Distance was made on this trip.
  */
  distance: string

  /**
  * How long this trip lasts.
  */
  duration: string

  /**
   * Bits to be shown realtime on the map.
   */
  mapBits: {
    
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
    latitude: number
    
    /**
     * Bit current geo position on the map (longitude).
     */
    longitude: number
    
  }[]

}
```

Example:

```typescript
app.get("/trip-info", function(req, res) {

  const tripId = req.query.tripId;

  // here we send information about our trip being in progress
  // we also return back current bike position

  // statusMessage can be used to specify exact state of the map bit, for example
  // "vehicle arrives" or "trip is in progress" or "arrived to destination"
  res.json({
    id: "trip #1",
    status: "in-progress", // also can be: "finished", "canceled", "waiting"
    statusMessage: "Trip is in progress...",
    cost: "75",
    distance: "15 miles",
    duration: 100000,
    mapBits: [
      { id: "bike on bulevardi 22", bitId: "bike", latitude: 10, longitude: 10 },
    ]
  });
});
```

### `/trip-service-suggestions`

Suggests user additional services during his trip.
For example app can suggest parking lot or pay a bridge checkpoint.

Endpoint accepts following query parameters:

* `tripServiceType` - current trip's service type
* `tripServiceVehicleType` - current trip's vehicle type
* `currentLatitude` - geo position (latitude) where user is currently located
* `currentLongitude` - geo position (longitude) where user is currently located
* `destinationLatitude` - geo position (longitude) of selected location (can be empty if user didn't select any point)
* `destinationLongitude` - geo position (latitude) of selected location (can be empty if user didn't select any point)

Endpoint must return `TripServiceSuggestion` object.

```typescript
type TripServiceSuggestion = {

  /**
   * Suggested service id.
   */
  serviceId: string
  
  /**
   * Bits to be shown realtime on the map.
   */
  mapBits: {
    
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
    latitude: number
    
    /**
     * Bit current geo position on the map (longitude).
     */
    longitude: number
    
  }[]

}
```

Example:

```typescript
app.get("/trip-service-suggestions", function(req, res) {

  const tripServiceType = req.query.tripServiceType;
  const tripServiceVehicleType = req.query.tripServiceVehicleType;

  const currentLatitude = req.query.currentLatitude;
  const currentLongitude = req.query.currentLongitude;

  const destinationLatitude = req.query.destinationLatitude;
  const destinationLongitude = req.query.destinationLongitude;

  res.json({
    serviceId: "parking service",
    mapBits: [
      { id: "parking on bulevardi 22", bitId: "parking", latitude: 10, longitude: 10 },
    ]
  });
});
```
