-- Add the tsvector column
ALTER TABLE courses ADD COLUMN search_vector tsvector;

-- Update existing rows (handling NULL description)
UPDATE courses SET search_vector = to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, ''));

-- Create the trigger function
CREATE OR REPLACE FUNCTION courses_search_vector_trigger() RETURNS trigger AS $$
begin
  new.search_vector :=
    to_tsvector('english', coalesce(new.title, '') || ' ' || coalesce(new.description, ''));
  return new;
end;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER tsvectorupdate 
BEFORE INSERT OR UPDATE ON courses 
FOR EACH ROW EXECUTE FUNCTION courses_search_vector_trigger();

-- Create the GIN Index
CREATE INDEX courses_search_idx ON courses USING GIN (search_vector);
