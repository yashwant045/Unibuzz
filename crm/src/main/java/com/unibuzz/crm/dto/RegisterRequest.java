package com.unibuzz.crm.dto;

import lombok.Data;

import java.util.List;

@Data
public class RegisterRequest {

    private String fullName;
    private String email;
    private String password;

    private String role;

    // student fields
    private String enrollmentNumber;
    private String phoneNumber;
    private String department;
    private String section;
    private String year;

    // faculty fields
    private String designation;
    private String expertise;
    private String officeLocation;

    private List<String> interests;
}