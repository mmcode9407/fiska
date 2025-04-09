-- Migration: Create flashcards table
-- Description: Creates the flashcards table that stores user's flashcards
-- Date: 2024-03-20

-- Function for automatic updated_at update
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

-- Table flashcards
create table flashcards (
    id bigserial primary key,
    front varchar(200) not null,
    back varchar(500) not null,
    source varchar not null check (source in ('ai-full', 'ai-edited', 'manual')),
    generation_id bigint references generations(id) on delete set null,
    user_id uuid not null,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    constraint fk_user foreign key (user_id) references auth.users(id) on delete cascade
);

-- Indexes for flashcards table
create index idx_flashcards_user_id on flashcards(user_id);
create index idx_flashcards_generation_id on flashcards(generation_id);

-- Enable RLS for flashcards
alter table flashcards enable row level security;

-- RLS policies for flashcards
create policy "Users can view only their flashcards" 
    on flashcards for select to authenticated
    using (auth.uid() = user_id);

create policy "Users can create their flashcards" 
    on flashcards for insert to authenticated
    with check (auth.uid() = user_id);

create policy "Users can update only their flashcards" 
    on flashcards for update to authenticated
    using (auth.uid() = user_id);

create policy "Users can delete only their flashcards" 
    on flashcards for delete to authenticated
    using (auth.uid() = user_id);

-- Trigger for automatic updated_at update
create trigger update_flashcards_updated_at
    before update on flashcards
    for each row
    execute function update_updated_at_column();

-- Comments
comment on table flashcards is 'Stores flashcards created by users, either manually or through AI generation';
comment on column flashcards.front is 'Front side of the flashcard (question or prompt), limited to 200 characters';
comment on column flashcards.back is 'Back side of the flashcard (answer or explanation), limited to 500 characters';
comment on column flashcards.source is 'Source of the flashcard: ai-full (unedited AI generation), ai-edited (edited AI generation), or manual (manually created)';