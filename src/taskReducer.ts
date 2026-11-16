// Name: İrem AYRANPINAR
// Student Number: 2300005623

import type { Filter } from './filter'
export type Status = 'todo' | 'in-progress' | 'done'
export type Task = { id: string; title: string; status: Status }

export type State = {
  tasks: Task[]
  filter: Filter
}

export const initialState: State = {
  tasks: [],
  filter: 'all',
}

export type Action =
  | { type: 'add'; id: string; title: string }
  | { type: 'advance'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'setFilter'; filter: Filter}
  | { type: 'clearDone'}

const NEXT: Record<Status, Status> = {
  todo: 'in-progress',
  'in-progress': 'done',
  done: 'todo',
}

export function taskReducer(state: State, action: Action): State {
  const tasks = state.tasks

  switch (action.type) {
    case 'add':
      return{ 
        ...state, 
        tasks: [...tasks, { id: action.id, title: action.title, status: 'todo' }]
      }

    case 'advance':
      return{
        ...state,
        tasks: tasks.map((t) => t.id === action.id ? { ...t, status: NEXT[t.status] } : t,)
      }

    case 'remove':
      return {
        ...state,
        tasks: tasks.filter((t) => t.id !== action.id)
      }

    case 'setFilter':
      return{
        ...state,
        filter: action.filter
      }

    case 'clearDone':
      return {
        ...state,
        tasks: tasks.filter((t) => t.status !== 'done')
      }

    default: 
    {
      const unhandledAction: never = action
      throw new Error('Unhandled action: ' + JSON.stringify(unhandledAction))
    }
  }
}
