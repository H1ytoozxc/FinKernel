// Token manager - automatically refreshes tokens before expiration
import { setToken, getToken, clearAuth } from "./api"

const BASE = import.meta.env.VITE_API_URL || "/api"
const TOKEN_REFRESH_INTERVAL = 13 * 60 * 1000 // 13 minutes (tokens expire in 15 min)
let refreshIntervalId = null

export function startTokenRefresh() {
  // Clear any existing interval
  stopTokenRefresh()

  // Refresh token every 13 minutes
  refreshIntervalId = setInterval(async () => {
    const refreshToken = localStorage.getItem("finfuture_refresh_token")

    if (!refreshToken) {
      console.warn("No refresh token available")
      stopTokenRefresh()
      return
    }

    try {
      const res = await fetch(`${BASE}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (!res.ok) {
        throw new Error("Token refresh failed")
      }

      const data = await res.json()
      setToken(data.access_token, data.refresh_token)
      console.log("Token refreshed successfully")
    } catch (error) {
      console.error("Failed to refresh token:", error)
      // If refresh fails, clear auth and reload
      clearAuth()
      window.location.reload()
    }
  }, TOKEN_REFRESH_INTERVAL)

  console.log("Token auto-refresh started")
}

export function stopTokenRefresh() {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId)
    refreshIntervalId = null
    console.log("Token auto-refresh stopped")
  }
}
