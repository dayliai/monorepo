-- Seed internal solutions (10+ across 6 ADL categories)
INSERT INTO internal_solutions (title, description, detailed_description, source_type, source_url, adl_category, disability_tags, match_percentage, match_reason, person_name, time_ago, price_tier, is_diy, what_made_it_work) VALUES

-- Bathing
('Shower Transfer Bench with Backrest', 'A bench that straddles the tub wall — sit outside, slide in safely without stepping over.', 'This transfer bench sits half inside and half outside the bathtub. Users sit down on the outside portion and slide across to the inside. The backrest provides additional support and security. Non-slip rubber tips keep it stable on wet surfaces. Adjustable height fits most standard tubs.', 'community', NULL, 'bathing', ARRAY['mobility', 'balance', 'hip-replacement'], 95, 'Highly rated by users with similar mobility challenges', 'Robert P.', '2 weeks ago', '$', false, 'The non-slip feet and adjustable height meant it worked with our oddly sized tub.'),

('Suction-Cup Grab Bars (No Drill)', 'Portable grab bars that attach to smooth surfaces — perfect for renters who can''t modify walls.', 'These grab bars use industrial-strength suction cups to attach to tile, glass, and other smooth surfaces. A green/red indicator shows when they are securely locked. They support up to 250 lbs and can be repositioned as needed. No tools or drilling required.', 'web', 'https://example.com/suction-grab-bars', 'bathing', ARRAY['mobility', 'balance', 'renters'], 88, 'Great match for rental situations where permanent modifications aren''t possible', 'Linda M.', '1 month ago', '$', false, 'No drilling required meant we could use them in our rental apartment.'),

-- Dressing
('Magnetic Button Conversion Kit', 'Replace regular buttons with magnetic closures — shirts look normal but close with a snap.', 'This kit includes magnetic snaps that sew behind existing buttons. From the outside, shirts look completely normal. The magnets are strong enough to stay closed during normal activity but easy to open with one hand. Kit converts 5 shirts.', 'youtube', 'https://youtube.com/watch?v=example1', 'dressing', ARRAY['stroke', 'one-handed', 'dexterity'], 92, 'Excellent for users with limited hand dexterity or one-handed use', 'Patricia W.', '1 month ago', '$', true, 'My husband''s dress shirts look completely normal from the outside.'),

('Elastic No-Tie Shoelaces', 'Convert any lace-up shoe to slip-on — stretch to put on, look like regular tied laces.', 'These elastic laces replace standard shoelaces and turn any shoe into a slip-on. They stretch to allow the foot in and out but maintain the appearance of tied laces. Available in multiple colors to match existing shoes.', 'web', 'https://example.com/elastic-laces', 'dressing', ARRAY['mobility', 'back-pain', 'dexterity'], 85, 'Simple solution for users who struggle with bending or fine motor tasks', 'Frank S.', '2 months ago', 'free', true, 'Combined with a long-handled shoehorn, I can be out the door in minutes.'),

-- Eating
('Weighted Utensil Set', 'Heavy-handled forks and spoons that dampen hand tremors while eating.', 'These utensils have stainless steel handles filled with additional weight. The extra mass helps counteract tremors, allowing smoother movement from plate to mouth. Dishwasher safe. Comes in a set of fork, knife, and two spoon sizes.', 'web', 'https://example.com/weighted-utensils', 'eating', ARRAY['tremors', 'parkinsons', 'essential-tremor'], 90, 'Specifically designed to address tremor-related eating difficulties', 'James T.', '1 month ago', '$$', false, 'The extra weight in the handle steadies my hand enough to eat soup again.'),

('Scoop Plate with Suction Base', 'A plate with one raised edge for scooping food with one hand — suction base prevents sliding.', 'The curved inner wall on one side provides a surface to push food against. The suction cup base keeps the plate firmly in place on the table. Looks like a regular dinner plate. Microwave and dishwasher safe.', 'community', NULL, 'eating', ARRAY['stroke', 'one-handed', 'cerebral-palsy'], 87, 'Ideal for one-handed eating after stroke or with limited arm function', 'Dorothy K.', '2 weeks ago', '$', false, 'The suction cup base keeps the plate from sliding around.'),

-- Mobility
('Portable Folding Ramp (3ft)', 'Lightweight aluminum ramp that folds in half — carry anywhere for 1-3 step access.', 'Made from aircraft-grade aluminum, this ramp folds in half to briefcase size. It handles up to 600 lbs and provides a safe slope for wheelchairs and scooters over 1-3 steps. Non-slip surface on top, rubber grip feet on bottom.', 'youtube', 'https://youtube.com/watch?v=example2', 'mobility', ARRAY['wheelchair', 'scooter', 'accessibility'], 93, 'Essential for wheelchair users encountering small step barriers', 'Thomas H.', '1 month ago', '$$', false, 'Folds to briefcase size and weighs only 10 lbs. I keep it in my trunk.'),

('Knee Scooter with Basket', 'A wheeled scooter you kneel on — both hands free, faster than crutches.', 'This scooter supports the injured leg on a padded platform while the user pushes with the other foot. Includes a front basket for carrying items, hand brakes, and folds for transport. Most models are adjustable in height.', 'web', 'https://example.com/knee-scooter', 'mobility', ARRAY['foot-surgery', 'ankle-injury', 'recovery'], 80, 'Great alternative to crutches during lower leg/foot recovery', 'Richard W.', '2 months ago', '$$', false, 'Both hands are completely free. I could carry coffee and open doors.'),

