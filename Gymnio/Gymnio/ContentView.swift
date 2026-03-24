import SwiftUI

struct ContentView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    @State private var selectedTab: Int = 0

    var body: some View {
        ZStack {
            TabView(selection: $selectedTab) {
                HomeView()
                    .tabItem { Label(store.t("nav.home"), systemImage: "house") }
                    .tag(0)

                NavigationStack { ExercisesView() }
                    .tabItem { Label(store.t("nav.exercises"), systemImage: "dumbbell") }
                    .tag(1)

                HistoryView()
                    .tabItem {
                        Label(store.t("nav.history"),
                              systemImage: "clock.arrow.trianglehead.counterclockwise.rotate.90")
                    }
                    .tag(2)

                // Add tab — Color.clear so the tab item registers correctly
                Color.clear
                    .tabItem { Label(store.t("nav.add"), systemImage: "plus") }
                    .tag(3)
            }
            .onChange(of: selectedTab) { _, new in
                if new == 3 {
                    store.showAddExercise = true
                    // Snap back immediately
                    DispatchQueue.main.async { selectedTab = 0 }
                }
            }

            // Centered overlay modal — matches React Native Modal transparent+fade
            if store.showAddExercise {
                Color.black
                    .opacity(scheme == .dark ? 0.55 : 0.35)
                    .ignoresSafeArea()
                    .onTapGesture { store.showAddExercise = false }
                    .transition(.opacity)

                AddExerciseView()
                    .padding(.horizontal, 32)
                    .transition(.opacity.combined(with: .scale(scale: 0.96)))
            }
        }
        .animation(.easeInOut(duration: 0.18), value: store.showAddExercise)
        .preferredColorScheme(store.colorScheme)
    }
}
