package com.project.roommanagement.constants;

import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;

@Getter
public enum ErrorCode {

    /* =======================
     * COMMON / SYSTEM (1000)
     * ======================= */
    UNCATEGORIZED_EXCEPTION(1000, "Uncategorized error", HttpStatus.INTERNAL_SERVER_ERROR),
    INVALID_KEY(1001, "Invalid request key", HttpStatus.BAD_REQUEST),

    /* =======================
     * AUTH / SECURITY (1100)
     * ======================= */
    UNAUTHENTICATED(1100, "Unauthenticated", HttpStatus.UNAUTHORIZED),
    UNAUTHORIZED(1101, "You do not have permission", HttpStatus.FORBIDDEN),

    TOKEN_INVALID(1102, "Token is invalid", HttpStatus.UNAUTHORIZED),
    TOKEN_EXPIRED(1103, "Token has expired", HttpStatus.UNAUTHORIZED),
    TOKEN_REUSED(1104, "Refresh token has already been used", HttpStatus.UNAUTHORIZED),
    TOKEN_REVOKED(1105, "Token has been revoked", HttpStatus.UNAUTHORIZED),

    USER_LOCKED(1106, "User account is locked", HttpStatus.FORBIDDEN),

    /* =======================
     * USER / ROLE (2000)
     * ======================= */
    USER_EXISTED(2000, "User already exists", HttpStatus.BAD_REQUEST),
    USER_NOT_FOUND(2001, "User not found", HttpStatus.NOT_FOUND),
    USERNAME_INVALID(2002, "Username must be at least {min} characters", HttpStatus.BAD_REQUEST),
    INVALID_PASSWORD(2003, "Password must be at least {min} characters", HttpStatus.BAD_REQUEST),

    ROLE_NOT_FOUND(2004, "Role not found", HttpStatus.NOT_FOUND),

    /* =======================
     * BUILDING / ROOM (3000)
     * ======================= */
    BUILDING_NOT_FOUND(3000, "Building not found", HttpStatus.NOT_FOUND),
    ROOM_NOT_FOUND(3001, "Room not found", HttpStatus.NOT_FOUND),
    AMENITY_NOT_FOUND(3002, "Amenity not found", HttpStatus.NOT_FOUND),

    /* =======================
     * CONTRACT / INVOICE (4000)
     * ======================= */
    CONTRACT_NOT_FOUND(4000, "Contract not found", HttpStatus.NOT_FOUND),
    TENANT_NOT_FOUND(4001, "Tenant not found", HttpStatus.NOT_FOUND),
    INVOICE_NOT_FOUND(4002, "Invoice not found", HttpStatus.NOT_FOUND),
    SERVICE_NOT_FOUND(4003, "Service not found", HttpStatus.NOT_FOUND);

    /* ======================= */

    private final int code;
    private final String message;
    private final HttpStatusCode statusCode;

    ErrorCode(int code, String message, HttpStatusCode statusCode) {
        this.code = code;
        this.message = message;
        this.statusCode = statusCode;
    }
}
