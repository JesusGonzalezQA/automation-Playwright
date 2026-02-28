import { Locator, Page, expect } from '@playwright/test'
import { MeetingModel } from '../../../Fixtures/meeting.model'

export class TeamsPage {
    readonly page: Page

    constructor(page: Page) {
        this.page = page
    }

    async joinMeeting(meeting: MeetingModel) {
        if (!meeting.meetingUrl) {
            throw new Error('meetingUrl is required to join a Teams meeting')
        }
        await this.page.goto(meeting.meetingUrl)
    }

    async joinAsGuest(meeting: MeetingModel) {
        // Click "Continue on this browser" to avoid the Teams desktop app prompt
        const continueOnBrowser = this.page.locator('text=Continue on this browser')
        await continueOnBrowser.waitFor({ state: 'visible', timeout: 10000 }).then(
            () => continueOnBrowser.click(),
            () => { /* element not present, continue */ }
        )

        // Fill in the display name if joining as a guest
        const nameInput = this.page.locator('input[data-tid="prejoin-display-name-input"]')
        await nameInput.waitFor({ state: 'visible', timeout: 10000 }).then(
            () => nameInput.fill(meeting.displayName ?? 'Guest'),
            () => { /* element not present, continue */ }
        )

        // Click "Join now"
        const joinNowBtn = this.page.locator('button[data-tid="prejoin-join-button"]')
        await joinNowBtn.click()
    }

    async shouldBeInMeeting() {
        const callControls = this.page.locator('[data-tid="call-controls-bar"]')
        await expect(callControls).toBeVisible({ timeout: 30000 })
    }
}
