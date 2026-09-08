# Security Spec

1. Data Invariants:
- All documents must belong to an organization (`organizationId`).
- A user must be part of the organization to read/write.
- Project members are explicitly assigned. Workers only access projects they are assigned to.
- Users cannot change their own role.
- Only OWNER/ADMIN can manage projects, users, organization.
- Workers can create issues, material requests, progress updates for projects they belong to.
- Workers can update task progress/status for their tasks.

2. Dirty Dozen Payloads:
- (to be implemented in test)
