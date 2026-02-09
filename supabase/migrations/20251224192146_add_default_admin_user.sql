/*
  # Create Default Admin User

  1. Changes
    - Inserts a default admin user for initial access
    - Email: admin@locallink.com
    - Password: admin123 (should be changed after first login)
    - Full name: Local Link Admin

  2. Notes
    - This is a free admin account as specified
    - For production, this password should be changed immediately
*/

-- Insert default admin user if not exists
INSERT INTO admin_users (email, password_hash, full_name)
VALUES ('admin@locallink.com', 'admin123', 'Local Link Admin')
ON CONFLICT (email) DO NOTHING;
