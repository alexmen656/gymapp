import SwiftUI

// Centered modal card — matches React Native Modal transparent + GlassCard
struct AddExerciseView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.colorScheme) var scheme

    @State private var name = ""
    @State private var showDuplicate = false
    @FocusState private var isFocused: Bool

    private var isValid: Bool { !name.trimmingCharacters(in: .whitespaces).isEmpty }

    var body: some View {
        GlassCard {
            VStack(alignment: .leading, spacing: 16) {
                Text(store.t("add.title"))
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))

                // Input — matches modalInput style
                TextField(store.t("add.placeholder"), text: $name)
                    .font(.system(size: 16))
                    .autocapitalization(.words)
                    .focused($isFocused)
                    .onSubmit { add() }
                    .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
                    .padding(14)
                    .background(
                        scheme == .dark
                            ? Color(hex: "76768080").opacity(0.16)
                            : Color(hex: "78788014").opacity(0.08)
                    )
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(scheme == .dark
                                    ? Color(hex: "76768040").opacity(0.24)
                                    : Color(hex: "78788026").opacity(0.15),
                                    lineWidth: 0.5)
                    )
                    .cornerRadius(12)

                if showDuplicate {
                    Text(store.t("add.duplicate"))
                        .font(.system(size: 13))
                        .foregroundColor(Color(hex: "FF3B30"))
                }

                // Buttons row — Cancel + Add (prominent)
                HStack(spacing: 12) {
                    Spacer()
                    GlassBtn(store.t("add.cancel")) {
                        store.showAddExercise = false
                    }
                    GlassBtn(store.t("add.button"), prominent: true) {
                        add()
                    }
                    .opacity(isValid ? 1 : 0.5)
                    .disabled(!isValid)
                }
            }
        }
        .onAppear { isFocused = true }
    }

    private func add() {
        let trimmed = name.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }
        if store.exercises.contains(where: { $0.lowercased() == trimmed.lowercased() }) {
            showDuplicate = true
            return
        }
        store.addExercise(trimmed)
        store.showAddExercise = false
    }
}
