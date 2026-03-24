import SwiftUI

struct ContentView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme
    @State private var selectedTab: Int = 0

    var body: some View {
        ZStack {
            TabView(selection: $selectedTab) {
                Tab(store.t("nav.home"), systemImage: "house", value: 0) {
                    HomeView()
                }

                Tab(store.t("nav.exercises"), systemImage: "dumbbell", value: 1) {
                    NavigationStack { ExercisesView() }
                }

                Tab(store.t("nav.history"), systemImage: "clock.arrow.trianglehead.counterclockwise.rotate.90", value: 2) {
                    HistoryView()
                }

                Tab(store.t("nav.add"), systemImage: "plus", value: 3, role: .search) {
                    Color.clear
                }
            }
            .onChange(of: selectedTab) { _, new in
                if new == 3 {
                    store.showAddExercise = true
                    DispatchQueue.main.async { selectedTab = 0 }
                }
            }

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
