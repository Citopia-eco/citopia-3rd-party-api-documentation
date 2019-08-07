import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

/**
 * Physically located facility (parking or a bridge).
 */
@Entity("facility")
export class FacilityEntity {
  /**
   * Facility id. Simply used to identify facilities.
   */
  @PrimaryGeneratedColumn("uuid")
  id?: string

  /**
   * Facility type.
   */
  @Column({ type: String })
  type?: "parking" | "bridge"

  /**
   * Facility name.
   */
  @Column()
  name?: string

  /**
   * Facility position on the map (latitude).
   */
  @Column()
  lat?: number

  /**
   * Facility position on the map (longitude).
   */
  @Column()
  lng?: number

  /**
   * Facility usage price.
   */
  @Column()
  price?: number
}
