
### 1. Logging

- Since Pino logging was causing multiple errors, commented it out temporarily to focus on core functionality. Decided to prioritize on working functionality over perfect logging
- resolving it was consuming crucial debugging time
- Used console.log statements for debugging during development

### 2. Database Design

- Implemented soft deletes with proper relational structure. The idea behind the implmentation was so Users can undo deleted projects similar to how Github 'closes' a project instead of deleting it. 

```typescript
deletedAt: timestamp('deleted_at'),
```

- used UUID primary keys
- Saved email and password in database directly for a simple implementation.

### 3. Authentication Strategy

- Used simple and effective JWT tokens with localStorage 

```typescript
const token = localStorage.getItem('auth_token');

headers: {
    Authorization: `Bearer ${token}`,
},

```
- It provides persistence across browser sessions
- Would implement httpOnly cookies in production for security


## Incomplete / future implementation

- Would have implemented an 'ActionsTable' which would log actions related to any Task (priority change, status change, assignee)
- This would give the user a history of all actions taken and not just the latest updated state of the task
- Adding Users to Projects via email, and assigning users to tasks
- Api-docs missing proper request data 
- Typebox validation pipeline
- Refresh token 
- Improved password logic
- Proper Pino logging


- An example actions table schema :
```typescript

export const actionsTable = pgTable('actions', {
    id: uuid('id').defaultRandom().primaryKey(),
    actionType: actionTypeEnum().notNull(),
    taskId: text('task_id').notNull(),
    userId: text('user_id').notNull(),
    newValue: jsonb('new_value'), 
    description: text('description'),
    createdAt: timestamp('created_at').defaultNow().notNull(),    
    deletedAt: timestamp('deleted_at'),
});
```


## Assumptions Made

1. Assumed PostgreSQL would be running locally on default port
2. Simple JWT without refresh tokens sufficient for demo
3. Basic error notifications adequate for user feedback
5. Mantine's components helpout with responsiveness
6. Prioritized Functionality Over Perfect Architecture
7. Minimal UX decisions taken
