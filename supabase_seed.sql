-- Seed file generated to migrate data.ts into Supabase

INSERT INTO products (id, name, price, description, image, category, gender, notes, origin, "isSignature", "order", "isHidden")
VALUES ('582f9c48-839e-47c6-b6fc-54b56b81bb9b', 'The Midnight Oud', 38500, 'A mysterious and captivating fragrance that blends the richness of agarwood with the warmth of spices. The Midnight Oud is an olfactory journey into the heart of the night, where secrets are whispered and elegance reigns supreme.', 'https://images.unsplash.com/photo-1594035910387-fea4779426e9?q=80&w=800&auto=format&fit=crop', 'Unisex', 'Unisex', '{"top":"Bergamot, Saffron","heart":"Rose, Oud Wood","base":"Amber, Musk, Patchouli"}'::jsonb, 'Dubai, UAE', true, 0, false);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('ab277ed7-c4c2-49b7-ad6b-9b750bb1f8bd', '582f9c48-839e-47c6-b6fc-54b56b81bb9b', '5ml', 4500, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('9f4494d1-4ac0-48bb-8d7f-422ab9a16959', '582f9c48-839e-47c6-b6fc-54b56b81bb9b', '10ml', 8500, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('a71a6148-2839-40c8-a822-a75d89b0da0a', '582f9c48-839e-47c6-b6fc-54b56b81bb9b', '100ml', 38500, 20);

INSERT INTO products (id, name, price, description, image, category, gender, notes, origin, "isSignature", "order", "isHidden")
VALUES ('fe4e9f41-8e93-48e2-8f14-92748336eb0d', 'Aurum Elixir', 42000, 'A radiant blend of golden amber and white florals, embodying elegance and grace. Aurum Elixir captures the essence of pure gold, delivering a luminous scent that lingers like a precious memory.', 'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop', 'Women', 'Women', '{"top":"Pear, Neroli","heart":"Jasmine, Orange Blossom","base":"Vanilla, Precious Woods"}'::jsonb, 'Grasse, France', false, 0, false);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('e89068c7-4ff6-4669-937a-2f20a494c767', 'fe4e9f41-8e93-48e2-8f14-92748336eb0d', '5ml', 5000, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('117db57a-9ec9-4968-a0c4-5bc449a6344c', 'fe4e9f41-8e93-48e2-8f14-92748336eb0d', '10ml', 9500, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('abd6931c-2407-4f9a-9403-6b5dafe64243', 'fe4e9f41-8e93-48e2-8f14-92748336eb0d', '100ml', 42000, 15);

INSERT INTO products (id, name, price, description, image, category, gender, notes, origin, "isSignature", "order", "isHidden")
VALUES ('8e4196ec-d401-4d3c-a564-09367104e3cf', 'Noir Intense', 34500, 'A bold and sophisticated scent for the modern man, featuring dark spices and leather. Noir Intense is a statement of power and confidence, designed for those who command attention without saying a word.', 'https://images.unsplash.com/photo-1523293188086-b589b9e54020?q=80&w=800&auto=format&fit=crop', 'Men', 'Men', '{"top":"Black Pepper, Cardamom","heart":"Leather, Tobacco","base":"Vetiver, Tonka Bean"}'::jsonb, 'London, UK', false, 0, false);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('b7df240f-ccec-4330-b4e8-65551bf566b8', '8e4196ec-d401-4d3c-a564-09367104e3cf', '5ml', 4000, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('4a44c37b-a1cb-4bb1-bbb6-01a20be8975f', '8e4196ec-d401-4d3c-a564-09367104e3cf', '10ml', 7500, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('44b19688-4715-4deb-8c9b-ce492238e71c', '8e4196ec-d401-4d3c-a564-09367104e3cf', '100ml', 34500, 25);

INSERT INTO products (id, name, price, description, image, category, gender, notes, origin, "isSignature", "order", "isHidden")
VALUES ('e5d291cc-9907-42cb-b7c7-d4aaa8e2ff73', 'Rose Royale', 39900, 'A tribute to the queen of flowers, this scent pairs velvety rose with a hint of citrus. Rose Royale is a romantic and regal fragrance that celebrates femininity in its most exquisite form.', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=800&auto=format&fit=crop', 'Women', 'Women', '{"top":"Mandarin, Lychee","heart":"Damask Rose, Peony","base":"White Musk, Cedar"}'::jsonb, 'Paris, France', false, 0, false);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('d0cbd66f-245b-4b9b-9994-c60851aae6a4', 'e5d291cc-9907-42cb-b7c7-d4aaa8e2ff73', '5ml', 4800, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('140d32c3-ce50-4a11-b686-c14e76e3520b', 'e5d291cc-9907-42cb-b7c7-d4aaa8e2ff73', '10ml', 8800, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('0755ceef-5cb1-40d0-9f6a-754512f6ee72', 'e5d291cc-9907-42cb-b7c7-d4aaa8e2ff73', '100ml', 39900, 18);

INSERT INTO products (id, name, price, description, image, category, gender, notes, origin, "isSignature", "order", "isHidden")
VALUES ('fbca0e5a-0468-4aec-a6f2-45e9acaa6e08', 'Oceanic Breeze', 28500, 'Fresh and invigorating, capturing the spirit of the sea with marine notes and citrus. Oceanic Breeze brings the freedom of the open ocean to your daily life, perfect for the adventurous spirit.', 'https://images.unsplash.com/photo-1583445013765-46c20c4a6772?q=80&w=800&auto=format&fit=crop', 'Unisex', 'Unisex', '{"top":"Sea Salt, Lemon","heart":"Sage, Seaweed","base":"Driftwood, Ambergris"}'::jsonb, 'Amalfi, Italy', false, 0, false);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('0c47914a-2cee-42e0-8592-84f9ac0b34a4', 'fbca0e5a-0468-4aec-a6f2-45e9acaa6e08', '5ml', 3500, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('bc522aee-a10f-4eef-b852-078ae40220d3', 'fbca0e5a-0468-4aec-a6f2-45e9acaa6e08', '10ml', 6500, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('7f4f8005-4cdd-444f-b59e-f13a5238e310', 'fbca0e5a-0468-4aec-a6f2-45e9acaa6e08', '100ml', 28500, 30);

INSERT INTO products (id, name, price, description, image, category, gender, notes, origin, "isSignature", "order", "isHidden")
VALUES ('4954a743-9d05-4d16-9655-78c70bd76cae', 'Spiced Leather', 32000, 'Warm and masculine, blending rich leather with exotic spices for a powerful statement. Spiced Leather is a classic scent reimagined for the contemporary gentleman who appreciates tradition and quality.', 'https://images.unsplash.com/photo-1615160359797-a84accd09ae8?q=80&w=800&auto=format&fit=crop', 'Men', 'Men', '{"top":"Cinnamon, Clove","heart":"Leather, Iris","base":"Sandalwood, Vanilla"}'::jsonb, 'New York, USA', false, 0, false);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('31ec6db3-bc01-46c5-b877-d52aabc86dfa', '4954a743-9d05-4d16-9655-78c70bd76cae', '5ml', 3800, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('99ec94d4-51cc-4f1d-ae5c-43320c843778', '4954a743-9d05-4d16-9655-78c70bd76cae', '10ml', 7200, 50);

INSERT INTO product_variants (id, product_id, size, price, quantity)
VALUES ('03b630fd-63c8-4e20-91e6-65e8f4b411ea', '4954a743-9d05-4d16-9655-78c70bd76cae', '100ml', 32000, 20);

