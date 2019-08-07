import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

/**
 * Stores information about facility service usages.
 */
@Entity("usage")
export class UsageEntity {
  /**
   * Usage id. Simply used to identify service usages.
   */
  @PrimaryGeneratedColumn("uuid")
  id?: string

  /**
   * Id of a user who is service usage initiator and owner.
   */
  @Column()
  userId?: string

  /**
   * Service used in this usage.
   */
  @Column()
  serviceId?: string

  /**
   * Used facility.
   */
  @Column()
  facilityId?: string

  /**
   * Id of the trip used during service usage.
   */
  @Column({ nullable: true })
  tripId?: string

  /**
   * Current user position during service usage (latitude).
   */
  @Column()
  currentLat?: string

  /**
   * Current user position during service usage (longitude).
   */
  @Column()
  currentLng?: string

  /**
   * Time, when service usage was started.
   */
  @Column()
  startTime?: number

  /**
   * Indicates if usage has been completed or not.
   */
  @Column({ default: false })
  completed?: boolean
}
