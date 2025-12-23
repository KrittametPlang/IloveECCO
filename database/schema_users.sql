-- =============================================================
-- USERS TABLE - สำหรับผู้ใช้ระบบยืม (ไม่ใช่ admin)
-- =============================================================

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    fullname VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS set_updated_at_users ON users;
CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index for search
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_fullname ON users(fullname);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first (now table exists)
DROP POLICY IF EXISTS "Allow all for users" ON users;

-- Allow all operations (for demo - ในระบบจริงควรจำกัดสิทธิ์)
CREATE POLICY "Allow all for users" ON users 
    FOR ALL USING (true) WITH CHECK (true);
