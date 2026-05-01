# Implementation Plan: Talent Dashboard Backend Integration

## Overview

This implementation plan converts the design for backend integration into actionable coding tasks. The plan follows a phased approach: Foundation (API client, environment config, types) → Core Composables (profile, applications, bookings, invitations) → Secondary Composables (events, reviews, settings) → Testing & Cleanup.

Each task builds incrementally, ensuring that code is integrated and tested at each step. Property-based tests are not included as this feature focuses on API integration, HTTP client logic, and UI data binding — domains better suited to integration and unit tests.

---

## Tasks

### Phase 1: Foundation

- [x] 1. Set up environment configuration and runtime config
  - Add `NUXT_PUBLIC_API_BASE` to `.env` file with default value `https://api.caritalent.id/api/v1`
  - Update `nuxt.config.ts` to expose `apiBase` via `runtimeConfig.public`
  - Verify runtime config is accessible via `useRuntimeConfig().public.apiBase`
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Create API client abstraction layer
  - [x] 2.1 Implement `app/utils/api-client.ts` with `ApiError` class and `createApiClient` function
    - Create `ApiError` class with `message`, `statusCode`, and `data` properties
    - Implement `createApiClient()` that returns methods: `get`, `post`, `put`, `delete`
    - Inject `Authorization: Bearer {token}` header when `auth_token` cookie exists
    - Use `useRuntimeConfig().public.apiBase` as `baseURL` for all requests
    - _Requirements: 1.3, 2.1, 2.2_
  
  - [x] 2.2 Implement error handling in API client
    - Handle HTTP 401: clear `auth_token` cookie and redirect to `/login`
    - Handle HTTP 403: throw `ApiError` with "Access denied" message
    - Handle HTTP 404: throw `ApiError` with "Resource not found" message
    - Handle HTTP 422: throw `ApiError` with validation errors from `response.errors`
    - Handle HTTP 500+: throw `ApiError` with generic server error message
    - Handle network errors: throw `ApiError` with connection error message
    - _Requirements: 2.4, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  
  - [x] 2.3 Create `useApiClient` composable wrapper
    - Export `useApiClient()` that calls `createApiClient()`
    - Ensure composable can be used in other composables and components
    - _Requirements: 2.1, 2.2_

- [x] 3. Update type definitions for API integration
  - Add `ApiErrorResponse` type to `app/composables/types.ts`
  - Add `UpdateProfilePayload` type for profile updates
  - Add `ChangePasswordPayload` type for password changes
  - Add `RespondToInvitationPayload` type for invitation responses
  - Add `UploadMediaPayload` type for media uploads
  - Verify all existing types (`ApiResponse`, `TalentProfile`, `Application`, `Booking`, `Invitation`, `Event`, `TalentReviewItem`) are compatible with API responses
  - _Requirements: 3.3, 9.1, 9.3, 6.3_

- [x] 4. Checkpoint - Verify foundation setup
  - Ensure all tests pass, ask the user if questions arise.

---

### Phase 2: Core Composables

- [x] 5. Migrate `useProfile` composable to real API
  - [x] 5.1 Implement dual endpoint fetch for user and talent data
    - Call `GET /auth/me` using `api.get<{ user: User }>('/auth/me')`
    - Extract `talent_id` from user data
    - Call `GET /talents/{talent_id}` using `api.get<{ talent: Talent }>(\`/talents/\${talent_id}\`)`
    - Combine both responses into `TalentProfile` type
    - _Requirements: 3.1, 3.2, 3.3_
  
  - [x] 5.2 Implement error handling for `useProfile`
    - Handle case when either endpoint fails
    - Return error state with message from `ApiResponse.message`
    - Expose `data`, `pending`, `error`, and `refresh` to components
    - _Requirements: 3.4, 3.5_
  
  - [ ]* 5.3 Write unit tests for `useProfile`
    - Test successful dual fetch and data merging
    - Test error handling when `GET /auth/me` fails
    - Test error handling when `GET /talents/{id}` fails
    - Test authentication token injection
    - _Requirements: 3.1, 3.2, 3.4_

