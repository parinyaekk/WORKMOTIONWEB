import React from "react";
import { translate } from 'react-i18next';
import i18n from "./../../../../i18n";
import { ButtonGroup } from "shards-react";

const NavbarLang = ({ t }) => ({
    render() {
        return (
            <div style={{marginTop: '4%'}}>
                <ButtonGroup>
                    <button className="btn btn-light" style={{borderColor: 'black'}} onClick={() => { i18n.changeLanguage('th') }}>{t('TH')}</button>
                    <button className="btn btn-light" style={{borderColor: 'black'}} onClick={() => { i18n.changeLanguage('en') }}>{t('EN')}</button>
                </ButtonGroup>
            </div>
        );
    }
})

export default translate()(NavbarLang);
