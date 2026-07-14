alter table products add column if not exists style_key text;
alter table products add column if not exists pattern text;
alter table products add column if not exists occasion text;
alter table products add column if not exists era text;
alter table products add column if not exists rarity text;
notify pgrst, 'reload schema';
