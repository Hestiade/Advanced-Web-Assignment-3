// STARTING POINT: the sample Task Manager (state in App with useReducer, passed down as props).
// Assignment 3: change the state shape, add actions, add a filter bar (see the handout).
import { useReducer } from 'react'
import { initialState, taskReducer, type Action, type Task } from './taskReducer'
import { FILTERS, countByFilter, filterTasks, type Filter } from './filter'
import TaskRow from './TaskRow'
import type { Dispatch } from 'react'

const FILTER_NAMES: Record<Filter, string> = {
  all: 'All',
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
}

function AddForm({ dispatch }: { dispatch: Dispatch<Action> }) {
  function addTask(formData: FormData) {
    const title = String(formData.get('title') ?? '').trim()
    if (title) dispatch({ type: 'add', id: crypto.randomUUID(), title })
  }
  return (
    <form action={addTask}>
      <input name="title" placeholder="New task" />
      <button type="submit">Add</button>
    </form>
  )
}

function TaskList({ tasks, dispatch }: { tasks: Task[]; dispatch: Dispatch<Action> }) {
  if (tasks.length === 0) {
  return <p>There is no tasks.</p>
  }

  return (
    <ul>
      {tasks.map((t) => (
        <TaskRow
          key={t.id}
          task={t}
          onNext={() => dispatch({ type: 'advance', id: t.id })}
          onDelete={() => dispatch({ type: 'remove', id: t.id })}
        />
      ))}
    </ul>
  )
}

export default function App() {
  const [state, dispatch] = useReducer(taskReducer, initialState)

  const visibleTasks = filterTasks(state.tasks, state.filter)
  const counts = countByFilter(state.tasks)

  return (
    <main>
      <h1>Task Manager</h1>
      <AddForm dispatch={dispatch} />

      <div>
        {FILTERS.map((filter) => (
          <button
            key={filter}
            type="button"
            aria-pressed={state.filter === filter}
            onClick={() => dispatch({ type: 'setFilter', filter })}
            style={{
              backgroundColor: state.filter === filter ? '#2459ac' : 'white',
              color: state.filter === filter ? 'white' : 'black',
            }}
          >
            {FILTER_NAMES[filter]} ({counts[filter]})
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={counts.done === 0}
        onClick={() => dispatch({ type: 'clearDone' })}
      >
        Clear done
      </button>

      <TaskList tasks={visibleTasks} dispatch={dispatch} />
    </main>
  )
}
