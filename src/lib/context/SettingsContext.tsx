"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface SiteSettings {
    heroImage: string;
}

const DEFAULT_SETTINGS: SiteSettings = {
    heroImage: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=2560&auto=format&fit=crop"
};

interface SettingsContextType {
    settings: SiteSettings;
    updateSettings: (newSettings: Partial<SiteSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("flavorzest_settings");
        if (saved) {
            try {
                setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
            } catch (e) {
                console.error("Failed to parse settings", e);
            }
        }
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("flavorzest_settings", JSON.stringify(settings));
        }
    }, [settings, isInitialized]);

    const updateSettings = (newSettings: Partial<SiteSettings>) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    return (
        <SettingsContext.Provider value={{ settings, updateSettings }}>
            {children}
        </SettingsContext.Provider>
    );
}

export function useSettings() {
    const context = useContext(SettingsContext);
    if (context === undefined) {
        throw new Error("useSettings must be used within a SettingsProvider");
    }
    return context;
}
