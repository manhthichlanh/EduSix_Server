import i18n from 'i18n';

export const getTranslate = (phrase, language = 'en') => {
    return i18n.__({ phrase: phrase, locale: language });
};
