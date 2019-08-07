import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

/**
 * Stores information about active trips.
 */
@Entity("trip")
export class TripEntity {
  /**
   * Trip id. Simply used to identify trips.
   */
  @PrimaryGeneratedColumn("uuid")
  id?: string

  /**
   * Id of a user who is trip initiator and owner.
   */
  @Column({ nullable: false })
  userId?: string

  /**
   * Service used in this trip.
   */
  @Column()
  serviceId?: string

  /**
   * Current user position in the trip (latitude).
   */
  @Column()
  currentLat?: string

  /**
   * Current user position in the trip (longitude).
   */
  @Column()
  currentLng?: string

  /**
   * Trip destination position (latitude).
   */
  @Column({ nullable: true })
  destinationLat?: string

  /**
   * Trip destination position (longitude).
   */
  @Column({ nullable: true })
  destinationLng?: string

  /**
   * Time, when trip was started.
   */
  @Column()
  startTime?: number

  /**
   * Indicates if trip has been completed or not.
   */
  @Column({ default: false })
  completed?: boolean
}
