import SwiftUI

struct AddExerciseView: View {
    @EnvironmentObject var store: AppStore
    @Environment(\.dismiss) private var dismiss

    @State private var name = ""
    @State private var showDuplicate = false
    @FocusState private var isFocused: Bool

    private var isValid: Bool { !name.trimmingCharacters(in: .whitespaces).isEmpty }

    var body: some View {
        NavigationStack {
            VStack(spacing: 24) {
                TextField(store.t("add.placeholder"), text: $name)
                    .textFieldStyle(.roundedBorder)
                    .autocapitalization(.words)
                    .focused($isFocused)
                    .onSubmit { add() }
                    .padding(.horizontal)

                if showDuplicate {
                    Text(store.t("add.duplicate"))
                        .foregroundColor(.red)
                        .font(.caption)
                }

                Button(action: add) {
                    Text(store.t("add.button"))
                        .frame(maxWidth: .infinity)
                }
                .buttonStyle(.borderedProminent)
                .disabled(!isValid)
                .padding(.horizontal)

                Spacer()
            }
            .padding(.top, 24)
            .navigationTitle(store.t("add.title"))
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarLeading) {
                    Button(store.t("add.cancel")) { dismiss() }
                }
            }
            .onAppear { isFocused = true }
        }
    }

    private func add() {
        let trimmed = name.trimmingCharacters(in: .whitespaces)
        guard !trimmed.isEmpty else { return }

        let existing = store.exercises.map { $0.lowercased() }
        if existing.contains(trimmed.lowercased()) {
            showDuplicate = true
            return
        }
        store.addExercise(trimmed)
        dismiss()
    }
}
