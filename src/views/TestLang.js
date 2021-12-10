import React from 'react';
import { translate } from 'react-i18next';
import i18n from "../i18n";

const TestLang = ({ t }) => ({
    render() {
        return (
            <div className="App">
                <section className="hero is-info">
                    <div className="hero-body has-text-centered">
                        <div className="container">
                            <h3 className="title">{t('title')}</h3>
                        </div>
                    </div>
                </section>

                <div>
                    <button className="button" onClick={() => { i18n.changeLanguage('th') }}>{t('TH')}</button>
                    <button className="button" onClick={() => { i18n.changeLanguage('en') }}>{t('EN')}</button>
                </div>
            </div>
        );
    }
})

export default translate()(TestLang);