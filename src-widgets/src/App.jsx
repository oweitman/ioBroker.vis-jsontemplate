import React from 'react';

import WidgetDemoApp from '@iobroker/vis-2-widgets-react-dev/widgetDemoApp';
import { i18n as I18n } from '@iobroker/adapter-react-v5';

import JSONTemplateWidget from './JSONTemplateWidget';
import translations from './translations';

class App extends WidgetDemoApp {
    constructor(props) {
        super(props);

        // init translations
        I18n.extendTranslations(translations);
    }

    renderWidget() {
        return (
            <>
                <JSONTemplateWidget
                    socket={this.socket}
                    style={{
                        width: 100,
                        height: 100,
                    }}
                />
            </>
        );
    }
}

export default App;
