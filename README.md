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
- An empty filtered list displays “No tasks here.”
- Undo restores the previous task list.

## State and Components

The application state is managed in `App` using `useReducer`. Data and dispatch are passed to child components through props.

The reducer state contains:

- `tasks`: the current task list.
- `filter`: the selected status filter.
- `past`: previous task lists used by Undo.

The visible list and filter counts are calculated during rendering using `filterTasks` and `countByFilter`. They are not stored separately in state.

Task IDs are generated in the form handler with `crypto.randomUUID()` and passed to the reducer in the add action.

## Tests

The current tests in `src/filter.test.ts` check filtering by each status, handling empty lists, preserving the original tasks, and calculating counts.

## Bonus 1: Undo

My reducer state contains tasks, filter, and past, where past stores previous task lists. Actions that change tasks save the old list, while changing the filter does not add a history entry. Undo restores the most recent task list without changing the selected filter, and the button is disabled when the history is empty.

## Limitations

- Tasks and undo history are lost when the page reloads.
- Task titles cannot be edited after creation.
- Undo is supported, but redo is not.
