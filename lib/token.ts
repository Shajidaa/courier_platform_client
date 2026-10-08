import type { IJwtPayload } from "@/types/auth.types";

export function parseJwt(token: string): IJwtPayload | null {
    try {
        const base64 = token.split(".")[1];
        const json = atob(base64.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(json) as IJwtPayload;
    } catch {
        return null;
    }
}

export function isTokenExpired(token: string): boolean {
    const payload = parseJwt(token);
    if (!payload) return true;
    return Date.now() >= payload.exp * 1000;
}

const ACCESS_TOKEN_KEY = "accessToken";

export const tokenStorage = {
    get: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(ACCESS_TOKEN_KEY);
    },
    set: (token: string): void => {
        if (typeof window === "undefined") return;
        localStorage.setItem(ACCESS_TOKEN_KEY, token);
    },
    remove: (): void => {
        if (typeof window === "undefined") return;
        localStorage.removeItem(ACCESS_TOKEN_KEY);
    },
};
