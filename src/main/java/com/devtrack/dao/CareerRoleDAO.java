package com.devtrack.dao;

import com.devtrack.model.CareerRole;
import com.devtrack.util.DatabaseConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

/**
 * Data Access Object for CareerRole operations.
 */
public class CareerRoleDAO {

    public CareerRole getCareerRoleById(int roleId) {
        String sql = "SELECT role_id, role_name, description FROM career_roles WHERE role_id = ?";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, roleId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapResultSetToCareerRole(rs);
                }
            }
        } catch (SQLException e) {
            System.err.println("CareerRoleDAO.getCareerRoleById SQL Exception: " + e.getMessage());
        }
        return getFallbackRole();
    }

    public CareerRole getFirstCareerRole() {
        String sql = "SELECT role_id, role_name, description FROM career_roles ORDER BY role_id ASC LIMIT 1";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            if (rs.next()) {
                return mapResultSetToCareerRole(rs);
            }
        } catch (SQLException e) {
            System.err.println("CareerRoleDAO.getFirstCareerRole SQL Exception: " + e.getMessage());
        }
        return getFallbackRole();
    }

    public java.util.List<CareerRole> getAllCareerRoles() {
        java.util.List<CareerRole> list = new java.util.ArrayList<>();
        String sql = "SELECT role_id, role_name, description FROM career_roles ORDER BY role_id ASC";
        try (Connection conn = DatabaseConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapResultSetToCareerRole(rs));
            }
        } catch (SQLException e) {
            System.err.println("CareerRoleDAO.getAllCareerRoles SQL Exception: " + e.getMessage());
        }
        if (list.isEmpty()) {
            list.add(getFallbackRole());
        }
        return list;
    }

    private CareerRole mapResultSetToCareerRole(ResultSet rs) throws SQLException {
        return new CareerRole(
                rs.getInt("role_id"),
                rs.getString("role_name"),
                rs.getString("description")
        );
    }

    private CareerRole getFallbackRole() {
        return new CareerRole(1, "Backend Developer", "Designs and builds server-side logic, databases, and APIs.");
    }
}
