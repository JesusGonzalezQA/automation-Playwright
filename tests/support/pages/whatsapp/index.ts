import { Locator, Page, expect } from '@playwright/test'
import { MeetingModel } from '../../../Fixtures/meeting.model'

export class WhatsAppPage {
    readonly page: Page
    readonly searchInput: Locator

    constructor(page: Page) {
        this.page = page
        this.searchInput = page.locator('div[contenteditable="true"][data-tab="3"]')
    }

    async go() {
        await this.page.goto('https://web.whatsapp.com/')
    }

    async waitForLogin() {
        // Wait for the QR code to be scanned or for an already-authenticated session
        await this.page.waitForSelector('div[data-tab="3"]', { timeout: 60000 })
    }

    async openChat(meeting: MeetingModel) {
        await this.searchInput.click()
        await this.searchInput.fill(meeting.contactOrGroup)
        const chatItem = this.page.locator(`span[title="${meeting.contactOrGroup}"]`).first()
        await chatItem.click()
    }

    async startVideoCall() {
        const videoCallBtn = this.page.locator('button[aria-label="Video call"]')
        await videoCallBtn.click()
    }

    async shouldBeInCall() {
        const callScreen = this.page.locator('div[data-testid="call-screen"]')
        await expect(callScreen).toBeVisible({ timeout: 15000 })
    }
}
