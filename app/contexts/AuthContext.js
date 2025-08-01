import { createContext, useContext, useEffect, useState } from "react";
import Config from "react-native-config";
import { getToken, removeToken, saveToken } from "../storage/AuthStorage";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const BACKEND = Config.BACKEND_URL || "https://law-ai-7y05.onrender.com";

  useEffect(() => {
    checkAuthState();
    console.log("🔥 Config object:", Config);
    console.log("backend url", BACKEND);
  }, []);

  const checkAuthState = async () => {
    try {
      const userToken = await getToken();
      if (userToken) {
        setToken(userToken);
        console.log(userToken);
      }
    } catch (error) {
      console.error("Error checking auth state:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (userData) => {
    const { email, password } = userData;
    try {
      const res = await fetch(`${BACKEND}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text);
      }

      if (!res.ok) {
        throw new Error(data.message || `Status ${res.status}`);
      }

      if (data.token) {
        await saveToken(data.token);
        setToken(data.token);
      }
      // Maybe I need to put rememberMe logic here…
      return { success: true };
    } catch (err) {
      console.error("Login failed:", err);
      Alert.alert("Login Error", err.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await removeToken();
      setToken(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const createAccount = async (userData) => {
    const { firstName, lastName, email, password, confirmPassword, otp } =
      userData;

    try {
      const res = await fetch(`${BACKEND}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email,
          password,
          confirmPassword,
          otp,
        }),
      });

      // read raw text
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
        console.log(data);
      } catch (_) {
        throw new Error(text);
      }

      if (!res.ok) {
        throw new Error(data.message || `Status ${res.status}`);
      }

      if (data.token) {
        await saveToken(data.token);
        setToken(data.token);
      }
      return;
    } catch (err) {
      console.error("Signup failed:", err);
      Alert.alert("Signup Error", err.message || "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    if (!email.trim()) {
      Alert.alert("Error", "Please enter your email");
      return { success: false, error: "Email is empty" };
    }

    try {
      const res = await fetch(`${BACKEND}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      console.log("forgotPassword status:", res.status);
      const data = await res.json();
      console.log("forgotPassword response:", data);

      if (!res.ok) {
        throw new Error(data.message || `Status ${res.status}`);
      }

      return { success: true };
    } catch (err) {
      console.error("forgotPassword error:", err);
      return { success: false, error: err.message };
    }
  };

  // const verifyResetOtp = async (email, otp) => {
  //   const res = await fetch(
  //     `${BACKEND}/auth/verify-reset-otp`,
  //     {
  //       method: "POST",
  //       body: JSON.stringify({ email, otp }),
  //     }
  //   );
  //   const data = await res.json();
  //   if (!res.ok) throw new Error(data.message);
  //   return { success: true };
  // };

  const resetPassword = async (email, otp, newPassword, confirmPassword) => {
    const res = await fetch(`${BACKEND}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ email, otp, newPassword, confirmPassword }),
    });
    const data = await res.json();
    console.log(data);
    if (!res.ok) throw new Error(data.message);
    return { success: true };
  };

  const value = {
    token,
    loading,
    login,
    logout,
    createAccount,
    forgotPassword,
    // verifyResetOtp,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
export default AuthProvider;
