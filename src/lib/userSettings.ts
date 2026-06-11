export const getUserEmail = (): string | null => localStorage.getItem('userEmail');
export const setUserEmail = (email: string): void => { localStorage.setItem('userEmail', email); };
