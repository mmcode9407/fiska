# PostgreSQL database schema - Fiska

## 1. Tables and columns

### users

(This table is managed by Supabase Auth)

- `id` UUID PRIMARY KEY
- `email` VARCHAR(255) NOT NULL UNIQUE
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `encrypted_password` VARCHAR NOT NULL
- `confirmed_at` TIMESTAMP NULL

### flashcards

- `id` BIGSERIAL PRIMARY KEY
- `front` VARCHAR(200) NOT NULL
- `back` VARCHAR(500) NOT NULL
- `source` VARCHAR NOT NULL CHECK (source IN ('ai-full', 'ai-edited', 'manual'))
- `generation_id` BIGINT NULL REFERENCES generations(id) ON DELETE SET NULL
- `user_id` UUID NOT NULL REFERENCES users(id)
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### generations

- `id` BIGSERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id)
- `model` VARCHAR NOT NULL
- `generated_count` INTEGER NOT NULL
- `accepted_unedited_count` INTEGER NULLABLE
- `accepted_edited_count` INTEGER NULLABLE
- `source_text_hash` VARCHAR NOT NULL
- `source_text_length` INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000)
- `generation_duration` INTEGER NOT NULL
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

### generation_error_logs

- `id` BIGSERIAL PRIMARY KEY
- `user_id` UUID NOT NULL REFERENCES users(id)
- `model` VARCHAR NOT NULL
- `source_text_hash` VARCHAR NOT NULL
- `source_text_length` INTEGER NOT NULL CHECK (source_text_length BETWEEN 1000 AND 10000)
- `error_code` VARCHAR(100) NOT NULL
- `error_message` TEXT NOT NULL
- `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
- `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

## 2. Relations between tables

- In the `flashcards` table:
  - `user_id` references `users.id` (many-to-one relationship)
  - `generation_id` references `generations.id` (many-to-one relationship, can be NULL for manual entries)
- In the `generations` table:
  - `user_id` references `users.id` (many-to-one relationship)
- In the `generation_error_logs` table:
  - `user_id` references `users.id` (many-to-one relationship)

## 3. Indexes

- Table `flashcards`:
  - INDEX on column `user_id`
  - INDEX on column `generation_id`
- Table `generations`:
  - INDEX on column `user_id`
- Table `generation_error_logs`:
  - INDEX on column `user_id`

## 4. PostgreSQL rules (RLS - Row Level Security)

For tables `flashcards`, `generations`, and `generation_error_logs`, RLS rules should be enabled to ensure that users can only access their own records, where `user_id` matches the user's identifier from Supabase Auth (e.g., auth.uid() = user_id)

## 5. Additional notes

- All tables include `created_at` and `updated_at` columns with default `CURRENT_TIMESTAMP` setting, which enables automatic tracking of record creation and modification times.
- The schema is designed to be extensible in the future, with the ability to add additional columns or tables to support new functionalities.
- In the `flashcards` table, the `source` column clearly specifies the source of the flashcard, allowing distinction between AI-generated and manually created flashcards.
