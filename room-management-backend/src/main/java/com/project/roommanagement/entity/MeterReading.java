package com.project.roommanagement.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "electric_water_meters")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MeterReading  extends BaseEntity{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(
            name = "room_id",
            referencedColumnName = "id")
    private Room room;

    @Column(name = "month")
    private Integer month;

    @Column(name = "year")
    private Integer year;

    @Column(name = "old_electric")
    private Integer oldElectric;

    @Column(name = "new_electric")
    private Integer newElectric;

    @Column(name = "old_water")
    private Integer oldWater;

    @Column(name = "new_water")
    private Integer newWater;

    @Column(name = "note")
    private String note;

    public int getElectricUsed() {
        return newElectric - oldElectric;
    }

    public int getWaterUsed() {
        return newWater - oldWater;
    }
}