-- Toileting
('Raised Toilet Seat with Padded Armrests', 'Adds 4 inches of height plus sturdy armrests — sit and stand independently.', 'This raised seat clamps securely onto the existing toilet bowl with no tools needed. The padded armrests provide leverage for sitting down and standing up. Supports up to 300 lbs. Easy to remove for cleaning.', 'community', NULL, 'toileting', ARRAY['arthritis', 'knee-pain', 'hip-replacement'], 94, 'Top-rated solution for users with knee or hip joint limitations', 'Helen B.', '1 month ago', '$', false, 'The padded armrests give me leverage to stand without calling for help.'),

-- Transferring
('Sliding Transfer Board', 'A smooth board bridging bed to wheelchair — slide across instead of standing and pivoting.', 'This transfer board is contoured to prevent tipping and has a friction-free surface. One end goes under the user''s hip on the bed, the other rests on the wheelchair seat. The user slides across without needing to stand. Available in different lengths.', 'web', 'https://example.com/transfer-board', 'transferring', ARRAY['wheelchair', 'paraplegia', 'limited-mobility'], 91, 'Essential aid for bed-to-wheelchair transfers', 'David R.', '1 month ago', '$', false, 'The slightly curved shape and slick surface make the slide effortless.');


-- Seed filter options
INSERT INTO filter_options (category, label, value, sort_order) VALUES
('source', 'Web', 'web', 1),
('source', 'YouTube', 'youtube', 2),
('source', 'Community', 'community', 3),
('price', 'Free', 'free', 1),
('price', '$', '$', 2),
('price', '$$', '$$', 3),
('price', '$$$$', '$$$$', 4),
('type', 'DIY', 'diy', 1),
('type', 'Pre-Made', 'pre-made', 2);


-- Seed diagnostic prompts (4-step flow)
INSERT INTO diagnostic_prompts (step, question, subtitle, options, condition_field, condition_value) VALUES
(1, 'Who are you seeking solutions for?', 'This helps us personalize your experience', '[{"label": "Myself", "value": "myself"}, {"label": "Someone else", "value": "someone_else"}]', NULL, NULL),
(2, 'What level of care do you currently need?', 'Select the option that best describes your situation', '[{"label": "Mostly independent", "value": "independent"}, {"label": "Some help needed", "value": "some_help"}, {"label": "Significant help needed", "value": "significant_help"}, {"label": "Full assistance required", "value": "full_assistance"}]', 'who', 'myself'),
(2, 'What is your relationship to this person?', 'This helps us understand the care context', '[{"label": "Spouse or partner", "value": "spouse"}, {"label": "Parent", "value": "parent"}, {"label": "Child", "value": "child"}, {"label": "Client or patient", "value": "client"}]', 'who', 'someone_else'),
(3, 'Which areas are most challenging?', 'Select all that apply', '[{"label": "Mobility", "value": "mobility"}, {"label": "Hand Dexterity", "value": "dexterity"}, {"label": "Vision", "value": "vision"}, {"label": "Hearing & Speech", "value": "hearing"}, {"label": "Memory & Cognitive", "value": "memory"}, {"label": "Bathroom Safety", "value": "bathroom"}, {"label": "Dressing", "value": "dressing"}, {"label": "Eating & Drinking", "value": "eating"}]', NULL, NULL),
(4, 'What specific challenges do you face?', 'Select all that apply — we''ll find targeted solutions', '[{"label": "Getting in/out of shower or tub", "value": "shower_transfer"}, {"label": "Standing balance while bathing", "value": "bath_balance"}, {"label": "Reaching to wash", "value": "reaching"}]', 'challenges', 'bathroom');


-- Seed diagnostic paths (branching sub-options)
INSERT INTO diagnostic_paths (parent_step, parent_value, step, question, options, is_multi_select) VALUES
(3, 'mobility', 4, 'What mobility challenges do you face?', '[{"label": "Walking long distances", "value": "walking"}, {"label": "Getting up from chairs", "value": "standing"}, {"label": "Navigating stairs", "value": "stairs"}, {"label": "Using public transport", "value": "transport"}]', true),
(3, 'dexterity', 4, 'What hand/dexterity challenges do you face?', '[{"label": "Buttoning clothes", "value": "buttons"}, {"label": "Opening jars/containers", "value": "jars"}, {"label": "Writing/typing", "value": "writing"}, {"label": "Gripping utensils", "value": "gripping"}]', true),
(3, 'bathroom', 4, 'What bathroom challenges do you face?', '[{"label": "Getting in/out of tub", "value": "tub_transfer"}, {"label": "Standing in shower", "value": "shower_standing"}, {"label": "Using the toilet", "value": "toilet"}, {"label": "Reaching/bending", "value": "reaching"}]', true),
(3, 'eating', 4, 'What eating challenges do you face?', '[{"label": "Holding utensils", "value": "holding"}, {"label": "Cutting food", "value": "cutting"}, {"label": "Drinking without spilling", "value": "drinking"}, {"label": "Preparing meals", "value": "meal_prep"}]', true),
(3, 'dressing', 4, 'What dressing challenges do you face?', '[{"label": "Buttons and zippers", "value": "fasteners"}, {"label": "Putting on shoes", "value": "shoes"}, {"label": "Pulling clothes over head", "value": "overhead"}, {"label": "Managing undergarments", "value": "undergarments"}]', true),
(3, 'vision', 4, 'What vision-related challenges do you face?', '[{"label": "Reading labels/instructions", "value": "reading"}, {"label": "Navigating unfamiliar spaces", "value": "navigation"}, {"label": "Identifying medications", "value": "medications"}, {"label": "Using technology", "value": "technology"}]', true),
(3, 'memory', 4, 'What memory/cognitive challenges do you face?', '[{"label": "Remembering daily schedules", "value": "schedules"}, {"label": "Managing medications", "value": "med_management"}, {"label": "Following multi-step tasks", "value": "multi_step"}, {"label": "Safety awareness", "value": "safety"}]', true);
