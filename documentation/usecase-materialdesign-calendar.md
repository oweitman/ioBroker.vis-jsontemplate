#### Use case for a responsive calendar

##### **Introduction**

This use case recreates the central functionality of the VIS-1
`vis-materialdesign` calendar with a standalone `JSON Template` widget.

The template provides:

- month, week, and day views
- previous, today, and next navigation
- date selection and configurable drill-down views
- touch swipe navigation
- configurable visible weekdays and week numbers
- configurable time range and interval size
- all-day, multi-day, and timed events
- individual event background and text colors
- responsive light and dark themes
- empty-state and invalid-data messages

It is based on the behavior and settings of the original
[vis-materialdesign calendar widget](https://github.com/Scrounger/ioBroker.vis-materialdesign/blob/master/widgets/materialdesign/js/widgets/materialdesign.calendar.js),
but does not require Vue, Vuetify, Moment.js, Material Design Icons, or the
`vis-materialdesign` adapter.

---

##### **JSON Data**

Select a data point containing a JSON array. Each event requires `name`,
`start`, and `end`. The optional `color` and `colorText` fields control the
event colors.

Date-only values create all-day events. Date and time values create timed
events in the week and day views.

```json
[
    {
        "name": "Project meeting",
        "start": "2026-07-29T09:30:00",
        "end": "2026-07-29T11:00:00",
        "color": "#2563eb",
        "colorText": "#ffffff"
    },
    {
        "name": "Summer holiday",
        "start": "2026-08-03",
        "end": "2026-08-09",
        "color": "#16a34a",
        "colorText": "#ffffff"
    },
    {
        "name": "Dentist",
        "start": "2026-08-05T14:15:00",
        "end": "2026-08-05T15:00:00",
        "color": "#dc2626",
        "colorText": "#ffffff"
    }
]
```

The template also accepts the array in one of these wrapper properties:
`events`, `items`, `data`, or `result`.

---

##### **Integration into VIS**

1. Add the `JSON Template` widget to a VIS or VIS-2 view.
2. Select the calendar JSON data point in the **Data point** field.
3. Paste the complete template below into the **Template** field.
4. Give the widget enough space, for example 900 x 650 pixels.
5. If necessary, set **CSS Common -> overflow** to `hidden`.

###### **Template Code**

<details>
  <summary>Details</summary>

> During development, the complete template is maintained in
> [`materialdesign-calendar-template.ejs`](materialdesign-calendar-template.ejs).
> It will be embedded here after the live test has been completed.

</details>

---

##### **Configuration**

The most important options are located in `calendarConfig` at the beginning
of the template.

| Option | Description |
| --- | --- |
| `initialView` | Initial `month`, `week`, or `day` view |
| `theme` | `dark` or `light` |
| `locale` | Browser locale used for dates and times, for example `en-US` or `de-DE` |
| `weekdays` | Visible weekdays using JavaScript day numbers, where 0 is Sunday |
| `showWeekNumbers` | Shows ISO week numbers in the month view |
| `showControlLabels` | Shows or hides text next to the control icons |
| `monthClickView` | View opened after selecting a day in the month view |
| `weekClickView` | View opened after selecting a day in the week view |
| `dayClickView` | View opened after selecting the day header in the day view |
| `timeAxisStartHour` | First visible hour in week and day views |
| `timeAxisEndHour` | Last visible hour in week and day views |
| `intervalMinutes` | Size of one time-axis interval |
| `intervalHeight` | Pixel height of one time-axis interval |
| `eventMinHeight` | Minimum pixel height of a timed event |

To display only workdays, use:

```javascript
weekdays: [1, 2, 3, 4, 5],
```

To use German date labels, use:

```javascript
locale: "de-DE",
```

---

##### **Event Fields**

| Field | Required | Description |
| --- | --- | --- |
| `name` | Yes | Event title |
| `start` | Yes | Start date or date and time |
| `end` | Yes | End date or date and time |
| `color` | No | Event background color; defaults to blue |
| `colorText` | No | Event text color; defaults to white |

Supported examples:

```text
2026-08-03
2026-08-03T09:30:00
2026-08-03T09:30:00+02:00
```

Date-only events are treated as all-day events. For a one-day all-day event,
use the same date for `start` and `end`.

---

##### **Technical Notes**

- No external scripts, styles, icon fonts, or adapter widgets are required.
- All selectors are scoped to `widgetid`, so multiple instances can be used
  in the same view.
- The JSON data is transferred from EJS to browser-side JavaScript through a
  unique `window` property without serialization.
- Event titles are inserted using `textContent`, not `innerHTML`.
- Event listeners are removed when the widget rerenders. The unique global
  data object is overwritten by the next EJS evaluation and intentionally
  retained during cleanup so that React development and remount cycles can
  execute the generated script again.
- No `setInterval()` is used.
- The current-time line is calculated whenever the widget is rendered.
- Overlapping timed events are slightly offset. This is a lightweight
  replacement for Vuetify's `column` overlap mode, not a full scheduling
  layout engine.

##### **Differences from the Original Widget**

The original widget uses Vue, Vuetify, Moment.js, Material Design Components,
theme data points, and haptic-feedback helpers from `vis-materialdesign`.
This standalone template intentionally omits those dependencies. It therefore
does not reproduce Vuetify ripple effects, adapter-managed theme subscriptions,
click sounds, or device vibration.

The calendar navigation, views, date drill-down, week numbers, time axis,
event colors, responsive layout, and swipe gestures are implemented directly
with EJS, HTML, CSS, and browser JavaScript.
