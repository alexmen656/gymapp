//
//  GymnioApp.swift
//  Gymnio
//
//  Created by Alex Polan on 3/24/26.
//

import SwiftUI

@main
struct GymnioApp: App {
    @StateObject private var store = AppStore.shared

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(store)
        }
    }
}
