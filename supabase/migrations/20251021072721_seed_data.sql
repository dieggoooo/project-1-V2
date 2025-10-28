-- Insert demo airline (American Airlines)
INSERT INTO airlines (id, name, code, settings) VALUES
('00000000-0000-0000-0000-000000000001', 'American Airlines', 'AA', '{"theme": "blue", "primary_color": "#0078D2"}');

-- Insert demo aircraft type
INSERT INTO aircraft_types (id, airline_id, name, model, registration, metadata) VALUES
('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Boeing 777-300ER', 'B777-300ER', 'N123AA', '{"capacity": 350, "range_km": 11135}');

-- Insert item categories
INSERT INTO item_categories (id, airline_id, parent_id, name, code, icon, color) VALUES
('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000001', NULL, 'Beverages', 'beverages', 'ri-cup-line', 'blue'),
('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Alcoholic', 'alcoholic', 'ri-goblet-line', 'purple'),
('00000000-0000-0000-0000-000000000012', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Hot Drinks', 'hot-drinks', 'ri-fire-line', 'orange'),
('00000000-0000-0000-0000-000000000013', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Juice', 'juice', 'ri-drop-line', 'yellow'),
('00000000-0000-0000-0000-000000000014', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000010', 'Soda', 'soda', 'ri-bubble-chart-line', 'red'),
('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000001', NULL, 'Snacks', 'snacks', 'ri-cake-2-line', 'orange'),
('00000000-0000-0000-0000-000000000030', '00000000-0000-0000-0000-000000000001', NULL, 'Meals', 'meals', 'ri-restaurant-line', 'green');

-- Insert demo items
INSERT INTO items (id, airline_id, category_id, code, name, description, type, subcategory, unit_of_measure, is_common, is_alcoholic) VALUES
('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000012', 'COF0407', 'BAG OF AMERICAN COFFEE (DECAF) 2.52KG FINE GRIND 70G', 'Premium decaffeinated coffee blend for first-class service', 'Supplies', 'hot-drinks', 'bags', true, false),
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'CHA0001', 'Dom Pérignon 2012', 'Premium vintage champagne for first-class service', 'Champagne', 'alcoholic', 'bottles', false, true),
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'SPR0001', 'Hennessy Paradis', 'Ultra-premium cognac for exclusive service', 'Cognac', 'alcoholic', 'bottles', false, true),
('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'WHI0001', 'Johnnie Walker Blue', 'Premium blended Scotch whisky', 'Whisky', 'alcoholic', 'bottles', false, true),
('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000011', 'VOD0001', 'Grey Goose Vodka', 'Premium French vodka', 'Vodka', 'alcoholic', 'bottles', false, true),
('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000013', 'JUI0002', 'Fresh Orange Juice', 'Fresh squeezed orange juice', 'Drinks', 'juice', 'bottles', true, false),
('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000014', 'SOD0001', 'Coca Cola', 'Classic cola soft drink', 'Drinks', 'soda', 'cans', true, false);

-- Insert galley configuration for Forward First Class (1F1C)
INSERT INTO galley_configurations (id, airline_id, aircraft_type_id, galley_code, name, type, position_data) VALUES
('00000000-0000-0000-0000-000000000200', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '1F1C', 'Forward First Class Galley Center', 'First Class', 
'{
  "positions": [
    {"id": "1F1C20", "code": "Pos 1F1C20 CAJA STD", "type": "standard", "category": "miscellaneous", "size": "medium", "row": 0, "col": 0},
    {"id": "1F1C23F", "code": "Pos 1F1C23F CAJA STD", "type": "standard", "category": "miscellaneous", "size": "medium", "row": 0, "col": 3},
    {"id": "1F1C01", "code": "Pos 1F1C01 Carro 1/1", "type": "cart", "category": "miscellaneous", "size": "large", "row": 3, "col": 0},
    {"id": "1F1C03", "code": "Pos 1F1C03 Carro 1/1", "type": "cart", "category": "liquids", "size": "large", "row": 3, "col": 2}
  ]
}'::jsonb);

-- Insert trolley configuration
INSERT INTO trolley_configurations (id, galley_configuration_id, position_code, name, type, layout_data) VALUES
('00000000-0000-0000-0000-000000000300', '00000000-0000-0000-0000-000000000200', '1F1C03', 'Pos 1F1C03 Carro 1/1', 'First Class Beverage Cart',
'{
  "front": [
    {"slot": 1, "item": "1x Jugos CJ\\n1x Leche Light", "rowSpan": 3},
    {"slot": 5, "item": "01x Agua 1.5L", "rowSpan": 2}
  ],
  "back": [
    {"slot": 1, "item": "01x Kit de Hielo", "rowSpan": 3}
  ]
}'::jsonb);

-- Insert item positions (where items are stored in galleys)
INSERT INTO item_positions (item_id, galley_configuration_id, position_code, quantity) VALUES
('00000000-0000-0000-0000-000000000100', '00000000-0000-0000-0000-000000000200', '1F1C23F', 12),
('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000200', '1F1C01', 6),
('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000200', '1F1C01', 4),
('00000000-0000-0000-0000-000000000103', '00000000-0000-0000-0000-000000000200', '1F1C03', 2),
('00000000-0000-0000-0000-000000000104', '00000000-0000-0000-0000-000000000200', '1F1C03', 3),
('00000000-0000-0000-0000-000000000105', '00000000-0000-0000-0000-000000000200', '1F1C03', 48),
('00000000-0000-0000-0000-000000000106', '00000000-0000-0000-0000-000000000200', '1F1C03', 96);