import { expect, test } from '@playwright/test'

import { TaskModel } from './Fixtures/task.model'

import { deleteTaskByhelper, postTask } from './support/helpers'

import { TaskPage } from './support/pages/taks'

test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Ler um livro de TypeScript',
        is_done: false
    }

    await deleteTaskByhelper(request, task.name)

    const tasksPage: TaskPage = new TaskPage(page)

    await tasksPage.go()
    await tasksPage.create(task)
    await tasksPage.sholdHaveText(task.name)

})

test('não deve permitir tarefa duplicada', async ({ page, request }) => {
    const task: TaskModel = {
        name: 'Comprar Ketchup',
        is_done: false
    }

    await deleteTaskByhelper(request, task.name)
    await postTask(request, task)

    const tasksPage: TaskPage = new TaskPage(page)

    await tasksPage.go()
    await tasksPage.create(task)

    await tasksPage.alertHaveText('Task already exists!')
})

test('campo obrigatório', async ({ page, request }) => {
    const task: TaskModel = {
        name: '',
        is_done: false
    }

    const tasksPage: TaskPage = new TaskPage(page)

    await tasksPage.go()
    await tasksPage.create(task)

    const validationMessage = await tasksPage.inputTaskname.evaluate(e => (e as HTMLInputElement).validationMessage)
    expect(validationMessage).toEqual('This is a required field')

    await page.waitForTimeout(3000)
})