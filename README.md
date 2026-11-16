# Assignment 3 - Task Manager with a Reducer

Name: İrem AYRANPINAR  
Student number: 2300005623

## About

This is a React and TypeScript task manager built on the provided starter project. It supports adding tasks, advancing their status, deleting tasks, filtering by status, clearing completed tasks, and undoing changes to tasks.

Tasks are stored in memory. Reloading the page resets the tasks, the selected filter, and the undo history.

## Requirements

- Node.js 24
- npm

The project uses React, TypeScript, Vite, and Vitest. Its dependencies are listed in `package.json`.

## Install and Run

Open a terminal in the project folder containing `package.json`, then run:

```sh
npm install
npm run dev
```

Open the local address printed in the terminal.

To check the TypeScript types and create a production build:

```sh
npm run build
```

To run the automated tests:

```sh
npm test
```

## Features

- New tasks start with the `todo` status.
- Next advances a task through `todo`, `in-progress`, `done`, and back to `todo`.
- Delete removes a task.
- The All, To do, In progress, and Done buttons filter the visible tasks.
- Each filter button displays its task count, and the active filter has a different appearance.
- Clear done removes all completed tasks while keeping the selected filter.
- An empty filtered list displays “There is no tasks.”
- Undo restores the previous task list.

## State and Components

The application state is managed in `App` using `useReducer`. Data and dispatch are passed to child components through props.

The reducer state contains:

- `tasks`: the current task list.
- `filter`: the selected status filter.
- `past`: previous task lists used by Undo.

The visible list and filter counts are calculated during rendering using `filterTasks` and `countByFilter`. They are not stored separately in state.

Task IDs are generated in the form handler with `crypto.randomUUID()` and passed to the reducer in the add action.

## Limitations

- Tasks and undo history are lost when the page reloads.
- Task titles cannot be edited after creation.
- Undo is supported, but redo is not.

## Screenshots

- [All](screenshots/filter_all.png)
- [To do](screenshots/filter_todo.png)
- [In progress](screenshots/filter_inprogress.png)
- [Done](screenshots/filter_done.png)

## Bonus 1: Undo

My reducer state contains tasks, filter, and past, where past stores previous task lists. Actions that change tasks save the old list, while changing the filter does not add a history entry. Undo restores the most recent task list without changing the selected filter, and the button is disabled when the history is empty.

## Bonus 2: Tests

I used Vitest to test every reducer action, the three-step status cycle, and undo operations. The tests also check that the reducer does not mutate the previous state and that filter changes are not added to the undo history.

Tests for `filterTasks` and `countByFilter` cover each filter, empty lists, and task counts. Additional edge cases include unknown IDs, clearing when no tasks are done, and counts after deleting a task.

Run the tests with:

```sh
npm test
```

The test output was:

```sh
C:\Users\irem\Desktop\OKUL\Advanced Web Programming\Assignment_3\assignment3>npm test

> task-manager-assignment3@0.0.0 test
> vitest run


 RUN  v5.1.0 C:/Users/irem/Desktop/OKUL/Advanced Web Programming/Assignment_3/assignment3


 ❯ src/taskReducer.test.ts [queued]
 ✓ src/filter.test.ts (12 tests) 6ms
 ✓ src/taskReducer.test.ts (24 tests) 9ms

 Test Files  2 passed (2)
      Tests  36 passed (36)
   Start at  11:53:51
   Duration  639ms (transform 35%, import 30%, worker 28%, tests 6%)


C:\Users\irem\Desktop\OKUL\Advanced Web Programming\Assignment_3\assignment3>npm run build

> task-manager-assignment3@0.0.0 build
> tsc --noEmit && vite build

vite v8.3.8 building client environment for production...
✓ 18 modules transformed.
computing gzip size...
dist/index.html                  0.32 kB │ gzip:  0.23 kB
dist/assets/index-BpmzWYB9.js  222.11 kB │ gzip: 69.54 kB

✓ built in 254ms
```
## Bonus 3: Explain your reducer

A reducer must be pure: the same state and action should produce the same result without changing existing data. React can skip rendering when the returned state has the same reference as before, so mutating an array and returning the original state can leave the screen outdated. Mutation also breaks undo history because an earlier snapshot may share the objects being changed. I use spread syntax, map, and filter to create replacements while preserving previous values.

The caller creates the task ID with crypto.randomUUID() and includes it in the add action. Generating an ID inside the reducer would make identical inputs produce different tasks. Keeping ID generation in the form handler makes the reducer predictable and allows tests to provide fixed IDs. It also keeps repeated reducer calls in development from generating different results.

The visible list and counts are derived from tasks and the selected filter during rendering. Storing separate copies would create several values that must stay synchronized. For example, deleting a completed task could update tasks but leave a separately stored Done count unchanged. Deriving both values from the current tasks avoids this inconsistency.

Compared with a separate useState for the filter, putting it in the reducer state makes related behavior easier to test together. I can check that clearDone and undo preserve the selected filter using only reducer calls. The tradeoff is a larger state object and more action cases. Adding undo also requires distinguishing changes to tasks from filter changes, because only task changes belong in the history.

## Bonus 4: Git repository

https://github.com/Hestiade/assignment3


