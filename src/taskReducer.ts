// Name: İrem AYRANPINAR
// Student Number: 2300005623

import type { Filter } from './filter'
export type Status = 'todo' | 'in-progress' | 'done'
export type Task = { id: string; title: string; status: Status }

export type State = {
  tasks: Task[]
  filter: Filter
  past: Task[][]
}

export const initialState: State = {
  tasks: [],
  filter: 'all',
  past: []
}

export type Action =
  | { type: 'add'; id: string; title: string }
  | { type: 'advance'; id: string }
  | { type: 'remove'; id: string }
  | { type: 'setFilter'; filter: Filter}
  | { type: 'clearDone'}
  | { type: 'undo'}

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
        tasks: [...tasks, { id: action.id, title: action.title, status: 'todo' }],
        past: [...state.past, tasks]
      }

    case 'advance':
      if(!tasks.some((t) => t.id === action.id)) 
        return state
      return{
        ...state,
        tasks: tasks.map((t) => t.id === action.id ? { ...t, status: NEXT[t.status] } : t,),
        past: [...state.past, tasks]
      }

    case 'remove':
      if (!tasks.some((t) => t.id === action.id)) 
        return state
      return {
        ...state,
        tasks: tasks.filter((t) => t.id !== action.id),
        past: [...state.past, tasks],
      }

    case 'setFilter':
      return{
        ...state,
        filter: action.filter
      }

    case 'clearDone':
      if (!tasks.some((t) => t.status === 'done')) 
        return state
      return {
        ...state,
        tasks: tasks.filter((t) => t.status !== 'done'),
        past: [...state.past, tasks]
      }

    case 'undo':
      const previousTasks = state.past.at(-1)

      if (previousTasks === undefined) 
        return state
      return {
        ...state,
        tasks: [...previousTasks],
        past: state.past.slice(0, -1),
      }

    default: 
    {
      const unhandledAction: never = action
      throw new Error('Unhandled action: ' + JSON.stringify(unhandledAction))
    }
  }
}
