//package com.project.roommanagement.entity;
//import jakarta.persistence.*;
//import lombok.*;
//
//@Entity
//@Table(name = "permissions")
//@Getter
//@Setter
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//public class Permission {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(unique = true, nullable = false,name = "permission_code")
//    private String code; // room:view, room:create , user:delete
//
//    @Column(nullable = false,name = "permission_name")
//    private String name;
//
//    @Column(nullable = false,name = "description")
//    private String description;
//}
