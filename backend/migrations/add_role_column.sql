-- Migration script to add role column to users table
-- Run this script on your production database to enable role-based user management

ALTER TABLE users ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'user';

-- Update existing admin user (assuming admin user has id=1)
UPDATE users SET role = 'admin' WHERE id = 1;

-- Add check constraint to ensure role is either 'user' or 'admin'
ALTER TABLE users ADD CONSTRAINT check_role CHECK (role IN ('user', 'admin'));
