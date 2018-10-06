import SubX from 'subx'
import uuid from 'uuid/v1'
import * as R from 'ramda'

const Todo = new SubX({
  title: '',
  completed: false
})
Todo.create = obj => new Todo({ id: uuid(), ...obj })

const store = SubX.create({
  todos: JSON.parse(global.localStorage.getItem('todomvc-subx-todos') || '[]'),
  visibility: 'all',
  get visibleTodos () {
    if (this.visibility === 'all') {
      return this.todos
    } else if (this.visibility === 'active') {
      return this.todos.filter(todo => !todo.completed)
    } else if (this.visibility === 'completed') {
      return this.todos.filter(todo => todo.completed)
    }
  },
  get areAllDone () {
    return R.all(todo => todo.completed, this.todos)
  },
  get leftCount () {
    return this.todos.filter(todo => !todo.completed).length
  },
  get doneCount () {
    return this.todos.filter(todo => todo.completed).length
  },
  toggleAll () {
    if (this.areAllDone) {
      R.forEach(todo => { todo.completed = false }, this.todos)
    } else {
      R.forEach(todo => { todo.completed = true }, this.todos)
    }
  },
  add (title) {
    title = title.trim()
    if (title !== '') {
      this.todos.push(Todo.create({ title }))
    }
  },
  remove (todo) {
    const index = R.findIndex(t => t.id === todo.id, this.todos)
    this.todos.splice(index, 1)
  },
  edit (todo) {
    todo.cache = todo.title
  },
  doneEdit (todo) {
    delete todo.cache
    todo.title = todo.title.trim()
    if (todo.title === '') {
      this.remove(todo)
    }
  },
  cancelEdit (todo) {
    todo.title = todo.cache
    delete todo.cache
  },
  clearCompleted () {
    R.pipe(
      R.filter(todo => todo.completed),
      R.forEach(todo => this.remove(todo))
    )(this.todos)
  }
})

export default store