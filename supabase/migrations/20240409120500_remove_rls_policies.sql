-- Migration: Remove RLS policies
-- Description: Removes all RLS policies from flashcards, generations and generation_error_logs tables
-- Date: 2024-04-09

-- Remove RLS policies from generations table
drop policy if exists "Users can view only their generations" on generations;
drop policy if exists "Users can create their generations" on generations;
drop policy if exists "Users can update only their generations" on generations;
drop policy if exists "Users can delete only their generations" on generations;
alter table generations disable row level security;

-- Remove RLS policies from flashcards table
drop policy if exists "Users can view only their flashcards" on flashcards;
drop policy if exists "Users can create their flashcards" on flashcards;
drop policy if exists "Users can update only their flashcards" on flashcards;
drop policy if exists "Users can delete only their flashcards" on flashcards;
alter table flashcards disable row level security;

-- Remove RLS policies from generation_error_logs table
drop policy if exists "Users can view only their error logs" on generation_error_logs;
drop policy if exists "Users can create their error logs" on generation_error_logs;
alter table generation_error_logs disable row level security; 