import SwiftUI

// MARK: - Color Extension

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default: (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(.sRGB, red: Double(r)/255, green: Double(g)/255, blue: Double(b)/255, opacity: Double(a)/255)
    }

    // Stats colors
    static let statBlue   = Color(hex: "007AFF")
    static let statRed    = Color(hex: "FF6B6B")
    static let statTeal   = Color(hex: "4ECDC4")
    static let goldColor  = Color(hex: "fbbf24")
    static let destructive = Color(hex: "FF3B30")
}

// MARK: - Gradient Background

struct GymGradientBackground: ViewModifier {
    @Environment(\.colorScheme) var scheme

    var colors: [Color] {
        scheme == .dark
            ? [Color(hex: "0a0a1a"), .black]
            : [Color(hex: "e8f0fe"), Color(hex: "f0f2f5")]
    }

    func body(content: Content) -> some View {
        ZStack {
            LinearGradient(colors: colors, startPoint: .top, endPoint: .bottom)
                .ignoresSafeArea()
            content
        }
    }
}

extension View {
    func gymBackground() -> some View {
        self.modifier(GymGradientBackground())
    }
}

// MARK: - Glass Card

struct GlassCard<Content: View>: View {
    var leftAccent: Bool = false
    @ViewBuilder let content: () -> Content

    var body: some View {
        content()
            .padding(16)
            .background(.ultraThinMaterial)
            .clipShape(RoundedRectangle(cornerRadius: 16))
            .overlay(alignment: .leading) {
                if leftAccent {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(Color.statBlue)
                        .frame(width: 4)
                }
            }
    }
}

// MARK: - Screen Title

struct ScreenTitle: View {
    let text: String
    @Environment(\.colorScheme) var scheme

    var body: some View {
        Text(text)
            .font(.system(size: 34, weight: .heavy))
            .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
    }
}

// MARK: - Secondary Text Color

extension Color {
    static var textSecondary: Color { Color(hex: "666666") }
    static var textSecondaryDark: Color { Color(hex: "98989f") }
}

struct SecondaryText: ViewModifier {
    @Environment(\.colorScheme) var scheme
    func body(content: Content) -> some View {
        content.foregroundColor(scheme == .dark ? Color(hex: "98989f") : Color(hex: "666666"))
    }
}

extension View {
    func secondaryText() -> some View { modifier(SecondaryText()) }
}

// MARK: - Glass Circle Button

struct GlassCircleButton: View {
    let icon: String
    let action: () -> Void
    @Environment(\.colorScheme) var scheme

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 18, weight: .medium))
                .foregroundColor(scheme == .dark ? .white : Color(hex: "1a1a1a"))
                .frame(width: 40, height: 40)
                .background(.ultraThinMaterial)
                .clipShape(Circle())
        }
    }
}

// MARK: - Accent Button (Blue filled)

struct AccentButton: View {
    let label: String
    let disabled: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color.statBlue.opacity(disabled ? 0.5 : 1.0))
                .cornerRadius(12)
        }
        .disabled(disabled)
    }
}

// MARK: - Pagination Dots

struct PaginationDots: View {
    let total: Int
    let current: Int
    @Environment(\.colorScheme) var scheme

    var body: some View {
        HStack(spacing: 6) {
            ForEach(0..<total, id: \.self) { i in
                Circle()
                    .fill(i == current
                          ? Color.statBlue
                          : (scheme == .dark
                             ? Color.white.opacity(0.2)
                             : Color.black.opacity(0.2)))
                    .frame(width: 10, height: 10)
            }
        }
    }
}
