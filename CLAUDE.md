# What's Your Drink — project rules

## Database (Supabase, shared project `euhuiktqoslmndozqpsr`) — required
- Every table, index, policy, view or function for this app **must end in `_dk`** (lowercase), e.g. `questions_dk`.
- The project is shared with other services (LIMINAL SPACE homepage, Personal Perfume `_pf`). Never create unsuffixed tables and never touch tables without `_dk`.
- Never restore a backup onto this project to fix this app: it rolls back every service. Restore to a new project and copy only the `_dk` tables.
- Schema lives in `supabase/dk.sql` (re-runnable). Current tables: `questions_dk`, `question_options_dk`, `result_types_dk`, `branding_dk`, `submissions_dk`, `referral_visits_dk`, `translations_dk`.
