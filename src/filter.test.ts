import { describe, expect, it } from 'vitest'
import { FILTERS, countByFilter, filterTasks } from './filter'
import type { Task } from './taskReducer'

function sampleTasks(): Task[] {
  return [
    { id: '1', title: 'Finish the homework.', status: 'todo' },
    { id: '2', title: 'Study React.', status: 'in-progress' },
    { id: '3', title: 'Don\'t sleep.', status: 'done' },
  ]
}

describe('filterTasks', () => {
  it('returns all tasks in insertion order', () => {
    const tasks = sampleTasks()

    expect(filterTasks(tasks, 'all')).toEqual(tasks)
  })

  it('returns only todo tasks', () => {
    const result = filterTasks(sampleTasks(), 'todo')

    expect(result).toEqual([
      { id: '1', title: 'Finish the homework.', status: 'todo' },
    ])
  })

  it('returns only in-progress tasks', () => {
    const result = filterTasks(sampleTasks(), 'in-progress')

    expect(result).toEqual([
      { id: '2', title: 'Study React.', status: 'in-progress' },
    ])
  })

  it('returns only done tasks', () => {
    const result = filterTasks(sampleTasks(), 'done')

    expect(result).toEqual([
      { id: '3', title: 'Don\'t sleep.', status: 'done' },
    ])
  })

  for (const filter of FILTERS) {
    it('handles an empty list with filter ' + filter, () => {
      expect(filterTasks([], filter)).toEqual([])
    })
  }

  it('does not change the original tasks', () => {
    const tasks = sampleTasks()
    const before = structuredClone(tasks)

    filterTasks(tasks, 'done')

    expect(tasks).toEqual(before)
  })
})

describe('countByFilter', () => {
  it('counts every status and the total', () => {
    const result = countByFilter(sampleTasks())

    expect(result).toEqual({
      all: 3,
      todo: 1,
      'in-progress': 1,
      done: 1,
    })
  })

  it('returns zero counts for an empty list', () => {
    expect(countByFilter([])).toEqual({
      all: 0,
      todo: 0,
      'in-progress': 0,
      done: 0,
    })
  })

  it('counts multiple tasks with the same status', () => {
    const tasks: Task[] = [
      { id: '1', title: 'First task', status: 'todo' },
      { id: '2', title: 'Second task', status: 'todo' },
    ]

    expect(countByFilter(tasks)).toEqual({
      all: 2,
      todo: 2,
      'in-progress': 0,
      done: 0,
    })
  })
})