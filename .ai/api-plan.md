# REST API Plan

## 1. Resources

- **Users**: Represents registered users.

  - Table: `users`
  - Managed through Supabase Auth; operations such as registration and login may be handled via Supabase or custom endpoints if needed.

- **Flashcards**: Represents educational flashcards.

  - Table: `flashcards`
  - Key fields: `front`, `back`, `source` (enum: 'ai-full', 'ai-edited', 'manual'), `user_id`, `generation_id`, `created_at`, `updated_at`

- **Generations**: Represents AI flashcard generation events.

  - Table: `generations`
  - Key fields: `user_id`, `model`, `generated_count`, `accepted_unedited_count`, `accepted_edited_count`, `source_text_hash`, `source_text_length` (1000–10000), `generation_duration`, `created_at`, `updated_at`

- **Generation Error Logs**: Records errors during AI generation.
  - Table: `generation_error_logs`
  - Used for logging errors encountered during AI flashcard generation.

## 2. Endpoints

### 2.1. Flashcards Endpoints

- **GET `/api/flashcards`**

  - Description: Retrieve a list of flashcards for the authenticated user.
  - Query Parameters: `page`, `limit`, `sort`, `order`, `filter` (e.g., by source or date)
  - Response Payload (JSON):
    ```json
    {
      "data": [
        {
          "id": 1,
          "front": "Example front text",
          "back": "Example back text",
          "source": "manual",
          "created_at": "timestamp",
          "updated_at": "timestamp"
        }
      ],
      "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100
      }
    }
    ```
  - Success Codes: 200 OK
  - Error Codes: 401 Unauthorized

- **GET `/api/flashcards/{id}`**

  - Description: Retrieve a specific flashcard by ID.
  - URL Parameter: `id`
  - Response Payload:
    ```json
    {
      "id": 1,
      "front": "Example front text",
      "back": "Example back text",
      "source": "manual",
      "created_at": "timestamp",
      "updated_at": "timestamp"
    }
    ```
  - Success Codes: 200 OK
  - Error Codes: 401 Unauthorized, 404 Not Found

- **POST `/api/flashcards`**

  - Description: Create one or multiple flashcards (manually or AI-generated).
  - Request Payload:
    ```json
    {
      "flashcards": [
        {
          "front": "Question 1",
          "back": "Answer 1",
          "source": "manual"
        },
        {
          "front": "Question 2",
          "back": "Answer 2",
          "source": "ai-full"
        }
      ]
    }
    ```
  - Response Payload:
    ```json
    {
      "flashcards": [
        { "id": 1, "front": "Question 1", "back": "Answer 1", "source": "manual" },
        { "id": 2, "front": "Question 2", "back": "Answer 2", "source": "ai-full" }
      ]
    }
    ```
  - Validations:
    - `front` maximum length: 200 characters.
    - `back` maximum length: 500 characters.
    - `source` must be one of `ai-full`, `ai-edited`, or `manual`.
    - `generation_id` required for `ai-full` and `ai-edited` sources, must be null for `manual` source.
  - Success Codes: 201 Created
  - Error Codes: 400 for invalid inputs, including validation errors for any flashcard in the array, 401 Unauthorized

- **PUT `/api/flashcards/{id}`**

  - Description: Update an existing flashcard.
  - URL Parameter: `id`
  - Request Payload: Fields to update.
  - Response Payload: Updated flashcard object.
  - Success Codes: 200 OK
  - Error Codes: 400 Bad Request, 401 Unauthorized, 404 Not Found

- **DELETE `/api/flashcards/{id}`**

  - Description: Delete a flashcard.
  - URL Parameter: `id`
  - Response Payload:
    ```json
    {
      "message": "Flashcard deleted successfully"
    }
    ```
  - Success Codes: 200 OK
  - Error Codes: 401 Unauthorized, 404 Not Found

### 2.2. Generations Endpoints

- **POST `/api/generations`**

  - Description: Submit a text input to generate flashcard proposals using AI.
  - Request Payload:
    ```json
    {
      "source_text": "Your input text between 1000 and 10000 characters"
    }
    ```
  - Business Logic:
    - Validate that the text length is between 1000 and 10000 characters.
    - Process the text with an external AI service to generate flashcard proposals.
    - Do not persist the proposals until the user reviews and approves them.
  - Response Payload:
    ```json
    {
      "flashcard_proposals": [
        {
          "generation_id": 123,
          "flashcards_proposals": [{ "front": "Generated Question", "back": "Generated Answer", "source": "ai-full" }],
          "generated_count": 5
        }
      ]
    }
    ```
  - Success Codes: 200 OK (or 202 Accepted for asynchronous processing)
  - Error Codes: 400 Bad Request, 401 Unauthorized, 422 Unprocessable Entity, 500: AI service errors (logs recorded in generation_error_logs)

- **GET `/api/generations`**

  - Description: Retrieve a list of AI generation events for the authenticated user.
  - Query Parameters: `page`, `limit`, etc.
  - Response Payload: List of generation objects with metadata.
  - Success Codes: 200 OK
  - Error Codes: 401 Unauthorized

- **GET `/api/generations/{id}`**

  - Description: Retrieve details of a specific generation event.
  - URL Parameter: `id`
  - Response Payload: Generation details and associated flashcards.
  - Success Codes: 200 OK
  - Error Codes: 401 Unauthorized, 404 Not Found

### 2.3. Generation Error Log Endpoint

- **GET `/api/generation-error-logs`**

  - Description: Retrieve generation error logs for the authenticated user or admin.
  - Response Payload: List of error log objects.
  - Success Codes: 200 OK
  - Error Codes: 401 Unauthorized, 403 Forbidden if access is restricted to admin users

## 3. Authentication and Authorization

- Token-based authentication using Supabase Auth.
- Users authenticate via `/auth/login` or `/auth/register`, receiving a bearer token.
- All endpoints require a valid JWT in the `Authorization` header.
- Role-based access is enforced using Supabase's Row Level Security (RLS):
  - Each query is filtered by `user_id` ensuring that users can only access their own data.
- Endpoints such as flashcards, generations, and generation error logs are protected and only accessible after authentication.
- Rate limiting and other security measures (e.g., HTTPS enforcement, CORS) are applied globally.

## 4. Validation and Business Logic

- **Input Validation:**
  - For `flashcards`:
    - `front` text must be ≤ 200 characters.
    - `back` text must be ≤ 500 characters.
    - `source` must be one of `ai-full`, `ai-edited`, or `manual`.
  - For `generations`:
    - `source_text` must be between 1000 and 10000 characters.
- **Business Logic:**
  - AI Flashcard Generation:
    - Validate input length and process using an external AI service upon POST `/api/generations`.
    - Display loader during processing.
    - Do not persist proposals but record generation metadata (model, generated_count, duration) and send generated flashcards proposals to the user.
  - Flashcard Review:
    - Accept or reject each generated flashcard proposal.
    - Only accepted flashcards proposals are saved.
  - Manual Creation:
    - Users can create flashcards directly via `/api/flashcards` endpoint.
