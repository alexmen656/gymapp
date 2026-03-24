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

    // Matching Colors.ts exactly
    static let statBlue   = Color(hex: "007AFF")  // tint light
    static let statBlueDark = Color(hex: "0A84FF") // tint dark
    static let statRed    = Color(hex: "FF6B6B")
    static let statTeal   = Color(hex: "4ECDC4")
    static let goldColor  = Color(hex: "fbbf24")
    static let gymDestructive = Color(hex: "FF3B30")
}

// MARK: - Accent color helper

extension Color {
    static func tint(_ scheme: ColorScheme) -> Color {
        scheme == .dark ? .statBlueDark : .statBlue
    }
}

// MARK: - Gradient Background  (matches gradientStart/gradientEnd from Colors.ts)

struct GymGradientBackground: ViewModifier {
    @Environment(\.colorScheme) var scheme

    func body(content: Content) -> some View {
        ZStack {
            LinearGradient(
                colors: scheme == .dark
                    ? [Color(hex: "0a0a1a"), Color.black]
                    : [Color(hex: "e8f0fe"), Color(hex: "f0f2f5")],
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            content
        }
    }
}

extension View {
    func gymBackground() -> some View { modifier(GymGradientBackground()) }
}

// MARK: - GlassCard  (matches expo-glass-effect GlassView with correct rgba values)

struct GlassCard<Content: View>: View {
    var leftAccent: Bool = false
    @Environment(\.colorScheme) var scheme
    @ViewBuilder let content: () -> Content

    // Light: rgba(255,255,255,0.45)   Dark: rgba(255,255,255,0.06)  — from Colors.ts
    var fillColor: Color {
        scheme == .dark
            ? Color.white.opacity(0.06)
            : Color.white.opacity(0.45)
    }
    // Border: light rgba(255,255,255,0.8)  dark rgba(255,255,255,0.08)
    var strokeColor: Color {
        scheme == .dark
            ? Color.white.opacity(0.08)
            : Color.white.opacity(0.8)
    }

    var body: some View {
        content()
            .padding(16)
            .background {
                RoundedRectangle(cornerRadius: 16, style: .continuous)
                    .fill(.ultraThinMaterial)
                    .overlay {
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .fill(fillColor)
                    }
                    .overlay {
                        RoundedRectangle(cornerRadius: 16, style: .continuous)
                            .stroke(strokeColor, lineWidth: 0.5)
                    }
            }
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .overlay(alignment: .leading) {
                if leftAccent {
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(.tint)
                        .frame(width: 4)
                }
            }
    }
}

// MARK: - Screen Title (fontSize 34, fontWeight 800)

struct ScreenTitle: View {
    let text: String
    @Environment(\.colorScheme) var scheme

    var body: some View {
        Text(text)
            .font(.system(size: 34, weight: .heavy))
            .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
    }
}

// MARK: - Secondary text color helper

struct SecondaryText: ViewModifier {
    @Environment(\.colorScheme) var scheme
    func body(content: Content) -> some View {
        content.foregroundColor(scheme == .dark ? Color(hex: "98989f") : Color(hex: "666666"))
    }
}
extension View { func secondaryText() -> some View { modifier(SecondaryText()) } }

// MARK: - Glass Circle Button (settings button, 40×40)

struct GlassCircleButton: View {
    let icon: String
    let action: () -> Void
    @Environment(\.colorScheme) var scheme

    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 18, weight: .medium))
                .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
                .frame(width: 40, height: 40)
                .background {
                    Circle()
                        .fill(.ultraThinMaterial)
                        .overlay {
                            Circle().fill(scheme == .dark
                                          ? Color.white.opacity(0.06)
                                          : Color.white.opacity(0.45))
                        }
                }
        }
    }
}

// MARK: - Accent Button (blue filled, matches saveButton style)

struct AccentButton: View {
    let label: String
    let disabled: Bool
    let action: () -> Void
    @Environment(\.colorScheme) var scheme

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .padding(.horizontal, 24)
                .background(Color.tint(scheme).opacity(disabled ? 0.5 : 1.0))
                .cornerRadius(12)
        }
        .disabled(disabled)
    }
}

// MARK: - Glass Button (matches GlassButton.tsx)

struct GlassBtn: View {
    let label: String
    let prominent: Bool
    let action: () -> Void
    @Environment(\.colorScheme) var scheme

    init(_ label: String, prominent: Bool = false, action: @escaping () -> Void) {
        self.label = label
        self.prominent = prominent
        self.action = action
    }

    var bgColor: Color {
        if prominent {
            return scheme == .dark ? Color.statBlueDark.opacity(0.5) : Color.statBlue.opacity(0.4)
        } else {
            return scheme == .dark ? Color.white.opacity(0.08) : Color.white.opacity(0.5)
        }
    }

    var body: some View {
        Button(action: action) {
            Text(label)
                .font(.system(size: 16, weight: .semibold))
                .foregroundColor(prominent ? .white : .tint(scheme))
                .padding(.vertical, 14)
                .padding(.horizontal, 24)
                .background {
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .fill(.ultraThinMaterial)
                        .overlay {
                            RoundedRectangle(cornerRadius: 12, style: .continuous)
                                .fill(bgColor)
                        }
                }
        }
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
                          ? Color.tint(scheme)
                          : (scheme == .dark ? Color.white.opacity(0.2) : Color.black.opacity(0.2)))
                    .frame(width: 10, height: 10)
            }
        }
    }
}

// MARK: - Settings row components

struct SettingsSectionTitle: View {
    let title: String
    @Environment(\.colorScheme) var scheme

    var body: some View {
        Text(title)
            .font(.system(size: 13, weight: .semibold))
            .foregroundColor(scheme == .dark ? Color(hex: "98989f") : Color(hex: "666666"))
            .textCase(.uppercase)
            .padding(.horizontal, 4)
            .padding(.top, 4)
    }
}

struct SettingsRow<Trailing: View>: View {
    let icon: String
    let iconColor: Color
    let label: String
    @ViewBuilder let trailing: () -> Trailing
    @Environment(\.colorScheme) var scheme

    var body: some View {
        HStack(spacing: 12) {
            RoundedRectangle(cornerRadius: 8)
                .fill(iconColor)
                .frame(width: 32, height: 32)
                .overlay(
                    Image(systemName: icon)
                        .font(.system(size: 16, weight: .medium))
                        .foregroundColor(.white)
                )
            Text(label)
                .font(.system(size: 17))
                .foregroundColor(scheme == .dark ? Color(hex: "f0f0f0") : Color(hex: "1a1a1a"))
            Spacer()
            trailing()
        }
        .padding(.vertical, 10)
    }
}

struct SettingsLinkRow: View {
    let icon: String
    let iconColor: Color
    let label: String
    let url: String

    var body: some View {
        Link(destination: URL(string: url)!) {
            SettingsRow(icon: icon, iconColor: iconColor, label: label) {
                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.secondary)
            }
        }
        .buttonStyle(.plain)
    }
}
