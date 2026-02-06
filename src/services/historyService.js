const HISTORY_KEY = 'medilink_consultation_history';

export const historyService = {
    getHistory: () => {
        const history = localStorage.getItem(HISTORY_KEY);
        return history ? JSON.parse(history) : [];
    },

    saveConsultation: (consultation) => {
        const history = historyService.getHistory();
        const updatedHistory = [
            { ...consultation, id: Date.now(), timestamp: new Date().toISOString() },
            ...history,
        ].slice(0, 20); // Keep last 20
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
        return updatedHistory;
    },

    clearHistory: () => {
        localStorage.removeItem(HISTORY_KEY);
    },
};
