import SwiftUI

struct AddExerciseView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.dismiss) private var dismiss
    @Environment(\.colorScheme) var scheme

    @State private var name = ""
    @State private var showDuplicate = false
    @FocusState private var isFocused: Bool

    private var isValid: Bool { !name.trimmingCharacters(in: .whitespaces).isEmpty }

    var body: some View {
        ZStack {
            LinearGradient(
                colors: scheme == .dark
                    ? [Color(hex: "0a0a1a"), .black]
                    : [Color(hex: "e8f0fe"), Color(hex: "f0f2f5")],
                startPoint: .top, endPoint: .bottom
            )
            .ignoresSafeArea()

            VStack(spacing: 0) {
                // Handle
                Capsule()
                    .fill(Color.secondary.opacity(0.4))
                    .frame(width: 36, height: 4)
                    .padding(.top, 12)
                    .padding(.bottom, 24)

                // Header
                HStack {
                    Button(store.t("add.cancel")) { dismiss() }
                        .foregroundColor(.statBlue)
                    Spacer()
                    Text(store.t("add.title"))
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
                    Spacer()
                    Button(store.t("add.button")) { add() }
                        .font(.system(size: 17, weight: .semibold))
                        .foregroundColor(isValid ? .statBlue : .statBlue.opacity(0.4))
                        .disabled(!isValid)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 24)

                // Input
                GlassCard {
                    VStack(alignment: .leading, spacing: 8) {
                        TextField(store.t("add.placeholder"), text: $name)
                            .font(.system(size: 18, weight: .medium))
                            .autocapitalization(.words)
                            .focused($isFocused)
                            .onSubmit { add() }
                            .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))

                        if showDuplicate {
                            Text(store.t("add.duplicate"))
                                .font(.system(size: 13))
                                .foregroundColor(Color(hex: "FF3B30"))
                        }
                    }
                }
                .padding(.horizontal, 16)

                Spacer()
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
        dismiss()
    }
}
