//
//  GymnioUITests.swift
//  GymnioUITests
//
//  Created by Alex Polan on 3/23/26.
//

import XCTest

// MARK: - App Store Screenshots

@MainActor
final class Pi_DigitsUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        setupSnapshot(app)
    }

    override func tearDownWithError() throws {
        app = nil
    }

    // MARK: 01 – Main Menu
    func testScreenshot01_MainMenu() throws {
        app.launch()
        sleep(4)
        snapshot("01_MainMenu")
    }

    // MARK: 02 – Classic Gameplay
    func testScreenshot02_Gameplay() throws {
        app.launch()
        sleep(4)

        app.buttons["Start"].tap()
        sleep(1)

        app.buttons["1"].tap()
        app.buttons["4"].tap()
        app.buttons["1"].tap()
        sleep(1)
        snapshot("02_Gameplay")
    }

    // MARK: 03 – 10 Seconds Mode
    func testScreenshot03_TimerMode() throws {
        app.launch()
        sleep(4)

        app.buttons["10 Seconds Mode"].tap()
        sleep(1)

        app.buttons["1"].tap()
        app.buttons["4"].tap()
        sleep(1)
        snapshot("03_TimerMode")
    }

    // MARK: 04 – Game Over
    func testScreenshot04_GameOver() throws {
        app.launch()
        sleep(2)

        app.buttons["Start"].tap()
        sleep(1)

        app.buttons["1"].tap()
        app.buttons["4"].tap()
        app.buttons["1"].tap()
        app.buttons["5"].tap()
        app.buttons["9"].tap()
        app.buttons["2"].tap()
        app.buttons["3"].tap()
        sleep(1)

        snapshot("04_GameOver")
    }

    // MARK: 05 – Leaderboard
    func testScreenshot05_Leaderboard() throws {
        app.launch()
        sleep(2)

        app.buttons["Leaderboard"].tap()
        sleep(20)
        snapshot("05_Leaderboard")
    }
}