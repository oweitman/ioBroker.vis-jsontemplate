const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

describe('VIS-2 JSON template utilities', () => {
    let buildDatapoints;
    let buildDatapointVariables;
    let hasInvalidDatapointVariable;
    let isValidJavaScriptIdentifier;
    let parseJsonValue;
    let renderEjsTemplate;

    before(async () => {
        const moduleUrl = pathToFileURL(path.join(__dirname, '..', 'src-widgets', 'src', 'templateUtils.js'));
        ({
            buildDatapoints,
            buildDatapointVariables,
            hasInvalidDatapointVariable,
            isValidJavaScriptIdentifier,
            parseJsonValue,
            renderEjsTemplate,
        } = await import(moduleUrl.href));
    });

    it('builds optional datapoint variables without changing the dp map', () => {
        const data = {
            dpcount: 2,
            json_dp1: 'test.temperature',
            json_dp_variable1: 'roomTemperature',
            json_dp2: 'test.enabled',
            json_dp_variable2: '',
        };
        const values = {
            'test.temperature.val': 21.5,
            'test.enabled.val': false,
        };

        assert.deepEqual(buildDatapoints(data, values), {
            'test.temperature': 21.5,
            'test.enabled': false,
        });
        assert.deepEqual(buildDatapointVariables(data, values), {
            roomTemperature: 'test.temperature',
            roomTemperature_value: 21.5,
        });
        assert.deepEqual(
            buildDatapointVariables(
                { dpcount: 1, json_dp1: 'test.prototype', json_dp_variable1: '__proto__' },
                { 'test.prototype.val': 'safe' },
            ),
            Object.fromEntries([
                ['__proto__', 'test.prototype'],
                ['__proto___value', 'safe'],
            ]),
        );
    });

    it('validates JavaScript variable names and rejects ambiguous aliases', () => {
        assert.equal(isValidJavaScriptIdentifier('temperature_1'), true);
        assert.equal(isValidJavaScriptIdentifier('$temperatur'), true);
        assert.equal(isValidJavaScriptIdentifier('außentemperatur'), true);
        assert.equal(isValidJavaScriptIdentifier('1temperature'), false);
        assert.equal(isValidJavaScriptIdentifier('room-temperature'), false);
        assert.equal(isValidJavaScriptIdentifier('class'), false);
        assert.equal(hasInvalidDatapointVariable({ dpcount: 1, json_dp_variable1: 'temperature' }, 1), false);
        assert.equal(hasInvalidDatapointVariable({ dpcount: 1, json_dp_variable1: 'class' }, 1), true);
        assert.equal(
            hasInvalidDatapointVariable(
                { dpcount: 2, json_dp_variable1: 'temperature', json_dp_variable2: 'temperature_value' },
                1,
            ),
            true,
        );

        assert.throws(
            () => buildDatapointVariables({ dpcount: 1, json_dp1: 'test.0', json_dp_variable1: 'data' }, {}),
            /already used by the template context/,
        );
        assert.throws(
            () =>
                buildDatapointVariables(
                    {
                        dpcount: 2,
                        json_dp1: 'test.0',
                        json_dp_variable1: 'value',
                        json_dp2: 'test.1',
                        json_dp_variable2: 'value',
                    },
                    {},
                ),
            /used more than once/,
        );
        assert.throws(
            () =>
                buildDatapointVariables(
                    {
                        dpcount: 2,
                        json_dp1: 'test.0',
                        json_dp_variable1: 'value',
                        json_dp2: 'test.1',
                        json_dp_variable2: 'value_value',
                    },
                    {},
                ),
            /used more than once/,
        );
    });

    it('makes datapoints available through dp and their optional variable names in EJS', async () => {
        const data = { dpcount: 1, json_dp1: 'test.temperature', json_dp_variable1: 'temperature' };
        const values = { 'test.temperature.val': 23 };
        const dp = buildDatapoints(data, values);
        const variables = buildDatapointVariables(data, values);

        const html = await renderEjsTemplate('<%= dp[temperature] %>/<%= temperature_value %>', {
            ...variables,
            dp,
        });

        assert.equal(html, '23/23');
    });

    it('parses JSON objects and keeps object values', () => {
        const objectValue = { value: 42 };

        assert.deepEqual(parseJsonValue('{"enabled":false,"count":0}'), { enabled: false, count: 0 });
        assert.equal(parseJsonValue(objectValue), objectValue);
        assert.deepEqual(parseJsonValue('[1,2]'), [1, 2]);
        assert.deepEqual(parseJsonValue('invalid JSON'), {});
        assert.equal(parseJsonValue(0), 0);
        assert.equal(parseJsonValue(false), false);
    });

    it('builds datapoints including falsy values and legacy field names', () => {
        const data = {
            dpcount: 3,
            json_dp1: 'test.zero',
            'json_dp-2': 'test.false',
            'datapoint-oid3': 'test.empty',
        };
        const values = {
            'test.zero.val': 0,
            'test.false.val': false,
            'test.empty.val': '',
        };

        assert.deepEqual(buildDatapoints(data, values), {
            'test.zero': 0,
            'test.false': false,
            'test.empty': '',
        });
    });

    it('renders asynchronous EJS templates', async () => {
        const html = await renderEjsTemplate('<%= await Promise.resolve(value) %>', { value: 'ready' });

        assert.equal(html, 'ready');
    });
});
