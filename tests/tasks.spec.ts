import { expect, test } from '@playwright/test'

import { TaskModel } from './Fixtures/task.model'
import { deleteTaskByhelper, postTask } from './support/helpers'
import { TaskPage } from './support/pages/taks'

import data from './fixtures/tasks.json'

test.describe('cadastro', () => {
    test('deve poder cadastrar uma nova tarefa', async ({ page, request }) => {
        const task = data.success as TaskModel
        await deleteTaskByhelper(request, task.name)
        const tasksPage: TaskPage = new TaskPage(page)
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.sholdHaveText(task.name)

    })

    test('não deve permitir tarefa duplicada', async ({ page, request }) => {
        const task = data.duplicate as TaskModel
        await deleteTaskByhelper(request, task.name)
        await postTask(request, task)
        const tasksPage: TaskPage = new TaskPage(page)
        await tasksPage.go()
        await tasksPage.create(task)
        await tasksPage.alertHaveText('Task already exists!')
    })

    test('campo obrigatório', async ({ page, request }) => {
        const task = data.required as TaskModel
        const tasksPage: TaskPage = new TaskPage(page)
        await tasksPage.go()
        await tasksPage.create(task)
        const validationMessage = await tasksPage.inputTaskname.evaluate(e => (e as HTMLInputElement).validationMessage)
        expect(validationMessage).toEqual('This is a required field')

        await page.waitForTimeout(3000)
    })

})

test.describe('atualização', () => {
    test('deve concliuir uma tarefa', async ({ page, request }) => {
        const task = data.update as TaskModel
        await deleteTaskByhelper(request, task.name)
        await postTask(request, task)
        const tasksPage: TaskPage = new TaskPage(page)
        await tasksPage.go()
        await tasksPage.toggle(task.name)
        await tasksPage.shlouldBeDone(task.name)
    })
})





