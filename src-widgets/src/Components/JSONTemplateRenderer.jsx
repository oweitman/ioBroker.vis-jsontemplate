import InnerHTML from './InnerHTML';

/**
 * @param {{ html: string, renderVersion: number }} props
 * @returns {React.JSX.Element}
 */
export default function JSONTemplateRenderer({ html, renderVersion }) {
    return (
        <InnerHTML
            html={html || ' '}
            renderVersion={renderVersion}
        />
    );
}
