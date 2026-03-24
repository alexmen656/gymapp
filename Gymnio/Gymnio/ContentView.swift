import SwiftUI

struct ContentView: View {
    @EnvironmentObject var store: AppStore
    @State private var selectedTab: Int = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem { Label(store.t("nav.home"), systemImage: "house") }
                .tag(0)

            NavigationStack {
                ExercisesView()
            }
            .tabItem { Label(store.t("nav.exercises"), systemImage: "dumbbell") }
            .tag(1)

            HistoryView()
                .tabItem {
                    Label(store.t("nav.history"),
                          systemImage: "clock.arrow.trianglehead.counterclockwise.rotate.90")
                }
                .tag(2)

            // "Add" tab: intercept selection, show sheet, snap back
            Color.clear
                .tabItem { Label(store.t("nav.add"), systemImage: "plus") }
                .tag(3)
        }
        .onChange(of: selectedTab) { _, newVal in
            if newVal == 3 {
                store.showAddExercise = true
                selectedTab = 0
            }
        }
        .sheet(isPresented: $store.showAddExercise) {
            AddExerciseView().environmentObject(store)
        }
        .preferredColorScheme(store.colorScheme)
    }
}
