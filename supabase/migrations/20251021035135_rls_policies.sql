-- Enable RLS on all tables
ALTER TABLE airlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE aircraft_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE galley_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE trolley_configurations ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flights ENABLE ROW LEVEL SECURITY;
ALTER TABLE flight_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to get user's airline_id
CREATE OR REPLACE FUNCTION auth.user_airline_id()
RETURNS UUID AS $$
  SELECT airline_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION auth.user_has_role(required_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = required_role
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Airlines policies
CREATE POLICY "Users can view their own airline"
  ON airlines FOR SELECT
  USING (id = auth.user_airline_id());

CREATE POLICY "Admins can update their airline"
  ON airlines FOR UPDATE
  USING (id = auth.user_airline_id() AND auth.user_has_role('admin'));

-- Profiles policies
CREATE POLICY "Users can view profiles in their airline"
  ON profiles FOR SELECT
  USING (airline_id = auth.user_airline_id());

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admins can manage profiles in their airline"
  ON profiles FOR ALL
  USING (airline_id = auth.user_airline_id() AND auth.user_has_role('admin'));

-- Aircraft Types policies
CREATE POLICY "Users can view aircraft types in their airline"
  ON aircraft_types FOR SELECT
  USING (airline_id = auth.user_airline_id());

CREATE POLICY "Admins can manage aircraft types"
  ON aircraft_types FOR ALL
  USING (airline_id = auth.user_airline_id() AND auth.user_has_role('admin'));

-- Item Categories policies
CREATE POLICY "Users can view categories in their airline"
  ON item_categories FOR SELECT
  USING (airline_id = auth.user_airline_id());

CREATE POLICY "Admins can manage categories"
  ON item_categories FOR ALL
  USING (airline_id = auth.user_airline_id() AND auth.user_has_role('admin'));

-- Items policies
CREATE POLICY "Users can view items in their airline"
  ON items FOR SELECT
  USING (airline_id = auth.user_airline_id());

CREATE POLICY "Admins can manage items in their airline"
  ON items FOR ALL
  USING (airline_id = auth.user_airline_id() AND auth.user_has_role('admin'));

-- Galley Configurations policies
CREATE POLICY "Users can view galley configs in their airline"
  ON galley_configurations FOR SELECT
  USING (airline_id = auth.user_airline_id());

CREATE POLICY "Admins can manage galley configs"
  ON galley_configurations FOR ALL
  USING (airline_id = auth.user_airline_id() AND auth.user_has_role('admin'));

-- Trolley Configurations policies
CREATE POLICY "Users can view trolley configs"
  ON trolley_configurations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM galley_configurations 
      WHERE galley_configurations.id = trolley_configurations.galley_configuration_id
      AND galley_configurations.airline_id = auth.user_airline_id()
    )
  );

CREATE POLICY "Admins can manage trolley configs"
  ON trolley_configurations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM galley_configurations 
      WHERE galley_configurations.id = trolley_configurations.galley_configuration_id
      AND galley_configurations.airline_id = auth.user_airline_id()
      AND auth.user_has_role('admin')
    )
  );

-- Item Positions policies
CREATE POLICY "Users can view item positions"
  ON item_positions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM galley_configurations 
      WHERE galley_configurations.id = item_positions.galley_configuration_id
      AND galley_configurations.airline_id = auth.user_airline_id()
    )
  );

CREATE POLICY "Admins can manage item positions"
  ON item_positions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM galley_configurations 
      WHERE galley_configurations.id = item_positions.galley_configuration_id
      AND galley_configurations.airline_id = auth.user_airline_id()
      AND auth.user_has_role('admin')
    )
  );

-- Flights policies
CREATE POLICY "Users can view flights in their airline"
  ON flights FOR SELECT
  USING (airline_id = auth.user_airline_id());

CREATE POLICY "Flight attendants can create flights"
  ON flights FOR INSERT
  WITH CHECK (airline_id = auth.user_airline_id());

CREATE POLICY "Flight attendants can update their flights"
  ON flights FOR UPDATE
  USING (airline_id = auth.user_airline_id());

-- Flight Inventory policies
CREATE POLICY "Users can view inventory for their airline's flights"
  ON flight_inventory FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM flights 
      WHERE flights.id = flight_inventory.flight_id 
      AND flights.airline_id = auth.user_airline_id()
    )
  );

CREATE POLICY "Flight attendants can manage flight inventory"
  ON flight_inventory FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM flights 
      WHERE flights.id = flight_inventory.flight_id 
      AND flights.airline_id = auth.user_airline_id()
    )
  );

-- Issues policies
CREATE POLICY "Users can view issues in their airline"
  ON issues FOR SELECT
  USING (airline_id = auth.user_airline_id());

CREATE POLICY "Flight attendants can create issues"
  ON issues FOR INSERT
  WITH CHECK (airline_id = auth.user_airline_id());

CREATE POLICY "Managers can manage issues"
  ON issues FOR ALL
  USING (
    airline_id = auth.user_airline_id() 
    AND (auth.user_has_role('admin') OR auth.user_has_role('manager'))
  );

-- Audit Logs policies
CREATE POLICY "Users can view audit logs in their airline"
  ON audit_logs FOR SELECT
  USING (airline_id = auth.user_airline_id());

CREATE POLICY "System can insert audit logs"
  ON audit_logs FOR INSERT
  WITH CHECK (true);