- [x] 6. Migrate `useApplications` composable to real API
  - [x] 6.1 Implement `GET /applications/my` endpoint call
    - Use `useAsyncData` with key `'talent-applications'`
    - Call `api.get<{ applications: Application[] }>('/applications/my')`
    - Return `response.data.applications` as array
    - Handle empty array case without error
    - _Requirements: 4.1, 4.2, 4.3_
  
  - [x] 6.2 Implement error handling for `useApplications`
    - Handle network errors and HTTP 4xx/5xx responses
    - Expose `data`, `pending`, `error`, and `refresh`
    - _Requirements: 4.4, 4.5_
  
  - [ ]* 6.3 Write unit tests for `useApplications`
    - Test successful fetch with populated data
    - Test successful fetch with empty array
    - Test error handling for failed requests
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 7. Migrate `useBookings` composable to real API
  - [x] 7.1 Implement `GET /bookings/my` endpoint call
    - Use `useAsyncData` with key `'talent-bookings'`
    - Call `api.get<{ bookings: Booking[] }>('/bookings/my')`
    - Return `response.data.bookings` as array
    - Handle empty array case without error
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [x] 7.2 Implement error handling for `useBookings`
    - Handle network errors and HTTP 4xx/5xx responses
    - Expose `data`, `pending`, `error`, and `refresh`
    - _Requirements: 5.4, 5.5_
  
  - [ ]* 7.3 Write unit tests for `useBookings`
    - Test successful fetch with populated data
    - Test successful fetch with empty array
    - Test error handling for failed requests
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

- [x] 8. Migrate `useInvitations` composable to real API
  - [x] 8.1 Implement `GET /invitations/my` endpoint call
    - Use `useAsyncData` with key `'talent-invitations'`
    - Call `api.get<{ invitations: Invitation[] }>('/invitations/my')`
    - Return `response.data.invitations` as array
    - _Requirements: 6.1, 6.2_
  
  - [x] 8.2 Implement `respondToInvitation` action method
    - Create async function `respondToInvitation(id: number, status: 'accepted' | 'rejected')`
    - Call `api.put(\`/invitations/\${id}/respond\`, { status })`
    - Update local state optimistically after successful response
    - Call `refresh()` to sync with server state
    - _Requirements: 6.3, 6.4_
  
  - [x] 8.3 Implement error handling for `useInvitations`
    - Handle errors in `respondToInvitation` and preserve previous state
    - Expose `data`, `pending`, `error`, `refresh`, and `respondToInvitation`
    - _Requirements: 6.5, 6.6_
  
  - [ ]* 8.4 Write unit tests for `useInvitations`
    - Test successful fetch of invitations
    - Test `respondToInvitation` with 'accepted' status
    - Test `respondToInvitation` with 'rejected' status
    - Test error handling when response fails
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 9. Checkpoint - Verify core composables integration
  - Ensure all tests pass, ask the user if questions arise.

---

### Phase 3: Secondary Composables

- [x] 10. Migrate `useEvents` composable to real API
  - [x] 10.1 Implement `GET /events` endpoint call with filters
    - Accept parameters: `status`, `genre`, `city`, `search`, `page`
    - Use `useAsyncData` with dynamic key based on filter params
    - Call `api.get<{ events: Event[], pagination: PaginationMeta }>('/events', queryParams)`
    - Return `response.data.events` and `response.data.pagination`
    - _Requirements: 7.1, 7.2, 7.4_
  
  - [x] 10.2 Implement pagination support for `useEvents`
    - Expose `pagination` metadata from API response
    - Support page navigation via query parameters
    - _Requirements: 7.3_
  
  - [x] 10.3 Implement error handling for `useEvents`
    - Handle network errors and HTTP 4xx/5xx responses
    - Expose `data`, `pagination`, `pending`, `error`, and `refresh`
    - _Requirements: 7.5, 7.6_
  
  - [ ]* 10.4 Write unit tests for `useEvents`
    - Test successful fetch without filters
    - Test successful fetch with multiple filters
    - Test pagination metadata exposure
    - Test error handling for failed requests
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 11. Migrate `useTalentReviews` composable to real API
  - [x] 11.1 Implement `GET /talents/{talent_id}/reviews` endpoint call
    - Accept `talent_id` as parameter (from `useProfile`)
    - Use `useAsyncData` with key `'talent-reviews-{talent_id}'`
    - Call `api.get<TalentReviewsData>(\`/talents/\${talent_id}/reviews\`)`
    - Return `response.data.reviews`, `averageRating`, `totalReviews`, `stageName`, `pagination`
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [x] 11.2 Handle dependency on `talent_id` availability
    - Defer API call until `talent_id` is available from profile
    - Use `watch` or conditional execution in `useAsyncData`
    - _Requirements: 8.4_
  
  - [x] 11.3 Implement error handling for `useTalentReviews`
    - Handle network errors and HTTP 4xx/5xx responses
    - Expose `data`, `meta`, `pending`, `error`, and `refresh`
    - _Requirements: 8.5, 8.6_
  
  - [ ]* 11.4 Write unit tests for `useTalentReviews`
    - Test successful fetch with reviews data
    - Test metadata exposure (averageRating, totalReviews, stageName)
    - Test deferred execution when `talent_id` is not available
    - Test error handling for failed requests
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 12. Migrate `useProfileSettings` composable to real API
  - [x] 12.1 Implement `updateProfile` action method
    - Create async function `updateProfile(payload: { name: string, phone: string })`
    - Call `api.put('/users/profile', payload)`
    - Return `ApiResponse` with updated profile data
    - Handle HTTP 422 validation errors with field-specific messages
    - _Requirements: 9.1, 9.2, 9.5_
  
  - [x] 12.2 Implement `changePassword` action method
    - Create async function `changePassword(payload: ChangePasswordPayload)`
    - Call `api.put('/users/password', payload)`
    - Return `ApiResponse` with success confirmation
    - Handle HTTP 422 validation errors with field-specific messages
    - _Requirements: 9.3, 9.4, 9.5_
  
  - [x] 12.3 Implement `uploadMedia` action method
    - Create async function `uploadMedia(payload: { file: File, type: string })`
    - Call `api.post(\`/talents/\${talent_id}/media\`, formData)` with `multipart/form-data`
    - Return `ApiResponse` with uploaded media data
    - _Requirements: 9.6_
  
  - [x] 12.4 Implement `deleteMedia` action method
    - Create async function `deleteMedia(talent_id: number, media_id: number)`
    - Call `api.delete(\`/talents/\${talent_id}/media/\${media_id}\`)`
    - Return `ApiResponse` with success confirmation
    - _Requirements: 9.7_
  
  - [ ]* 12.5 Write unit tests for `useProfileSettings`
    - Test `updateProfile` with valid payload
    - Test `updateProfile` with validation errors (HTTP 422)
    - Test `changePassword` with valid payload
    - Test `changePassword` with validation errors (HTTP 422)
    - Test `uploadMedia` with file upload
    - Test `deleteMedia` with media ID
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

