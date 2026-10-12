## Errors are returned, not logged

This service is a library: the code that calls it decides what to log and where.

- `local/no-console` — No `console.*` calls in `src/`. Throw an `Error` with a message that says what was wrong, and let the caller log it.
