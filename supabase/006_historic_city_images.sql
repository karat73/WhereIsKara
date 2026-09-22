-- v1.1: city_image_url for the historic cities added in historic_visits_migration.sql.
-- Curated Unsplash photos matching the sabbatical set's vibe (night
-- cityscapes, iconic historic landmarks). Clarksdale, MS uses Kara's own
-- photo instead (bundled at public/cities/clarksdale.jpg), since it's too
-- small a town to have dedicated stock photography.

update cities set city_image_url = 'https://images.unsplash.com/photo-1751922090004-6386496669c8?q=80&w=1200&auto=format&fit=crop' where name = 'Edinburgh';
update cities set city_image_url = 'https://images.unsplash.com/photo-1767342976156-83239d26f08e?q=80&w=1200&auto=format&fit=crop' where name = 'New York';
update cities set city_image_url = 'https://images.unsplash.com/photo-1693366416169-66cdd3077cea?q=80&w=1200&auto=format&fit=crop' where name = 'Niagara Falls';
update cities set city_image_url = 'https://images.unsplash.com/photo-1689576549640-cca291237f98?q=80&w=1200&auto=format&fit=crop' where name = 'Toronto';
update cities set city_image_url = 'https://images.unsplash.com/photo-1736113777097-a16fdd8f6d05?q=80&w=1200&auto=format&fit=crop' where name = 'Paris';
update cities set city_image_url = 'https://images.unsplash.com/photo-1772645378904-5e612b962805?q=80&w=1200&auto=format&fit=crop' where name = 'Rome';
update cities set city_image_url = 'https://images.unsplash.com/photo-1567202170721-bd01fbdea30a?q=80&w=1200&auto=format&fit=crop' where name = 'Naples';
update cities set city_image_url = 'https://images.unsplash.com/photo-1760867333704-872f5ff51cdd?q=80&w=1200&auto=format&fit=crop' where name = 'Positano';
update cities set city_image_url = 'https://images.unsplash.com/photo-1566662961381-8ff13ac24766?q=80&w=1200&auto=format&fit=crop' where name = 'Milan';
update cities set city_image_url = 'https://images.unsplash.com/photo-1776377231754-d36928e6ee4d?q=80&w=1200&auto=format&fit=crop' where name = 'Florence';
update cities set city_image_url = 'https://images.unsplash.com/photo-1552320334-6cb8ecf589f0?q=80&w=1200&auto=format&fit=crop' where name = 'Jeju';
update cities set city_image_url = 'https://images.unsplash.com/photo-1759720694955-6968636a57a2?q=80&w=1200&auto=format&fit=crop' where name = 'Amsterdam';
update cities set city_image_url = 'https://images.unsplash.com/photo-1761700972079-42a1b4a79de2?q=80&w=1200&auto=format&fit=crop' where name = 'Athens';
update cities set city_image_url = 'https://images.unsplash.com/photo-1744641080605-b278a3b2d743?q=80&w=1200&auto=format&fit=crop' where name = 'Seville';
update cities set city_image_url = 'https://images.unsplash.com/photo-1577990432593-6bf35f43beed?q=80&w=1200&auto=format&fit=crop' where name = 'Valencia';
update cities set city_image_url = 'https://images.unsplash.com/photo-1758471206484-0eaa2568320c?q=80&w=1200&auto=format&fit=crop' where name = 'Barcelona';
update cities set city_image_url = 'https://images.unsplash.com/photo-1748279944004-f1d733dc711b?q=80&w=1200&auto=format&fit=crop' where name = 'Lisbon';
update cities set city_image_url = 'https://images.unsplash.com/photo-1762294946283-6921938e9937?q=80&w=1200&auto=format&fit=crop' where name = 'Porto';
update cities set city_image_url = 'https://images.unsplash.com/photo-1648231150978-27af59c1d3ca?q=80&w=1200&auto=format&fit=crop' where name = 'Washington DC';
update cities set city_image_url = 'https://images.unsplash.com/photo-1566993850067-bb8df9c9807e?q=80&w=1200&auto=format&fit=crop' where name = 'Palma de Mallorca';
update cities set city_image_url = 'https://images.unsplash.com/photo-1745872262717-69c8951b5c49?q=80&w=1200&auto=format&fit=crop' where name = 'Chicago';
update cities set city_image_url = 'https://images.unsplash.com/photo-1780375107678-1552b7682958?q=80&w=1200&auto=format&fit=crop' where name = 'Berlin';
update cities set city_image_url = 'https://images.unsplash.com/photo-1669488825828-c6a1facf0526?q=80&w=1200&auto=format&fit=crop' where name = 'Los Angeles';
update cities set city_image_url = 'https://images.unsplash.com/photo-1660814534413-156ba2220c4a?q=80&w=1200&auto=format&fit=crop' where name = 'Siena';
update cities set city_image_url = '/cities/clarksdale.jpg' where name = 'Clarksdale';
