-- Migration: Create generation_error_logs table
-- Description: Creates the generation_error_logs table that stores flashcard generation error logs
-- Date: 2024-03-20

-- Table generation_error_logs
create table generation_error_logs (
    id bigserial primary key,
    user_id uuid not null,
    model varchar not null,
    source_text_hash varchar not null,
    source_text_length integer not null check (source_text_length between 1000 and 10000),
    error_code varchar(100) not null,
    error_message text not null,
    created_at timestamptz not null default now(),
    constraint fk_user foreign key (user_id) references auth.users(id) on delete cascade
);

-- Index for generation_error_logs table
create index idx_generation_error_logs_user_id on generation_error_logs(user_id);

-- Enable RLS for generation_error_logs
alter table generation_error_logs enable row level security;

-- RLS policies for generation_error_logs
create policy "Users can view only their error logs" 
    on generation_error_logs for select to authenticated
    using (auth.uid() = user_id);

create policy "Users can create their error logs" 
    on generation_error_logs for insert to authenticated
    with check (auth.uid() = user_id);

-- Comments
comment on table public.generation_error_logs is 'Stores error logs from failed flashcard generation attempts';
comment on column public.generation_error_logs.model is 'The AI model that was used when the error occurred';
comment on column public.generation_error_logs.source_text_hash is 'Hash of the source text that caused the error';
comment on column public.generation_error_logs.source_text_length is 'Length of the source text in characters (must be between 1000 and 10000)';
comment on column public.generation_error_logs.error_code is 'Error code for categorizing the type of error';
comment on column public.generation_error_logs.error_message is 'Detailed error message describing what went wrong';