import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { brandApi } from "../lib/api";

const BrandAuthContext = createContext(null);

export function BrandAuthProvider({ children }) {
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMe = useCallback(async () => {
    const token = localStorage.getItem("dr_brand_token");
    if (!token) {
      setBrand(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await brandApi.get("/brand/me");
      setBrand(data);
    } catch {
      localStorage.removeItem("dr_brand_token");
      setBrand(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMe(); }, [fetchMe]);

  const login = async (email, password) => {
    const { data } = await brandApi.post("/brand/login", { email, password });
    localStorage.setItem("dr_brand_token", data.token);
    setBrand(data.brand);
    return data.brand;
  };

  const logout = () => {
    localStorage.removeItem("dr_brand_token");
    setBrand(null);
  };

  return (
    <BrandAuthContext.Provider value={{ brand, setBrand, loading, login, logout, refresh: fetchMe }}>
      {children}
    </BrandAuthContext.Provider>
  );
}

export const useBrandAuth = () => useContext(BrandAuthContext);
