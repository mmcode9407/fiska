-- Migration: Create generations table
-- Description: Creates the generations table that stores information about flashcard generation sessions
-- Date: 2024-03-20

-- Function for automatic updated_at update
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

-- Table generations
create table generations (
    id bigserial primary key,
    user_id uuid not null,
    model varchar not null,
    generated_count integer not null,
    accepted_unedited_count integer not null,
    accepted_edited_count integer not null,
    source_text_hash varchar not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    generation_duration integer not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_user foreign key (user_id) references auth.users(id) on delete cascade
);

-- Index for generations table
create index idx_generations_user_id on generations(user_id);

-- Enable RLS for generations
alter table generations enable row level security;

-- RLS policies for generations
create policy "Users can view only their generations" 
    on generations for select to authenticated
    using (auth.uid() = user_id);

create policy "Users can create their generations" 
    on generations for insert to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update only their generations" 
    on generations for update to authenticated
    using (auth.uid() = user_id);

create policy "Users can delete only their generations" 
    on generations for delete to authenticated
    using (auth.uid() = user_id);

-- Trigger for automatic updated_at update
create trigger update_generations_updated_at
    before update on generations
    for each row
    execute function update_updated_at_column();

-- Comments
comment on table generations is 'Stores information about flashcard generation sessions';
comment on column generations.model is 'The AI model used for generation';
comment on column generations.generated_count is 'Total number of flashcards generated in this session';
comment on column generations.accepted_unedited_count is 'Number of generated flashcards accepted without edits';
comment on column generations.accepted_edited_count is 'Number of generated flashcards accepted after editing';
comment on column generations.source_text_hash is 'Hash of the source text used for generation';
comment on column generations.source_text_length is 'Length of the source text in characters (must be between 1000 and 10000)';
comment on column generations.generation_duration is 'Duration of the generation process in milliseconds';