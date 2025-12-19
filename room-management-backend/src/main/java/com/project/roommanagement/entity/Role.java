//package com.project.roommanagement.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.util.Set;
//
//@Entity
//@Table(name = "roles")
//@Getter
//@Setter
//@Builder
//@NoArgsConstructor
//@AllArgsConstructor
//
//public class Role{
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(unique = true, nullable = false,name = "role_code")
//    private String code; // ADMIN, MANAGER, USER,...
//
//    @Column(nullable = false,name = "role_name")
//    private String name;
//
//    @Column(nullable = false,name = "description")
//    private String description;
//
//
//    @ManyToMany(fetch = FetchType.LAZY)
//    @JoinTable(
//            name = "role_permissions",
//            joinColumns = @JoinColumn(name = "role_id"),
//            inverseJoinColumns = @JoinColumn(name = "permission_id")
//    )
//    private Set<Permission> permissions;
//}
