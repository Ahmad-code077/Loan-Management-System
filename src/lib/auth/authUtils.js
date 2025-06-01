export const authUtils = {
  // Decode and analyze any JWT token
  decodeToken: (token) => {
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);

      return {
        payload,
        isExpired: payload.exp < currentTime,
        expiresAt: new Date(payload.exp * 1000),
        timeUntilExpiry: payload.exp - currentTime,
        userId: payload.user_id,
        jti: payload.jti,
      };
    } catch (error) {
      return null;
    }
  },

  // Check if user has valid authentication
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;

    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    // No tokens at all
    if (!accessToken && !refreshToken) {
      return false;
    }

    // Check refresh token first (longer lived)
    if (refreshToken) {
      const refreshAnalysis = authUtils.decodeToken(refreshToken);
      if (refreshAnalysis && !refreshAnalysis.isExpired) {
        return true;
      }
    }

    // Check access token if no valid refresh token
    if (accessToken) {
      const accessAnalysis = authUtils.decodeToken(accessToken);
      if (accessAnalysis && !accessAnalysis.isExpired) {
        return true;
      }
    }

    return false;
  },

  // Check if access token is currently valid
  isAccessTokenValid: () => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('access_token');
    const analysis = authUtils.decodeToken(token);

    return analysis && !analysis.isExpired;
  },

  // Check if refresh token is valid
  hasValidRefreshToken: () => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('refresh_token');
    const analysis = authUtils.decodeToken(token);

    return analysis && !analysis.isExpired;
  },

  // Get current user from access token with user data stored at login
  getCurrentUser: () => {
    if (typeof window === 'undefined') return null;

    // First try to get user data from localStorage (stored at login)
    const storedUserData = localStorage.getItem('user_data');
    if (storedUserData) {
      try {
        return JSON.parse(storedUserData);
      } catch (error) {
        // If stored data is corrupted, fall back to token
      }
    }

    // Fallback to token payload
    const token = localStorage.getItem('access_token');
    const analysis = authUtils.decodeToken(token);

    return analysis?.payload || null;
  },

  // Get token expiry information
  getTokenInfo: () => {
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');

    return {
      access: authUtils.decodeToken(accessToken),
      refresh: authUtils.decodeToken(refreshToken),
    };
  },

  // Clear auth data
  clearAuth: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_data');
    }
  },

  // Set tokens with user data
  setTokens: (accessToken, refreshToken, userData = null) => {
    if (typeof window !== 'undefined') {
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
      }

      if (refreshToken) {
        localStorage.setItem('refresh_token', refreshToken);
      }

      // Store user data separately for easier access
      if (userData) {
        localStorage.setItem('user_data', JSON.stringify(userData));
      }
    }
  },
};
