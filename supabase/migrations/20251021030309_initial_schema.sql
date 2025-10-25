-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Airlines (Tenant) Table
CREATE TABLE airlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles (Users) Table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    employee_id VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    emergency_contact VARCHAR(255),
    role VARCHAR(20) DEFAULT 'flight_attendant' CHECK (role IN ('admin', 'manager', 'flight_attendant')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(airline_id, employee_id)
);

-- Aircraft Types Table
CREATE TABLE aircraft_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    registration VARCHAR(50),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(airline_id, registration)
);

-- Item Categories Table
CREATE TABLE item_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES item_categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    icon VARCHAR(50),
    color VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(airline_id, code)
);

-- Items (Product Catalog) Table
CREATE TABLE items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
    category_id UUID REFERENCES item_categories(id) ON DELETE SET NULL,
    code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(100),
    subcategory VARCHAR(100),
    unit_of_measure VARCHAR(50) NOT NULL,
    is_common BOOLEAN DEFAULT false,
    is_alcoholic BOOLEAN DEFAULT false,
    image_url TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(airline_id, code)
);

-- Galley Configurations Table
CREATE TABLE galley_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
    aircraft_type_id UUID NOT NULL REFERENCES aircraft_types(id) ON DELETE CASCADE,
    galley_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    position_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(aircraft_type_id, galley_code)
);

-- Trolley Configurations Table
CREATE TABLE trolley_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    galley_configuration_id UUID NOT NULL REFERENCES galley_configurations(id) ON DELETE CASCADE,
    position_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    layout_data JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(galley_configuration_id, position_code)
);

-- Item Positions (Where items are stored)
CREATE TABLE item_positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    galley_configuration_id UUID NOT NULL REFERENCES galley_configurations(id) ON DELETE CASCADE,
    position_code VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(item_id, galley_configuration_id, position_code)
);

-- Flights Table
CREATE TABLE flights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
    aircraft_type_id UUID NOT NULL REFERENCES aircraft_types(id) ON DELETE CASCADE,
    flight_number VARCHAR(50) NOT NULL,
    aircraft_registration VARCHAR(50) NOT NULL,
    origin VARCHAR(10) NOT NULL,
    destination VARCHAR(10) NOT NULL,
    departure_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flight Inventory (Consumption tracking)
CREATE TABLE flight_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE CASCADE,
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    position_code VARCHAR(50) NOT NULL,
    starting_quantity INTEGER NOT NULL,
    consumed INTEGER DEFAULT 0,
    remaining INTEGER,
    percentage_remaining INTEGER,
    bottle_levels JSONB,
    notes TEXT,
    checked BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(flight_id, item_id, position_code)
);

-- Issues Table
CREATE TABLE issues (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
    flight_id UUID REFERENCES flights(id) ON DELETE SET NULL,
    item_id UUID REFERENCES items(id) ON DELETE SET NULL,
    reported_by UUID NOT NULL REFERENCES profiles(id),
    type VARCHAR(50) NOT NULL CHECK (type IN ('misplacement', 'damage', 'missing', 'monetary-consumption', 'customer-impact', 'other')),
    location VARCHAR(100),
    description TEXT NOT NULL,
    severity VARCHAR(20) DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high')),
    passengers_affected VARCHAR(20),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'resolved', 'closed')),
    resolved_by UUID REFERENCES profiles(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(20) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_airline ON profiles(airline_id);
CREATE INDEX idx_aircraft_types_airline ON aircraft_types(airline_id);
CREATE INDEX idx_items_airline ON items(airline_id);
CREATE INDEX idx_items_category ON items(category_id);
CREATE INDEX idx_galley_configs_aircraft ON galley_configurations(aircraft_type_id);
CREATE INDEX idx_flights_airline ON flights(airline_id);
CREATE INDEX idx_flights_date ON flights(departure_date);
CREATE INDEX idx_flight_inventory_flight ON flight_inventory(flight_id);
CREATE INDEX idx_issues_airline ON issues(airline_id);
CREATE INDEX idx_issues_flight ON issues(flight_id);
CREATE INDEX idx_audit_logs_airline ON audit_logs(airline_id);