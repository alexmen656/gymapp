import SwiftUI

struct ContentView: View {
    @EnvironmentObject var store: AppStore
    @State private var selectedTab: Int = 0
    @State private var showSettings = false
    @State private var showCustomizeHome = false

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView(showSettings: $showSettings, showCustomizeHome: $showCustomizeHome)
                .tabItem {
                    Label(store.t("nav.home"), systemImage: "house.fill")
                }
                .tag(0)

            ExercisesView()
                .tabItem {
                    Label(store.t("nav.exercises"), systemImage: "dumbbell.fill")
                }
                .tag(1)

            HistoryView()
                .tabItem {
                    Label(store.t("nav.history"), systemImage: "clock.fill")
                }
                .tag(2)
        }
        .overlay(alignment: .bottomTrailing) {
            AddButton {
                store.showAddExercise = true
            }
            .padding(.trailing, 20)
            .padding(.bottom, 80)
        }
        .sheet(isPresented: $store.showAddExercise) {
            AddExerciseView()
                .environmentObject(store)
        }
        .sheet(isPresented: $showSettings) {
            SettingsView()
                .environmentObject(store)
        }
        .sheet(isPresented: $showCustomizeHome) {
            CustomizeHomeView()
                .environmentObject(store)
        }
        .preferredColorScheme(store.colorScheme)
    }
}

// MARK: - Floating Add Button

struct AddButton: View {
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Image(systemName: "plus")
                .font(.system(size: 22, weight: .bold))
                .foregroundColor(.white)
                .frame(width: 56, height: 56)
                .background(Color.accentColor)
                .clipShape(Circle())
                .shadow(color: .accentColor.opacity(0.4), radius: 8, y: 4)
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AppStore.shared)
}
