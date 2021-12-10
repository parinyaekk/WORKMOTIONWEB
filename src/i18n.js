import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import XHR from "i18next-xhr-backend";

i18n
    .use(XHR)
    .use(reactI18nextModule)
    .init({
        fallbackLng: 'th',
        ns: ['trans'],
        defaultNS: 'trans',
        debug: true,
        interpolation: {
            escapeValue: false
        },
        react: {
            wait: true
        }
    });

export default i18n;