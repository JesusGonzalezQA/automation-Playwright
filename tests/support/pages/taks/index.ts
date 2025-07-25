import { Locator, Page, expect } from "@playwright/test"
import { TaskModel } from "../../../Fixtures/task.model"


export class TaskPage {
    readonly page: Page
    readonly inputTaskname: Locator

    constructor(page: Page) {
        this.page = page
        this.inputTaskname = page.locator('input[class*=InputNewTask]')
    }

    async go() {
        await this.page.goto('http://localhost:8080/')
    }

    async create(task: TaskModel) {
        await this.inputTaskname.fill(task.name)

        await this.page.click('css=button >> text =Create')
    }

    async toggle(taskName: string) {
        const target = this.page.locator(`xpath=//p[text()="${taskName}"]/..//button[contains(@class, "Toggle")]`)
        await target.click()
    }

    async sholdHaveText(taskName: string) {

        const target = this.page.locator(`css=.task-item p >> text=${taskName}`)
        await expect(target).toBeVisible()
    }

    async alertHaveText(text: string) {
        const target = this.page.locator(`.swal2-html-container`)
        await expect(target).toHaveText(text)

    }

    async shlouldBeDone(taskName: string) {
       const target = this.page.getByText(taskName)
       await expect(target).toHaveCSS('text-decoration-line', 'line-through')

    }

}