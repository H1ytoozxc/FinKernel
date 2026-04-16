import { useState, useEffect } from "react"
import { motion as Motion, AnimatePresence } from "framer-motion"
import { getDashboard } from "../api"
import { getSettings } from "../settings"

export default function NavigationDrawer({ 
  isOpen, 
  onClose, 
  active, 
  onNavigate, 
  userName,
  refreshKey,
  isMobile 
}) {
  const [data, setData] = useState(null)
  const [settings, setSettings] = useState(getSettings)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem("finfuture_theme") || "light" } catch { return "light" }
  })

  // Load dashboard data
  useEffect(() => {
    getDashboard().then(setData).catch(() => {})
  }, [refreshKey])

  // Listen for settings changes
  useEffect(() => {
    const handler = () => setSettings(getSettings())
    window.addEventListener("finfuture-settings", handler)
    return () => window.removeEventListener("finfuture-settings", handler)
  }, [])

  // Theme toggle
  useEffect(() => {
    try { localStorage.setItem("finfuture_theme", theme) } catch {}
    document.body.classList.toggle("dark", theme === "dark")
  }, [theme])

  const hide = settings.hideBalance
  const mask = (val) => hide ? "•••••" : val

  const level = data?.level_info?.current || { name: "Новичок", icon: "🌱", level: 1 }
  const xp = data?.xp || 0
  const xpFrom = data?.level_info?.current?.xp_from || 0
  const xpTo = data?.level_info?.next?.xp_from || data?.level_info?.current?.xp_to || 200
  const xpProgress = xpTo > xpFrom ? (xp - xpFrom) / (xpTo - xpFrom) : 0
  const streak = data?.streak || 0
  const balance = data?.balance?.current ?? 0

  const tabs = [
    { id: "home", label: "Главная", icon: "/icons/free-icon-home-6529015.png" },
    { id: "transactions", label: "Транзакции", icon: "/icons/free-icon-money-bag-7510557.png" },
    { id: "ai-advisor", label: "AI-Советник", icon: "/icons/free-icon-robot-14224105.png" },
    { id: "achievements", label: "Достижения", icon: "/icons/free-icon-checkmark-16703458.png" },
    { id: "about", label: "О проекте", icon: "/icons/tbank/book-open.png" },
    { id: "settings", label: "Настройки", icon: "/icons/free-icon-setting-6619132.png" },
  ]

  const handleNavigate = (tabId) => {
    onNavigate(tabId)
    onClose()
  }

  // Desktop sidebar (always visible on desktop)
  if (!isMobile) {
    return (
      <aside style={s.desktopSidebar}>
        <div style={s.desktopSidebarContent}>
          {/* Logo */}
          <div style={s.desktopLogo}>
            <img src="/icons/F-Kernel.png" alt="Kernel" style={s.desktopLogoImg} />
          </div>

          <div style={s.desktopDivider} />

          {/* Balance Summary */}
          <div 
            style={s.desktopBalanceBox}
            onClick={() => handleNavigate("transactions")}
          >
            <div style={s.desktopBalanceLabel}>БАЛАНС</div>
            <div style={s.desktopBalanceValue}>
              {mask(balance.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " с")}
            </div>
          </div>

          <div style={s.desktopDivider} />

          {/* Navigation */}
          <nav style={s.desktopNav}>
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => handleNavigate(t.id)}
                style={{
                  ...s.desktopNavBtn,
                  ...(active === t.id ? s.desktopNavBtnActive : {}),
                }}
              >
                {active === t.id && <div style={s.desktopNavIndicator} />}
                <img src={t.icon} alt="" style={s.desktopNavIcon} />
                <span>{t.label}</span>
              </button>
            ))}
          </nav>

          <div style={{ flex: 1 }} />

          {/* Level & XP */}
          <div style={s.desktopLevelBox}>
            <div style={s.desktopLevelHeader}>
              <span style={s.desktopLevelIcon}>{level.icon}</span>
              <span style={s.desktopLevelName}>{level.name}</span>
            </div>
            <div style={s.desktopXpBar}>
              <div style={{ ...s.desktopXpFill, width: `${Math.min(xpProgress * 100, 100)}%` }} />
            </div>
            <div style={s.desktopXpText}>{xp} / {xpTo} XP</div>
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div style={s.desktopStreakBox}>
              <img src="/icons/free-icon-flames-4201705.png" alt="" style={{ width: 20, height: 20 }} />
              <span style={s.desktopStreakNum}>{streak}</span>
              <span style={s.desktopStreakLabel}>
                {streak === 1 ? "день" : streak < 5 ? "дня" : "дней"}
              </span>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
            style={s.desktopThemeBtn}
          >
            <span>{theme === "dark" ? "☀️" : "🌙"}</span>
            <span style={s.desktopThemeText}>
              {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
            </span>
          </button>
        </div>
      </aside>
    )
  }

  // Mobile drawer
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <Motion.div
            style={s.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <Motion.div
            style={s.drawer}
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Drawer Header */}
            <div style={s.drawerHeader}>
              <img src="/icons/F-Kernel.png" alt="Kernel" style={s.drawerLogo} />
              <button style={s.closeBtn} onClick={onClose} aria-label="Закрыть">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            {/* User Card */}
            <div style={s.userCard}>
              <div style={s.userCardAvatar}>
                {userName?.[0]?.toUpperCase() || "?"}
              </div>
              <div style={s.userCardInfo}>
                <div style={s.userCardName}>{userName}</div>
                <div style={s.userCardLevel}>
                  {level.icon} {level.name}
                </div>
              </div>
            </div>

            {/* Balance Quick View */}
            <div style={s.balanceCard}>
              <div style={s.balanceCardLabel}>Текущий баланс</div>
              <div style={s.balanceCardValue}>
                {mask(balance.toLocaleString("ru-RU", { maximumFractionDigits: 0 }) + " с")}
              </div>
            </div>

            <div style={s.drawerDivider} />

            {/* Navigation Links */}
            <nav style={s.drawerNav}>
              {tabs.map((t, i) => (
                <Motion.button
                  key={t.id}
                  onClick={() => handleNavigate(t.id)}
                  style={{
                    ...s.drawerNavBtn,
                    ...(active === t.id ? s.drawerNavBtnActive : {}),
                  }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <img src={t.icon} alt="" style={s.drawerNavIcon} />
                  <span style={s.drawerNavText}>{t.label}</span>
                  {active === t.id && (
                    <Motion.div
                      layoutId="drawer-active-indicator"
                      style={s.drawerActiveIndicator}
                    />
                  )}
                </Motion.button>
              ))}
            </nav>

            <div style={{ flex: 1 }} />

            {/* Footer */}
            <div style={s.drawerFooter}>
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(t => (t === "dark" ? "light" : "dark"))}
                style={s.drawerThemeBtn}
              >
                <span style={s.drawerThemeIcon}>{theme === "dark" ? "☀️" : "🌙"}</span>
                <span style={s.drawerThemeText}>
                  {theme === "dark" ? "Светлая тема" : "Тёмная тема"}
                </span>
              </button>

              {/* Streak Badge */}
              {streak > 0 && (
                <div style={s.drawerStreakBadge}>
                  <img src="/icons/free-icon-flames-4201705.png" alt="" style={{ width: 18, height: 18 }} />
                  <span style={s.drawerStreakNum}>{streak}</span>
                </div>
              )}
            </div>
          </Motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

