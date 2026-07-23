# Creating Templates with AI

The _ioBroker.vis-jsontemplate_ adapter displays JSON data in VIS or VIS-2 using
a template. A template can combine HTML, CSS, JavaScript, and EJS expressions.

AI can assist in creating such templates.
It is crucial to describe the requirements as specifically as possible.

## What information does the AI ​​need?

Include the following elements in your prompt whenever possible:

### 1. Task

Briefly describe what is to be displayed.

Examples:

- Weather data as cards
- A device list as a table
- Appointments as a list
- Sensor data as a dashboard

### 2. Sample Data

Include a realistic example of the JSON data point.

```json
{
    "devices": [
        {
            "name": "Living Room",
            "temperature": 22.4,
            "online": true
        }
    ]
}
```

Without sample data, the AI ​​has to guess the data structure.

### 3. Desired Display

Describe the layout and key content.

Examples:

- Responsive cards
- Table with three columns
- Large temperature display
- Online devices green, offline devices gray
- Suitable for smartphones and tablets

### 4. Functions

Describe whether the template should only display data or also enable actions.

Examples:

- Filter list
- Sort entries
- Display a button
- Change data point via `vis.setValue()`
- Retrieve data via an adapter

### 5. Technical Specifications

The AI ​​should observe the following rules:

- The template uses EJS.
- The JSON content is stored in the `data` variable.
- Additional data points are available in `dp`.
- JavaScript output is generated using, for example, `<%- data.value %>`.
- Loops and conditional statements are placed within `<% ... %>`.
- CSS braces must be on separate lines in VIS.
- `setInterval()` must not be used.
- Use `setTimeout()` instead for repetitive processes.
- The result must be directly copyable into the `json_template` field.

## Template for an AI Prompt

Copy the following prompt and replace the text in square brackets.

```text
Create a complete template for the ioBroker widget
"JSON Template" from the vis-jsontemplate adapter.

TASK
[Describe what should be displayed.]

JSON EXAMPLE

[Insert the complete example data here.]

VISUALS
[Describe layout, colors, sizes, and desired elements.]

FUNCTIONS
[Describe filters, sorting, buttons, or other functions.
If no interaction is required, write: Display only.]

TECHNICAL SPECIFICATIONS

- Use HTML, CSS, JavaScript, and EJS only as necessary.
- The JSON data is located in the `data` variable.
- Use `<%- ... %>` to output values.
- Use `<% ... %>` for loops and conditions.
- Check for the existence of optional values ​​or arrays before accessing them.
- Do not use external libraries.
- Do not use `setInterval()`.
- Place opening and closing CSS braces on separate lines.
- Limit CSS and JavaScript to this widget. Use the widget ID
  `#<%- widgetid %>` for this purpose.
- The result must be directly insertable into the `json_template` field.

OUTPUT FORMAT

1. First, output only the complete template within a code block.
2. Then, briefly explain the key sections.
3. Next, list the required widget settings and additional
   data points.
4. Do not invent fields that are not included in the JSON example.
```

## Example Prompt

```text

Create a complete template for the ioBroker widget
"JSON Template" from the vis-jsontemplate adapter. TASK
Display a list of rooms with their temperature and online status.

JSON EXAMPLE

{
  "devices": [
    {
      "name": "Living Room",
      "temperature": 22.4,
      "online": true
    },
    {
      "name": "Bedroom",
      "temperature": 19.8,
      "online": false
    }
  ]
}

### VISUALIZATION

Each room should be displayed as a compact card. The room name appears
at the top, with the temperature displayed in a large font below it. Online devices
get a green status dot; offline devices get a gray status dot. The cards
should automatically adjust to the available width.

### FUNCTIONS

Display only.

### TECHNICAL REQUIREMENTS

- Use HTML, CSS, JavaScript, and EJS only as necessary.
- The JSON data is contained in the variable `data`.
- Use `<%- ... %>` to output values.
- Use `<% ... %>` for loops and conditional statements.
- Check if `data.devices` exists and is an array.
- If data is missing, display the text "No device data available".
- Do not use external libraries.
- Do not use `setInterval()`.
- Place opening and closing CSS braces on their own lines.
- Scope the CSS to `#<%- widgetid %>`.
- The result must be suitable for direct insertion into the `json_template` field.

### OUTPUT FORMAT

1. Complete template in a code block
2. Brief explanation
3. Required widget settings
```

## Explanation of the Example Prompt

### Task

This section defines the functional objective for the AI,
enabling it to identify which information is relevant.

### JSON Example

The example defines the actual data structure. This allows the AI ​​to
recognize that it needs to iterate over `data.devices` and
access properties such as `device.name`.

### Presentation

This section describes the layout and visual rules. The more specific this
section is, the fewer design assumptions the AI ​​needs to make.

### Functions

This section distinguishes between a simple display and an interactive template.
Interactive functions usually require additional JavaScript and, potentially,
further data points.

### Technical Specifications

These rules prevent common errors in VIS and the adapter. Key requirements
include the correct use of EJS tags, properly scoped CSS, and
avoiding the use of `setInterval()`.

### Output Format

This specifies that the AI ​​should first provide a ready-to-use code block and
separate any supplementary explanations from it.

## Review Guidelines

AI-generated code should be reviewed before being deployed in a production environment:

- Do all field names match the JSON data points?
- Are missing or empty values ​​handled correctly?
- Is the CSS scoped to the current widget?
- Does the code avoid assuming the existence of non-existent data points or functions?
- Does the code avoid using `setInterval()`?
- Does the template work with the provided sample data?

If errors occur, simply informing the AI ​​that the template isn't working is
insufficient. It is more helpful to provide the specific error message,
the actual JSON data, and the template generated so far.
