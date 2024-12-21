// lib/utils.js

export const sortByYearDesc = (publications) => {
    return publications.sort((a, b) => b.year - a.year);
};
