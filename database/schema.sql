-- =============================================================
-- BORROW SYSTEM - SQL SCHEMA (Safe to re-run)
-- =============================================================

-- =====================
-- 1. DROP EXISTING TRIGGERS (ถ้ามี)
-- =====================
DROP TRIGGER IF EXISTS set_updated_at_shoes ON shoes;
DROP TRIGGER IF EXISTS set_updated_at_admins ON admins;
DROP TRIGGER IF EXISTS set_updated_at_borrow_records ON borrow_records;
DROP TRIGGER IF EXISTS check_availability_before_borrow ON borrow_items;
DROP TRIGGER IF EXISTS return_qty_on_return ON borrow_records;

-- =====================
-- 2. TABLES (ถ้ายังไม่มี)
-- =====================

-- ตารางผู้ใช้ระบบ (Admin)
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    fullname VARCHAR(100),
    email VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางรองเท้า (Shoes/Items)
CREATE TABLE IF NOT EXISTS shoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(50),
    color_code VARCHAR(20),
    season VARCHAR(20),
    location VARCHAR(20),
    max_qty INTEGER DEFAULT 1 CHECK (max_qty >= 0),
    current_qty INTEGER DEFAULT 0 CHECK (current_qty >= 0),
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางผู้ยืม (Borrowers)
CREATE TABLE IF NOT EXISTS borrowers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fullname VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางการยืม (Borrow Records)
CREATE TABLE IF NOT EXISTS borrow_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrower_id UUID NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
    borrow_date DATE NOT NULL DEFAULT CURRENT_DATE,
    expected_return_date DATE,
    actual_return_date DATE,
    status VARCHAR(20) DEFAULT 'borrowed' CHECK (status IN ('borrowed', 'returned', 'overdue')),
    notes TEXT,
    created_by UUID REFERENCES admins(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ตารางรายการที่ยืม (Borrow Items)
CREATE TABLE IF NOT EXISTS borrow_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    borrow_record_id UUID NOT NULL REFERENCES borrow_records(id) ON DELETE CASCADE,
    shoe_id UUID NOT NULL REFERENCES shoes(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================
-- 3. INDEXES
-- =====================
CREATE INDEX IF NOT EXISTS idx_shoes_code ON shoes(code);
CREATE INDEX IF NOT EXISTS idx_shoes_name ON shoes(name);
CREATE INDEX IF NOT EXISTS idx_borrow_records_status ON borrow_records(status);
CREATE INDEX IF NOT EXISTS idx_borrow_records_borrower ON borrow_records(borrower_id);

-- =====================
-- 4. FUNCTIONS
-- =====================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================
-- 5. TRIGGERS
-- =====================
CREATE TRIGGER set_updated_at_shoes
    BEFORE UPDATE ON shoes
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_admins
    BEFORE UPDATE ON admins
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER set_updated_at_borrow_records
    BEFORE UPDATE ON borrow_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================
-- 6. ROW LEVEL SECURITY (ปิดสำหรับ anon key)
-- =====================
ALTER TABLE shoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrowers ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrow_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE borrow_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow all for shoes" ON shoes;
DROP POLICY IF EXISTS "Allow all for borrowers" ON borrowers;
DROP POLICY IF EXISTS "Allow all for borrow_records" ON borrow_records;
DROP POLICY IF EXISTS "Allow all for borrow_items" ON borrow_items;

-- Create simple policies (allow all for demo)
CREATE POLICY "Allow all for shoes" ON shoes FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for borrowers" ON borrowers FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for borrow_records" ON borrow_records FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for borrow_items" ON borrow_items FOR ALL USING (true) WITH CHECK (true);

-- =====================
-- 7. SAMPLE DATA
-- =====================
INSERT INTO shoes (code, name, model, color_code, season, location, max_qty, image_url) VALUES
('SKU001', 'รองเท้าผ้าใบ Classic', '102803', '51925', 'SS2020', 'A1-01', 10, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&h=200&fit=crop'),
('SKU002', 'รองเท้าวิ่ง Sport Pro', '205417', '33801', 'FW2021', 'A1-02', 8, 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=200&h=200&fit=crop'),
('SKU003', 'รองเท้าหนัง Premium', '308956', '72140', 'SS2021', 'A2-01', 5, 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&h=200&fit=crop'),
('SKU004', 'รองเท้าแตะ Comfort', '411284', '95632', 'FW2022', 'A2-02', 15, 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&h=200&fit=crop'),
('SKU005', 'รองเท้าบูท Urban', '524671', '18405', 'SS2022', 'B1-01', 6, 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop'),
('SKU006', 'รองเท้าผ้าใบ Limited', '637592', '46289', 'FW2023', 'B1-02', 3, 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=200&h=200&fit=crop')
ON CONFLICT (code) DO NOTHING;
