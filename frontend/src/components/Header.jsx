import { useState, useEffect, useRef } from "react"
import { motion as Motion, AnimatePresence } from "framer-motion"

export default function Header({ 
  userName, 
  onLogout, 
  onToggleSidebar, 
  activeTab,
  isMobile 
}) {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef(null)

  // Get user initials
  const initials = userName?.[0]?.toUpperCase() || "?"
  
  // Get email for display
  const email = localStorage.getItem("finfuture_email") || ""

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowUserMenu(false)
      }
    }
    if (showUserMenu) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showUserMenu])

  return (
    <header style={{ ...s.header, ...(scrolled ? s.headerScrolled : {}) }}>
      <div style={s.headerContent}>
        {/* Left: Hamburger Menu */}
        <Motion.button
          style={s.hamburgerBtn}
          onClick={onToggleSidebar}
          whileTap={{ scale: 0.95 }}
          whileHover={{ background: "var(--hover-bg)" }}
          aria-label="Открыть меню"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" style={s.hamburgerIcon}>
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </Motion.button>

        {/* Center: Logo */}
        <div style={s.logo}>
          <img 
            src="/icons/F-Kernel.png" 
            alt="FinKernel" 
            style={s.logoImg} 
          />
        </div>

        {/* Right: User Avatar */}
        <div style={s.userSection} ref={menuRef}>
          <Motion.button
            style={{ ...s.avatarBtn, ...(showUserMenu ? s.avatarBtnActive : {}) }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            aria-label="Меню пользователя"
          >
            <span style={s.avatarText}>{initials}</span>
          </Motion.button>

          {/* User Dropdown Menu */}
          <AnimatePresence>
            {showUserMenu && (
              <Motion.div
                style={s.userMenu}
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <div style={s.userMenuHeader}>
                  <div style={s.userMenuAvatar}>{initials}</div>
                  <div style={s.userMenuInfo}>
                    <div style={s.userMenuName}>{userName}</div>
                    <div style={s.userMenuEmail}>{email}</div>
                  </div>
                </div>
                <div style={s.userMenuDivider} />
                <button 
                  style={s.userMenuItem} 
                  onClick={() => { setShowUserMenu(false); window.location.href = "#settings"; }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={s.menuIcon}>
                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Настройки
                </button>
                <button 
                  style={{ ...s.userMenuItem, ...s.userMenuItemDanger }}
                  onClick={() => { setShowUserMenu(false); onLogout(); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={s.menuIcon}>
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Выйти
                </button>
              </Motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

const s = {
  header: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: 56,
    paddingTop: "env(safe-area-inset-top, 0px)",
    background: "var(--header-bg, var(--card-bg))",
    borderBottom: "1px solid var(--border-color)",
    zIndex: 300,
    transition: "all 0.3s ease",
  },
  headerScrolled: {
    background: "var(--header-bg-scrolled, rgba(255,255,255,0.92))",
    backdropFilter: "blur(14px)",
    boxShadow: "0 2px 20px rgba(0,0,0,0.06)",
  },
  headerContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    height: "100%",
    padding: "0 12px",
    maxWidth: "100%",
  },
  hamburgerBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    border: "none",
    background: "transparent",
    color: "var(--text-primary)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.2s ease",
    flexShrink: 0,
  },
  hamburgerIcon: {
    display: "block",
  },
  logo: {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    alignItems: "center",
  },
  logoImg: {
    height: 28,
    objectFit: "contain",
  },
  userSection: {
    position: "relative",
    flexShrink: 0,
  },
  avatarBtn: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    border: "2px solid var(--border-color)",
    background: "linear-gradient(135deg, #ffdd2d, #ffa000)",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s ease",
    padding: 0,
  },
  avatarBtnActive: {
    borderColor: "#ffdd2d",
    boxShadow: "0 0 0 3px rgba(255, 221, 45, 0.3)",
  },
  avatarText: {
    fontSize: 15,
    fontWeight: 700,
    color: "#1a1a1a",
  },
  userMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    right: 0,
    width: 220,
    background: "var(--card-bg)",
    border: "1px solid var(--border-color)",
    borderRadius: 14,
    boxShadow: "0 10px 40px rgba(0,0,0,0.15)",
    padding: "12px",
    zIndex: 400,
  },
  userMenuHeader: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: "4px 4px 12px",
  },
  userMenuAvatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "linear-gradient(135deg, #ffdd2d, #ffa000)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 17,
    fontWeight: 700,
    color: "#1a1a1a",
    flexShrink: 0,
  },
  userMenuInfo: {
    flex: 1,
    minWidth: 0,
    overflow: "hidden",
  },
  userMenuName: {
    fontSize: 14,
    fontWeight: 600,
    color: "var(--text-primary)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  userMenuEmail: {
    fontSize: 12,
    color: "var(--text-dim)",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginTop: 2,
  },
  userMenuDivider: {
    height: 1,
    background: "var(--border-color)",
    margin: "8px 0",
  },
  userMenuItem: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    width: "100%",
    padding: "12px 10px",
    border: "none",
    borderRadius: 10,
    background: "transparent",
    color: "var(--text-primary)",
    fontSize: 14,
    fontWeight: 500,
    cursor: "pointer",
    transition: "background 0.15s ease",
    textAlign: "left",
    fontFamily: "inherit",
  },
  userMenuItemDanger: {
    color: "#f44336",
  },
  menuIcon: {
    flexShrink: 0,
    opacity: 0.7,
  },
}
