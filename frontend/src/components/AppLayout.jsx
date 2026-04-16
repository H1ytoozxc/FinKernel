import { useState, useEffect } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"

export default function AppLayout({
  children,
  activeTab,
  onNavigate,
  userName,
  onLogout,
  refreshKey,
  isMobile
}) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Close drawer on route change (mobile)
  useEffect(() => {
    setDrawerOpen(false)
  }, [activeTab])

  // Close drawer on resize to desktop
  useEffect(() => {
    if (!isMobile) {
      setDrawerOpen(false)
    }
  }, [isMobile])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen && isMobile) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [drawerOpen, isMobile])

  return (
    <div style={s.layout}>
      {/* Mobile Header - only on mobile */}
      {isMobile && (
        <Header
          userName={userName}
          onLogout={onLogout}
          onToggleSidebar={() => setDrawerOpen(true)}
          activeTab={activeTab}
          isMobile={isMobile}
        />
      )}

      {/* Sidebar */}
      <Sidebar
        active={activeTab}
        onNavigate={onNavigate}
        userName={userName}
        onLogout={onLogout}
        refreshKey={refreshKey}
        isMobile={isMobile}
        isOpen={isMobile ? drawerOpen : true}
        onClose={() => setDrawerOpen(false)}
      />

      {/* Main Content Area */}
      <main style={{ 
        ...s.main, 
        ...(isMobile ? s.mainMobile : s.mainDesktop) 
      }}>
        <div style={s.contentWrapper}>
          {children}
        </div>
      </main>
    </div>
  )
}

const s = {
  layout: {
    display: "flex",
    minHeight: "100vh",
    background: "var(--bg-primary)",
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: "var(--text-primary)",
  },
  main: {
    flex: 1,
    overflowY: "auto",
    overflowX: "hidden",
    WebkitOverflowScrolling: "touch",
  },
  mainDesktop: {
    marginLeft: 260,
    padding: "24px 32px",
    minHeight: "100vh",
  },
  mainMobile: {
    marginLeft: 0,
    padding: "60px 16px 24px",
    minHeight: "100vh",
    paddingBottom: "calc(24px + env(safe-area-inset-bottom, 0px))",
  },
  contentWrapper: {
    maxWidth: 1200,
    margin: "0 auto",
    width: "100%",
  },
}
