export const generateDynamicUser = (prefix = 'qauser') => {
    const stamp = Date.now();
    const random = Cypress._.random(1000, 9999);
    return {
        username: `${prefix}_${stamp}_${random}`,
        password: `Pwd@${stamp}${random}`,
    };
};

export const formatCurrentDate = () => {
    const now = new Date();
    return `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}`;
};

export const parseAmount = (value) => Number(String(value).replace(/[^\d.]/g, ''));