const s = {
  // Desktop Sidebar Styles
  desktopSidebar: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: 260,
    background: "var(--card-bg)",
    borderRight: "1px solid var(--border-color)",
    zIndex: 200,
    overflow: "hidden",
  },
  desktopSidebarContent: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: "20px 16px",
    overflowY: "auto",
  },
  desktopLogo: {
    display: "flex",
    alignItems: "center",
    padding: "4px 8px",
    marginBottom: 4,
  },
  desktopLogoImg: {
    height: 32,
    objectFit: "contain",
  },
  desktopDivider: {
    height: 1,
    background: "var(--border-color)",
    margin: "12px 0",
  },
  desktopBalanceBox: {
    background: "var(--hover-bg, rgba(0,0,0,0.04))",
    borderRadius: 12,
    padding: "12px 14px",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  desktopBalanceLabel: {
    fontSize: 11,
    color: "var(--text-dim)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
    fontWeight: 600,
  },
  desktopBalanceValue: {
    fontSize: 20,
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  desktopNav: {
    display: "flex",
    flexDirection: "column",
    gap: 2,
  },
  desktopNavBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "10px 14px",
    border: "none",
    borderRadius: 10,
    background: "transparent",
    color: "var(--text-dim)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    width: "100%",
    fontFamily: "inherit",
    position: "relative",
  },
  desktopNavBtnActive: {
    background: "rgba(255,221,45,0.15)",
    color: "var(--text-primary)",
    fontWeight: 600,
  },
  desktopNavIndicator: {
    position: "absolute",
    left: 0,
    top: "15%",
    bottom: "15%",
    width: 3,
    background: "#ffdd2d",
    borderRadius: "0 3px 3px 0",
  },
  desktopNavIcon: {
    width: 22,
    height: 22,
    objectFit: "contain",
  },
  desktopLevelBox: {
    padding: "12px 14px",
    background: "var(--hover-bg, rgba(0,0,0,0.04))",
    borderRadius: 12,
    marginBottom: 8,
  },
  desktopLevelHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  desktopLevelIcon: { fontSize: 20 },
  desktopLevelName: {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--text-primary)",
  },
  desktopXpBar: {
    height: 6,
    background: "rgba(0,0,0,0.10)",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 4,
  },
  desktopXpFill: {
    height: "100%",
    background: "linear-gradient(90deg, #ffdd2d, #ffa000)",
    borderRadius: 3,
    transition: "width 0.5s ease",
  },
  desktopXpText: {
    fontSize: 11,
    color: "var(--text-dim)",
  },
  desktopStreakBox: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 14px",
    background: "linear-gradient(135deg, rgba(255,152,0,0.1), rgba(255,87,34,0.06))",
    borderRadius: 12,
    marginBottom: 8,
  },
  desktopStreakNum: {
    fontSize: 20,
    fontWeight: 800,
    color: "#ff9800",
  },
  desktopStreakLabel: {
    fontSize: 13,
    color: "var(--text-dim)",
  },
  desktopThemeBtn: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    border: "1px solid var(--border-color)",
    borderRadius: 10,
    background: "transparent",
    color: "var(--text-dim)",
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
    width: "100%",
    fontFamily: "inherit",
  },
  desktopThemeText: {
    fontSize: 13,
  },

  // Mobile Drawer Styles
  backdrop: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.5)",
    backdropFilter: "blur(4px)",
    zIndex: 350,
  },
  drawer: {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: "80%",
    maxWidth: 320,
    background: "var(--card-bg)",
    zIndex: 360,
    display: "flex",
    flexDirection: "column",
    boxShadow: "4px 0 24px rgba(0,0,0,0.15)",
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 16px 12px",
    borderBottom: "1px solid var(--border-color)",
  },
  drawerLogo: {
    height: 28,
    objectFit: "contain",
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    border: "none",
    background: "transparent",
    color: "var(--text-dim)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s",
  },
  userCard: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "16px",
    margin: "12px 16px 0",
    background: "var(--hover-bg, rgba(0,0,0,0.04))",
    borderRadius: 14,
  },
  userCardAvatar: {
    width: 48,
    height: 48,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ffdd2d, #ffa000)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    fontWeight: 700,
    color: "#1a1a1a",
    flexShrink: 0,
  },
  userCardInfo: {
    flex: 1,
    minWidth: 0,
  },
  userCardName: {
    fontSize: 16,
    fontWeight: 600,
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userCardLevel: {
    fontSize: 13,
    color: "var(--text-dim)",
    marginTop: 4,
  },
  balanceCard: {
    margin: "12px 16px",
    padding: "14px 16px",
    background: "linear-gradient(135deg, rgba(255,221,45,0.15), rgba(255,160,0,0.08))",
    borderRadius: 12,
    border: "1px solid rgba(255,221,45,0.2)",
  },
  balanceCardLabel: {
    fontSize: 11,
    color: "var(--text-dim)",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
    fontWeight: 600,
  },
  balanceCardValue: {
    fontSize: 22,
    fontWeight: 700,
    color: "var(--text-primary)",
  },
  drawerDivider: {
    height: 1,
    background: "var(--border-color)",
    margin: "8px 16px",
  },
  drawerNav: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    padding: "0 12px",
    overflowY: "auto",
    flex: 1,
  },
  drawerNavBtn: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    padding: "14px 16px",
    border: "none",
    borderRadius: 12,
    background: "transparent",
    color: "var(--text-dim)",
    fontSize: 15,
    fontWeight: 500,
    cursor: "pointer",
    transition: "all 0.2s",
    textAlign: "left",
    width: "100%",
    fontFamily: "inherit",
    position: "relative",
    minHeight: 52,
  },
  drawerNavBtnActive: {
    background: "rgba(255,221,45,0.12)",
    color: "var(--text-primary)",
    fontWeight: 600,
  },
  drawerNavIcon: {
    width: 24,
    height: 24,
    objectFit: "contain",
    flexShrink: 0,
  },
  drawerNavText: {
    flex: 1,
  },
  drawerActiveIndicator: {
    position: "absolute",
    left: 0,
    top: "20%",
    bottom: "20%",
    width: 3,
    background: "#ffdd2d",
    borderRadius: "0 3px 3px 0",
  },
  drawerFooter: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "16px",
    borderTop: "1px solid var(--border-color)",
    marginTop: "auto",
  },
  drawerThemeBtn: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "12px 14px",
    border: "1px solid var(--border-color)",
    borderRadius: 10,
    background: "transparent",
    color: "var(--text-dim)",
    fontSize: 14,
    cursor: "pointer",
    transition: "all 0.2s",
    fontFamily: "inherit",
  },
  drawerThemeIcon: {
    fontSize: 18,
  },
  drawerThemeText: {
    fontSize: 14,
    fontWeight: 500,
  },
  drawerStreakBadge: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    padding: "10px 14px",
    background: "linear-gradient(135deg, rgba(255,152,0,0.12), rgba(255,87,34,0.06))",
    borderRadius: 10,
    border: "1px solid rgba(255,152,0,0.2)",
  },
  drawerStreakNum: {
    fontSize: 16,
    fontWeight: 700,
    color: "#ff9800",
  },
}
