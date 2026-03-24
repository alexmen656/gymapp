//
//  GymnioUITests.swift
//  GymnioUITests
//
//  Created by Alex Polan on 3/24/26.
//

import XCTest

@MainActor
final class GymnioUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUpWithError() throws {
        continueAfterFailure = false
        app = XCUIApplication()
        setupSnapshot(app)
    }

    override func tearDownWithError() throws {
        app = nil
    }

    // MARK: - Screenshot Tests

    func testScreenshot01_HomeDashboard() throws {
        launchAppWithDemoData()
        XCTAssertTrue(app.staticTexts["Guten Morgen!"].waitForExistence(timeout: 6))
        snapshot("01_HomeDashboard")
    }

    func testScreenshot02_ExercisesOverview() throws {
        launchAppWithDemoData()
        tapTab(["Übungen", "Exercises"])
        XCTAssertTrue(app.staticTexts["Bankdruecken"].firstMatch.waitForExistence(timeout: 6))
        snapshot("02_ExercisesOverview")
    }

    func testScreenshot03_ExerciseDetail() throws {
        launchAppWithDemoData()
        tapTab(["Übungen", "Exercises"])

        let exercise = app.staticTexts["Bankdruecken"].firstMatch
        XCTAssertTrue(exercise.waitForExistence(timeout: 6))
        exercise.tap()

        XCTAssertTrue(app.buttons["Eintrag hinzufügen"].waitForExistence(timeout: 6) || app.buttons["Add Entry"].waitForExistence(timeout: 1))
        snapshot("03_ExerciseDetail")
    }

    func testScreenshot04_History() throws {
        launchAppWithDemoData()
        tapTab(["Verlauf", "History"])
        XCTAssertTrue(app.staticTexts["Bankdruecken"].firstMatch.waitForExistence(timeout: 6))
        snapshot("04_History")
    }

    func testScreenshot05_AddExerciseModal() throws {
        launchAppWithDemoData()
        tapTab(["Hinzufügen", "Add"])
        XCTAssertTrue(app.staticTexts["Übung hinzufügen"].waitForExistence(timeout: 6) || app.staticTexts["Add Exercise"].waitForExistence(timeout: 1))
        snapshot("05_AddExerciseModal")
    }

    // MARK: - Helpers

    private func launchAppWithDemoData() {
        app.launchArguments += [
            "-ui_testing",
            "-ui_test_seed_demo_data",
            "-ui_test_language",
            "de"
        ]
        app.launch()
        XCTAssertTrue(app.tabBars.firstMatch.waitForExistence(timeout: 10))
    }

    private func tapTab(_ names: [String]) {
        for name in names {
            let button = app.tabBars.buttons[name]
            if button.waitForExistence(timeout: 2) {
                button.tap()
                return
            }
        }
        XCTFail("Could not find tab button. Tried: \(names)")
    }
}