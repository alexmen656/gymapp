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

    // Home/Dashbaord view
    func testScreenshot01_HomeDashboard() throws {
        launchAppWithDemoData()
        XCTAssertTrue(app.staticTexts[t("Guten Morgen!", "Good morning!")].waitForExistence(timeout: 6))
        snapshot("01_HomeDashboard")
    }

    // Exercise overview
    func testScreenshot02_ExercisesOverview() throws {
        launchAppWithDemoData()
        tapTab(t("Übungen", "Exercises"))
        XCTAssertTrue(app.staticTexts[demoExercise].firstMatch.waitForExistence(timeout: 6))
        snapshot("02_ExercisesOverview")
    }

    // Exercise detail view
    func testScreenshot03_ExerciseDetail() throws {
        launchAppWithDemoData()
        tapTab(t("Übungen", "Exercises"))
        let exercise = app.staticTexts[demoExercise].firstMatch
        XCTAssertTrue(exercise.waitForExistence(timeout: 6))
        exercise.tap()
        XCTAssertTrue(app.buttons[t("Eintrag hinzufügen", "Add Entry")].waitForExistence(timeout: 6))
        snapshot("03_ExerciseDetail")
    }

    // History view
    func testScreenshot04_History() throws {
        launchAppWithDemoData()
        tapTab(t("Verlauf", "History"))
        XCTAssertTrue(app.staticTexts[demoExercise].firstMatch.waitForExistence(timeout: 6))
        snapshot("04_History")
    }

    // Add exercise modal
    func testScreenshot05_AddExerciseModal() throws {
        launchAppWithDemoData()
        tapTab(t("Hinzufügen", "Add"))
        XCTAssertTrue(app.staticTexts[t("Übung hinzufügen", "Add Exercise")].waitForExistence(timeout: 6))
        snapshot("05_AddExerciseModal")
    }

    private var testLanguage: String {
        let lang = ProcessInfo.processInfo.environment["FASTLANE_LANGUAGE"]
            ?? (Locale.preferredLanguages.first ?? "en")
        return lang.hasPrefix("de") ? "de" : "en"
    }

    private var demoExercise: String { t("Bankdrücken", "Bench Press") }

    private func t(_ de: String, _ en: String) -> String {
        testLanguage == "de" ? de : en
    }

    private func launchAppWithDemoData() {
        app.launchArguments += [
            "-ui_testing",
            "-ui_test_seed_demo_data",
            "-ui_test_force_morning",
            "-ui_test_force_tab_bar",
            "-ui_test_language", testLanguage
        ]
        app.launch()
        XCTAssertTrue(app.tabBars.firstMatch.waitForExistence(timeout: 10))
    }

    private func tapTab(_ name: String) {
        let button = app.tabBars.buttons[name]
        XCTAssertTrue(button.waitForExistence(timeout: 2), "Tab '\(name)' not found")
        button.tap()
    }
}