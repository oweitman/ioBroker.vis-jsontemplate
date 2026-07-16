#### Use case for a responsive FRITZ!Box call list

##### **Introduction**

This use case describes how to display a FRITZ!Box call list in
`ioBroker VIS` or `VIS-2` with the `JSONTemplate` widget.

**Dark**
![fritzbox-call-list dark](fritbox-call-list-dark.png)

**Light**
![fritzbox-call-list light](fritbox-call-list-light.png)

The template provides:

- a responsive card layout
- incoming and outgoing call indicators
- caller name, phone number, destination, device, date, time, and duration
- selectable light and dark themes
- individually configurable colors
- an empty-state and invalid-data message

The example is based on the discussion in the
[ioBroker forum](https://forum.iobroker.net/topic/84984/vis-2-widget-f%C3%BCr-anzeige-der-anrufliste/8).

---

##### **Data Source**

The `ioBroker.tr-064` adapter provides the FRITZ!Box call list as JSON, for
example in:

```text
tr-064.0.calllists.all.json
```

The data point must contain a JSON array. A simplified example looks like this:

```json
[
    {
        "id": 5471,
        "type": "1",
        "caller": "01711234567",
        "called": "SIP: 1002",
        "callednumber": "1002",
        "name": "Max Example",
        "device": "Office phone",
        "port": "11",
        "date": "16.07.26 12:45",
        "duration": "1:34",
        "sym": ">",
        "external": "01711234567"
    },
    {
        "id": 5472,
        "type": "2",
        "caller": "1003",
        "called": "SIP: 1001",
        "callednumber": "1001",
        "name": "Reception",
        "device": "Reception phone",
        "port": "12",
        "date": "16.07.26 13:02",
        "duration": "0:47",
        "sym": "<",
        "external": "1003"
    }
]
```

In this example, `sym` determines the direction:

- `>`: outgoing call
- `<`: incoming call
- any other value: unknown direction

If your adapter uses different values, adjust the `getDirection()` function
in the template.

---

##### **Integration into VIS**

1. Install the `vis-jsontemplate` adapter if it is not already installed.
2. Add the `JSON Template` widget to a view.
3. Select the call-list JSON data point in the **Data point** field.
4. Paste the following code into the **Template** field.
5. If necessary, set **CSS Common → overflow-y** to `auto`.

###### **Template Code**

<details>
  <summary>Details</summary>

```ejs
<%
/*
 * Select "dark" or "light".
 * All colors can be customized below.
 */
var themeMode = "light";

var themes = {
    dark: {
        background: "rgba(27, 31, 39, 0.96)",
        cardBackground: "rgba(255, 255, 255, 0.055)",
        cardHoverBackground: "rgba(255, 255, 255, 0.09)",
        border: "rgba(255, 255, 255, 0.09)",
        text: "#f4f6f8",
        mutedText: "#9ba6b2",
        incoming: "#43c982",
        outgoing: "#5fa8ff",
        unknown: "#a9b0b8",
        accentBackground: "rgba(95, 168, 255, 0.14)",
        scrollbarThumb: "rgba(255, 255, 255, 0.22)",
        shadow: "rgba(0, 0, 0, 0.24)"
    },
    light: {
        background: "rgba(248, 250, 252, 0.98)",
        cardBackground: "#ffffff",
        cardHoverBackground: "#f1f5f9",
        border: "rgba(15, 23, 42, 0.12)",
        text: "#172033",
        mutedText: "#667085",
        incoming: "#168653",
        outgoing: "#2563c9",
        unknown: "#6b7280",
        accentBackground: "rgba(37, 99, 201, 0.12)",
        scrollbarThumb: "rgba(15, 23, 42, 0.25)",
        shadow: "rgba(15, 23, 42, 0.16)"
    }
};

var theme = themes[themeMode] || themes.dark;
var calls = [];
var errorMessage = "";

try {
    calls = typeof data === "string" ? JSON.parse(data) : data;

    if (!Array.isArray(calls) && calls) {
        calls = calls.data || calls.items || calls.result;
    }

    if (!Array.isArray(calls)) {
        calls = [];
        errorMessage = "The data point does not contain a JSON array.";
    }
} catch (error) {
    calls = [];
    errorMessage = "The JSON data could not be processed.";
}

function safe(value, fallback) {
    return value === undefined || value === null || value === ""
        ? (fallback || "")
        : String(value);
}

function getInitials(name) {
    var parts = safe(name, "?").trim().split(/\s+/);

    if (parts.length === 1) {
        return parts[0].substring(0, 2).toUpperCase();
    }

    return (
        parts[0].substring(0, 1) +
        parts[parts.length - 1].substring(0, 1)
    ).toUpperCase();
}

function getDirection(call) {
    if (call.sym === ">") {
        return { css: "outgoing", icon: "↗", label: "Outgoing" };
    }

    if (call.sym === "<") {
        return { css: "incoming", icon: "↙", label: "Incoming" };
    }

    return { css: "unknown", icon: "↔", label: "Unknown" };
}

function getDateParts(value) {
    var parts = safe(value, "–").split(" ");

    return {
        date: parts[0] || "–",
        time: parts.slice(1).join(" ") || ""
    };
}
%>

<style>
#w_id_<%- widgetid %> {
    width: 100%;
    height: 100%;
    overflow: hidden;
    color: <%- theme.text %>;
    font-family: Inter, "Segoe UI", Roboto, Arial, sans-serif;
}

#w_id_<%- widgetid %> * {
    box-sizing: border-box;
}

#w_id_<%- widgetid %> .call-widget {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: <%- theme.background %>;
    border: 1px solid <%- theme.border %>;
    border-radius: 16px;
    box-shadow: 0 12px 35px <%- theme.shadow %>;
}

#w_id_<%- widgetid %> .call-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 18px 20px 14px;
    border-bottom: 1px solid <%- theme.border %>;
}

#w_id_<%- widgetid %> .call-heading {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
}

#w_id_<%- widgetid %> .call-header-icon {
    width: 38px;
    height: 38px;
    display: grid;
    flex: 0 0 38px;
    place-items: center;
    border-radius: 11px;
    background: <%- theme.accentBackground %>;
    font-size: 20px;
}

#w_id_<%- widgetid %> .call-title {
    margin: 0;
    font-size: 18px;
}

#w_id_<%- widgetid %> .call-subtitle,
#w_id_<%- widgetid %> .call-number,
#w_id_<%- widgetid %> .call-device,
#w_id_<%- widgetid %> .call-target-value,
#w_id_<%- widgetid %> .call-date {
    overflow: hidden;
    color: <%- theme.mutedText %>;
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#w_id_<%- widgetid %> .call-count {
    padding: 6px 10px;
    border: 1px solid <%- theme.border %>;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 700;
}

#w_id_<%- widgetid %> .call-list {
    min-height: 0;
    flex: 1 1 auto;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 10px;
    scrollbar-color: <%- theme.scrollbarThumb %> transparent;
    scrollbar-width: thin;
}

#w_id_<%- widgetid %> .call-card {
    position: relative;
    display: grid;
    grid-template-columns: 48px minmax(130px, 1.4fr) minmax(125px, 1fr) auto;
    align-items: center;
    gap: 13px;
    margin-bottom: 8px;
    padding: 13px 14px;
    overflow: hidden;
    background: <%- theme.cardBackground %>;
    border: 1px solid <%- theme.border %>;
    border-radius: 13px;
    transition: background 150ms ease, transform 150ms ease;
}

#w_id_<%- widgetid %> .call-card:hover {
    background: <%- theme.cardHoverBackground %>;
    transform: translateY(-1px);
}

#w_id_<%- widgetid %> .call-card::before {
    position: absolute;
    top: 9px;
    bottom: 9px;
    left: 0;
    width: 3px;
    border-radius: 0 4px 4px 0;
    background: <%- theme.unknown %>;
    content: "";
}

#w_id_<%- widgetid %> .call-card.incoming::before {
    background: <%- theme.incoming %>;
}

#w_id_<%- widgetid %> .call-card.outgoing::before {
    background: <%- theme.outgoing %>;
}

#w_id_<%- widgetid %> .call-avatar {
    position: relative;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border: 1px solid <%- theme.border %>;
    border-radius: 50%;
    font-size: 13px;
    font-weight: 700;
}

#w_id_<%- widgetid %> .call-direction {
    position: absolute;
    right: -3px;
    bottom: -3px;
    width: 20px;
    height: 20px;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: <%- theme.unknown %>;
    color: #ffffff;
    font-size: 12px;
}

#w_id_<%- widgetid %> .incoming .call-direction {
    background: <%- theme.incoming %>;
}

#w_id_<%- widgetid %> .outgoing .call-direction {
    background: <%- theme.outgoing %>;
}

#w_id_<%- widgetid %> .call-person,
#w_id_<%- widgetid %> .call-target {
    min-width: 0;
}

#w_id_<%- widgetid %> .call-name,
#w_id_<%- widgetid %> .call-time {
    overflow: hidden;
    margin-bottom: 4px;
    font-size: 14px;
    font-weight: 700;
    text-overflow: ellipsis;
    white-space: nowrap;
}

#w_id_<%- widgetid %> .call-target-label,
#w_id_<%- widgetid %> .call-status {
    color: <%- theme.mutedText %>;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
}

#w_id_<%- widgetid %> .call-status {
    margin-top: 6px;
}

#w_id_<%- widgetid %> .incoming .call-status {
    color: <%- theme.incoming %>;
}

#w_id_<%- widgetid %> .outgoing .call-status {
    color: <%- theme.outgoing %>;
}

#w_id_<%- widgetid %> .call-meta {
    min-width: 92px;
    text-align: right;
}

#w_id_<%- widgetid %> .call-duration {
    display: inline-block;
    margin-top: 7px;
    padding: 4px 7px;
    border-radius: 7px;
    background: <%- theme.accentBackground %>;
    color: <%- theme.mutedText %>;
    font-size: 11px;
}

#w_id_<%- widgetid %> .call-empty {
    height: 100%;
    display: grid;
    place-items: center;
    padding: 30px;
    color: <%- theme.mutedText %>;
    text-align: center;
}

@media (max-width: 650px) {
    #w_id_<%- widgetid %> .call-card {
        grid-template-columns: 45px minmax(0, 1fr) auto;
    }

    #w_id_<%- widgetid %> .call-target {
        display: none;
    }
}

@media (max-width: 420px) {
    #w_id_<%- widgetid %> .call-subtitle {
        display: none;
    }

    #w_id_<%- widgetid %> .call-card {
        grid-template-columns: 42px minmax(0, 1fr);
    }

    #w_id_<%- widgetid %> .call-meta {
        grid-column: 2;
        text-align: left;
    }
}
</style>

<div class="call-widget">
    <div class="call-header">
        <div class="call-heading">
            <div class="call-header-icon">☎</div>
            <div>
                <h2 class="call-title">Call list</h2>
                <div class="call-subtitle">Recent connections</div>
            </div>
        </div>
        <div class="call-count"><%= calls.length %></div>
    </div>

    <div class="call-list">
        <% if (calls.length === 0) { %>
            <div class="call-empty">
                <div>
                    <div><%= errorMessage ? "⚠" : "☎" %></div>
                    <strong><%= errorMessage ? "Data error" : "No calls" %></strong>
                    <div>
                        <%= errorMessage || "There are currently no call-list entries." %>
                    </div>
                </div>
            </div>
        <% } else { %>
            <% calls.forEach(function(call) { %>
                <%
                    var direction = getDirection(call);
                    var dateParts = getDateParts(call.date);
                    var displayName = safe(call.name, "Unknown caller");
                    var displayNumber = safe(
                        call.external || call.caller,
                        "No phone number"
                    );
                    var target = safe(
                        call.callednumber || call.called,
                        "–"
                    );
                %>
                <div class="call-card <%- direction.css %>">
                    <div class="call-avatar">
                        <span><%= getInitials(displayName) %></span>
                        <span class="call-direction" title="<%= direction.label %>">
                            <%= direction.icon %>
                        </span>
                    </div>

                    <div class="call-person">
                        <div class="call-name" title="<%= displayName %>">
                            <%= displayName %>
                        </div>
                        <div class="call-number" title="<%= displayNumber %>">
                            <%= displayNumber %>
                        </div>
                        <% if (call.device) { %>
                            <div class="call-device">
                                <%= safe(call.device) %>
                                <% if (call.port) { %>
                                    · Port <%= safe(call.port) %>
                                <% } %>
                            </div>
                        <% } %>
                    </div>

                    <div class="call-target">
                        <div class="call-target-label">Destination</div>
                        <div class="call-target-value" title="<%= target %>">
                            <%= target %>
                        </div>
                        <div class="call-status"><%= direction.label %></div>
                    </div>

                    <div class="call-meta">
                        <div class="call-time"><%= dateParts.time || "–" %></div>
                        <div class="call-date"><%= dateParts.date %></div>
                        <div class="call-duration">
                            ◷ <%= safe(call.duration, "0:00") %>
                        </div>
                    </div>
                </div>
            <% }); %>
        <% } %>
    </div>
</div>
```

</details>

---

##### **Theme and Color Configuration**

Select the predefined theme near the beginning of the template:

```javascript
var themeMode = 'light';
```

Available values are:

- `light`
- `dark`

Every color used by the widget can be changed in the `themes` object. Valid
values include hexadecimal colors, `rgb()`, `rgba()`, and `transparent`.

---

##### **Scrolling and Widget Size**

The call list itself uses `overflow-y: auto`. If the VIS widget container still
grows beyond its configured height, also set:

```text
CSS Common → overflow-y → auto
```

This limits the content to the widget height and shows a vertical scrollbar
when more call entries are available than can be displayed.

---

##### **Notes**

- The JSON data point is the only required binding; the widget updates when
  that state changes.
- The template accepts the array directly and also checks the common wrapper
  properties `data`, `items`, and `result`.
- All CSS selectors are scoped with `widgetid`, so multiple call-list widgets
  can be used in the same view.
- Change the field mappings in the rendering section if your call-list adapter
  returns a different JSON structure.