- [x] 13. Checkpoint - Verify secondary composables integration
  - Ensure all tests pass, ask the user if questions arise.

---

### Phase 4: Testing & Cleanup

- [x] 14. Remove mock dependencies from all composables
  - [x] 14.1 Remove `useMockResource` imports from `useProfile`
    - Delete import statement for `useMockResource`
    - Verify no references to mock data remain
    - _Requirements: 11.1_
  
  - [x] 14.2 Remove `useMockResource` imports from `useApplications`
    - Delete import statement for `useMockResource`
    - Verify no references to mock data remain
    - _Requirements: 11.2_
  
  - [x] 14.3 Remove `useMockResource` imports from `useBookings`
    - Delete import statement for `useMockResource`
    - Verify no references to mock data remain
    - _Requirements: 11.3_
  
  - [x] 14.4 Remove `useMockResource` imports from `useInvitations`
    - Delete import statement for `useMockResource`
    - Verify no references to mock data remain
    - _Requirements: 11.4_
  
  - [x] 14.5 Remove `useMockResource` imports from `useEvents`
    - Delete import statement for `useMockResource`
    - Verify no references to mock data remain
    - _Requirements: 11.5_
  
  - [x] 14.6 Remove `useMockResource` imports from `useTalentReviews`
    - Delete import statement for `useMockResource`
    - Verify no references to mock data remain
    - _Requirements: 11.6_

- [ ] 15. Run TypeScript type check and fix any errors
  - Run `nuxi typecheck` to verify all types are correct
  - Fix any type errors related to API integration changes
  - Ensure all composables return correct types
  - _Requirements: 11.7_

- [ ]* 16. Write integration tests for complete user flows
  - Test complete flow: login → view profile → view applications
  - Test complete flow: login → browse events → view event details
  - Test complete flow: login → view invitations → respond to invitation
  - Test complete flow: login → view bookings → check booking details
  - Test error flow: expired token → redirect to login
  - _Requirements: 2.4, 10.3, 10.4, 10.5, 10.6_

- [ ] 17. Final checkpoint - Verify all integration is complete
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all composables use real API calls
  - Verify no mock data remains in codebase
  - Verify error handling works consistently across all composables
  - Verify authentication flow works end-to-end

---

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation and provide opportunities for user feedback
- All composables follow the same pattern: `useAsyncData` → API call → error handling → expose state
- TypeScript type safety is maintained throughout the implementation
- Authentication is handled automatically by the API client layer
- Error messages are user-friendly and actionable
