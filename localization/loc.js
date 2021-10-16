import i18n from 'i18n-js';
import bn from './bn.json';
import en from './en.json';

i18n.translations = {
  en,
  bn,
};

i18n.locale = 'bn';
i18n.fallbacks = true;
export default i18n.t;
