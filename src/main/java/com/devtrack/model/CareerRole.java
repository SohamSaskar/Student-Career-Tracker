package com.devtrack.model;

/**
 * Model representing a Career Role entity from MySQL 'career_roles' table.
 */
public class CareerRole {
    private int roleId;
    private String roleName;
    private String description;

    public CareerRole() {}

    public CareerRole(int roleId, String roleName, String description) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.description = description;
    }

    public int getRoleId() { return roleId; }
    public void setRoleId(int roleId) { this.roleId = roleId; }

    public String getRoleName() { return roleName; }
    public void setRoleName(String roleName) { this.roleName = roleName; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
