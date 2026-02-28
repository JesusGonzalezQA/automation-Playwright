import { test } from '@playwright/test'

import { MeetingModel } from './Fixtures/meeting.model'
import { WhatsAppPage } from './support/pages/whatsapp'
import { TeamsPage } from './support/pages/teams'

import data from './Fixtures/meetings.json'

/**
 * WhatsApp Web meeting automation.
 *
 * Before running this test:
 *   1. Make sure you are logged in to WhatsApp Web (or be ready to scan the QR code).
 *   2. Set the contact/group name in tests/Fixtures/meetings.json → "whatsapp.contactOrGroup".
 *
 * Run with: npx playwright test tests/meetings.spec.ts --headed
 */
test.describe('WhatsApp Web - entrar em reunião', () => {
    test('deve iniciar uma videochamada no WhatsApp', async ({ page }) => {
        const meeting = data.whatsapp as MeetingModel
        const whatsAppPage = new WhatsAppPage(page)

        await whatsAppPage.go()
        await whatsAppPage.waitForLogin()
        await whatsAppPage.openChat(meeting)
        await whatsAppPage.startVideoCall()
        await whatsAppPage.shouldBeInCall()
    })
})

/**
 * Microsoft Teams meeting automation.
 *
 * Before running this test:
 *   1. Replace the placeholder URL in tests/Fixtures/meetings.json → "teams.meetingUrl"
 *      with your actual Teams meeting link.
 *   2. Optionally update "teams.displayName" to the name you want to use as a guest.
 *
 * Run with: npx playwright test tests/meetings.spec.ts --headed
 */
test.describe('Microsoft Teams - entrar em reunião', () => {
    test('deve entrar em reunião do Teams como convidado', async ({ page }) => {
        const meeting = data.teams as MeetingModel
        const teamsPage = new TeamsPage(page)

        await teamsPage.joinMeeting(meeting)
        await teamsPage.joinAsGuest(meeting)
        await teamsPage.shouldBeInMeeting()
    })
})
