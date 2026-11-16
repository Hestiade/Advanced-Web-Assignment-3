import { describe, expect, it } from 'vitest'
import { initialState, taskReducer } from './taskReducer'
import type { Action, State } from './taskReducer'
import { countByFilter } from './filter'

function sampleState(): State {
  return {
    tasks: [
        { id: '1', title: 'Finish the homework.', status: 'todo' },
        { id: '2', title: 'Study React.', status: 'in-progress' },
        { id: '3', title: 'Don\'t sleep.', status: 'done' },
    ],
    filter: 'all',
    past: [],
  }
}

describe('taskReducer', () => {
  it('starts with no tasks, all selected, and empty history', () => {
    expect(initialState).toEqual({ tasks: [], filter: 'all', past: [] })
  })

  it('adds a todo task and saves the previous list', () => {
    const before = sampleState()
    const after = taskReducer(before, { type: 'add', id: '4', title: 'New task' })
    expect(after.tasks.at(-1)).toEqual({ id: '4', title: 'New task', status: 'todo' })
    expect(after.tasks.map((task) => task.id)).toEqual(['1', '2', '3', '4'])
    expect(after.past).toEqual([before.tasks])
    expect(after.filter).toBe(before.filter)
  })

  it('advances only the matching task, using a new task object', () => {
    const before = sampleState()
    const after = taskReducer(before, { type: 'advance', id: '1' })
    expect(after.tasks[0]?.status).toBe('in-progress')
    expect(after.tasks[0]).not.toBe(before.tasks[0])
    expect(after.tasks[1]).toBe(before.tasks[1])
    expect(after.tasks).not.toBe(before.tasks)
    expect(after.past).toEqual([before.tasks])
  })

  it('returns to todo after three advances', () => {
    let state = sampleState()
    for (let step = 0; step < 3; step += 1) {
      state = taskReducer(state, { type: 'advance', id: '1' })
    }
    expect(state.tasks[0]?.status).toBe('todo')
    expect(state.past).toHaveLength(3)
  })

  it('removes a task and updates derived counts', () => {
    const before = sampleState()
    const after = taskReducer(before, { type: 'remove', id: '2' })
    expect(after.tasks.map((task) => task.id)).toEqual(['1', '3'])
    expect(after.past).toEqual([before.tasks])
    expect(countByFilter(after.tasks)).toEqual({
      all: 2, todo: 1, 'in-progress': 0, done: 1,
    })
  })

  it('changes the filter without changing tasks or adding history', () => {
    const before = sampleState()
    const after = taskReducer(before, { type: 'setFilter', filter: 'done' })
    expect(after.filter).toBe('done')
    expect(after.tasks).toBe(before.tasks)
    expect(after.past).toBe(before.past)
  })

  it('clears all done tasks and keeps the selected filter', () => {
    const before: State = { ...sampleState(), filter: 'done' }
    before.tasks.push({ id: '4', title: 'Another completed task', status: 'done' })
    const after = taskReducer(before, { type: 'clearDone' })
    expect(after.tasks.map((task) => task.id)).toEqual(['1', '2'])
    expect(after.filter).toBe('done')
    expect(after.past).toEqual([before.tasks])
  })

  it('undoes clearDone without undoing a later filter change', () => {
    const before = sampleState()
    const cleared = taskReducer(before, { type: 'clearDone' })
    const filtered = taskReducer(cleared, { type: 'setFilter', filter: 'done' })
    const restored = taskReducer(filtered, { type: 'undo' })
    expect(restored.tasks).toEqual(before.tasks)
    expect(restored.filter).toBe('done')
    expect(restored.past).toEqual([])
  })

  const undoableActions: Action[] = [
    { type: 'add', id: '4', title: 'New task' },
    { type: 'advance', id: '1' },
    { type: 'remove', id: '2' },
    { type: 'clearDone' },
  ]

  for (const action of undoableActions) {
    it('can undo ' + action.type, () => {
      const before = sampleState()
      const changed = taskReducer(before, action)
      const restored = taskReducer(changed, { type: 'undo' })
      expect(restored).toEqual(before)
    })
  }

  it('does nothing when there is nothing to undo', () => {
    expect(taskReducer(initialState, { type: 'undo' })).toBe(initialState)
  })

  it('supports several undo operations in reverse order', () => {
    const first = taskReducer(initialState, { type: 'add', id: '1', title: 'First' })
    const second = taskReducer(first, { type: 'add', id: '2', title: 'Second' })
    const once = taskReducer(second, { type: 'undo' })
    const twice = taskReducer(once, { type: 'undo' })
    expect(once.tasks.map((task) => task.id)).toEqual(['1'])
    expect(twice).toEqual(initialState)
  })

  const unknownIdActions: Action[] = [
    { type: 'advance', id: 'missing' },
    { type: 'remove', id: 'missing' },
  ]

  for (const action of unknownIdActions) {
    it('ignores an unknown id for ' + action.type + ' without adding history', () => {
      const before = sampleState()
      expect(taskReducer(before, action)).toBe(before)
    })
  }

  it('does not add history when clearDone finds no done tasks', () => {
    const before: State = {
      tasks: [{ id: '1', title: 'Finis the homework.', status: 'todo' }],
      filter: 'todo',
      past: [],
    }
    expect(taskReducer(before, { type: 'clearDone' })).toBe(before)
  })

  it('handles clearDone on an empty list', () => {
    expect(taskReducer(initialState, { type: 'clearDone' })).toBe(initialState)
  })

  const allActions: Action[] = [
    { type: 'add', id: '4', title: 'New task' },
    { type: 'advance', id: '1' },
    { type: 'remove', id: '2' },
    { type: 'setFilter', filter: 'done' },
    { type: 'clearDone' },
    { type: 'undo' },
  ]

  for (const action of allActions) {
    it('does not mutate the old state for ' + action.type, () => {
      const before = sampleState()
      before.past = [[{ id: 'old', title: 'Earlier task', status: 'todo' }]]
      const copy = structuredClone(before)
      taskReducer(before, action)
      expect(before).toEqual(copy)
    })
  }
})