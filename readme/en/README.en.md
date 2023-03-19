# text-replace

## Navigation

- [text-replace](#text-replace)
	- [Navigation](#navigation)
	- [What is it](#what-is-it)
	- [Getting started](#getting-started)
		- [Installing](#installing)
		- [First variable](#first-variable)
		- [Options](#options)
			- [Global options](#global-options)
			- [Local options](#local-options)
			- [Options priority](#options-priority)
		- [Template options](#template-options)

## What is it

<a name="what-is-it"></a>

text-replace is npm-package allowing you to find and replace variables to some values.
The last ones can be modificated by your own options.

By the way, it's my first more or less finished project and, at the same time, first library. I count on your help and support!

## Getting started

<a name="getting-started"></a>

### Installing

<a name="installing"></a>

```
npm install text-replace
```

### First variable

<a name="first-variable"></a>
Let's create our first variable VAR with value "vaaar"!

TypeScript

```TypeScript
import Configure, { ConfigureVariable } from "text-replace";

const VAR: ConfigureVariable = {
  name: "VAR",
  value: "vaaar",
  options: []
}
```

JavaScript

```JavaScript
import Configure from "text-replace";

/** @type {import("text-replace").ConfigureVariable} */
const VAR = {
  name: "VAR",
  value: "vaaar",
  options: []
}
```

CommonJS

```JavaScript
const {default: Configure} = require("text-replace");

/** @type {import("text-replace").ConfigureVariable} */
const VAR = {
  name: "VAR",
  value: "vaaar",
  options: []
}
```

Now add this variable in the list of all avaible variables

```JavaScript
const replace = Configure({
  globalOptions: [],
  variables: [VAR]
})
```

**The Configure function returns another function replace, which finds and replaces all transmitted variables**

All that's left to do is to hang text over to replace function.

_It is worth noting that variables are looked for in the text by given template:
"$[VARIABLE_NAME:OPTION_1:OPTION_2:...:OPTION_N]".
It will be said below how to change this template(See: ["Template options"]("#template-options"))_.

### Options

<a name="options"></a>

To start with, it's worth saying that there can be as many variables as you like!
They can be called whatever you like!
The options can even absolutely replace the source variable's value!

**But the last one is not recommended to do. In the examples it's done only for clarity!**

You're not limited in this respect.

Classification of options:

- By affiliation:
  - Local (They bound only to **ONE** variable. Don't work with other variables. Local variables priority is higher than global ones)
  - Global (They work with any variables)
- By functionallity:
  - Without parameters
  - With parameters

#### Global options

<a name="global-options"></a>

You can make your option global, if it doesn't matter, what variable your option will be applied to,
and the functionality of option is common for any strings.

For example:

- UPPER - make all letters big
- RANGE(start, end) - returns string's range from start to end not including

Global options are passed to the globalOptions parameter as an array.

To avoid repeating, let's take the VAR variable from the previous example.
And in order to create new option, it's necessary to import Option class:

TypeScript

```TypeScript
import { Option } from "text-replace";

const UPPER = new Option("UPPER", (value) => value.toUpperCase());

// Generic support
const RANGE = new Option<[number, number]>("RANGE", (value, range) => {
  if (!range) return value;
  const [start = 0, end = value.length] = range;

  return value.slice(start, end);
});
```

JavaScript

```JavaScript
import { Option } from "text-replace";

const UPPER = new Option("UPPER", (value) => value.toUpperCase());

const RANGE = new Option("RANGE", (value, range) => {
  if (!range) return value;
  const [start = 0, end = value.length] = range;

  return value.slice(start, end);
});
```

CommonJS

```JavaScript
const { Option } = require("text-replace");

const UPPER = new Option("UPPER", function (value) {
  return value.toUpperCase()
});

const RANGE = new Option("RANGE", function (value, range) {
  if (!range) return value;
  const [start = 0, end = value.length] = range;

  return value.slice(start, end);
});
```

Let's add new two options in the globalOptions parameter.

```JavaScript
const replace = Configure({
  globalOptions: [UPPER, RANGE],
  variables: [VAR]
})

replace("$[VAR:UPPER] $[VAR:RANGE(0, 2)]")
// Expected: "$[VAR:UPPER] $[VAR:RANGE(0, 2)]" -> "VAAAR VA"
```

#### Local options

<a name="local-options"></a>

What if we want some options to work only for one variable? How do we implement this?
In the beginning, let's imagine that we have our own currentDate class with methods getDay, getMonth and getYear.

```JavaScript
class CurrentDate {
  date: Date;

  constructor() {
    this.date = new Date();
  }

  getDay() {
    return this.date.getDate().toString();
  }

  getMonth() {
    return this.date.getMonth().toString();
  }

  getYear() {
    return this.date.getFullYear().toString();
  }
}

const date = new CurrentDate();
date.getDay() // current month's day
date.getMonth() // current month
date.getYear() // current year
```

Maybe, you noticed options parameter with an empty array, when we were creating object of variable.
That's the one what is responsible for what options will be bound to this variable.

Now let's create CURRENT_DATE variable and the options for it.

TypeScript

```JavaScript
const DAY = new Option("DAY", (value) => {
  return new Date(value).getDate().toString();
});

const MONTH = new Option("MONTH", (value) => {
  return new Date(value).getDate().toString();
});

const YEAR = new Option("YEAR", (value) => {
  return new Date(value).getDate().toString();
});

const CURRENT_DATE: ConfigureVariable = {
  name: "CURRENT_DATE",
  value: () => new Date().toString(),
  options: [DAY, MONTH, YEAR],
};
```

JavaScript

```JavaScript
const DAY = new Option("DAY", (value) => {
  return new Date(value).getDate().toString();
});

const MONTH = new Option("MONTH", (value) => {
  return new Date(value).getDate().toString();
});

const YEAR = new Option("YEAR", (value) => {
  return new Date(value).getDate().toString();
});

const CURRENT_DATE = {
  name: "CURRENT_DATE",
  value: () => new Date().toString(),
  options: [DAY, MONTH, YEAR],
};
```

CommonJS

```JavaScript
const DAY = new Option("DAY", function (value) {
  return new Date(value).getDate().toString();
});

const MONTH = new Option("MONTH", function (value) {
  return new Date(value).getDate().toString();
});

const YEAR = new Option("YEAR", function (value) {
  return new Date(value).getDate().toString();
});

const CURRENT_DATE = {
  name: "CURRENT_DATE",
  value: function() {
    return new Date().toString()
  },
  options: [DAY, MONTH, YEAR],
};
```

```JavaScript
const replace = Configure({
  globalOptions: [],
  variables: [VAR, CURRENT_DATE]
});

replace("$[CURRENT_DATE:DAY] | $[CURRENT_DATE:MONTH] | $[CURRENT_DAY:YEAR] $[VAR:YEAR]");
// Expected: (current month's day) | (current month) | (current year) vaaar
```

As we can see, YEAR options has been ignored, because it is not global options and not bound to the VAR variable.
By the way, if you noticed, variable's value can be not only string, but also a function returns a string!
Maybe, it will be useful for you somewhen.

#### Options priority

<a name="options-priority"></a>

As it was said above, local options take priority over global ones. What does this mean for us?
It means that we can create two options with the same name, but they will do different things.

TypeScript

```TypeScript
const LOCAL_OPTION = new Option("OPTION", () => "local");
const GLOBAL_OPTION = new Option("OPTION", () => "global");

const VAR: ConfigureVariable = {
  name: "VAR",
  value: "vaaar",
  options: [LOCAL_OPTION],
};
```

JavaScript

```JavaScript
const LOCAL_OPTION = new Option("OPTION", () => "local");
const GLOBAL_OPTION = new Option("OPTION", () => "global");

const VAR = {
  name: "VAR",
  value: "vaaar",
  options: [LOCAL_OPTION],
};
```

CommonJS

```JavaScript
const LOCAL_OPTION = new Option("OPTION", function() {
	return "local"
});
const GLOBAL_OPTION = new Option("OPTION", function () {
	return "global"
});

const VAR = {
  name: "VAR",
  value: "vaaar",
  options: [LOCAL_OPTION],
};
```

```JavaScript
const replace = Configure({
  globalOptions: [GLOBAL_OPTION],
  variables: [CURRENT_DATE, VAR],
});

replace("$[VAR:OPTION] $[DATE:OPTION]");
// Expected: "$[VAR:OPTION] $[CURRENT_DATE:OPTION]" -> "local global"
```

### Template options

Let's imagine that you suddenly want to change a template.

Configure function has the special parameter - templateOptions!
There are several options for customizing in that.

```JavaScript

templateOptions: {
	prefix = "$" // character that starts the pattern
	suffix = ""// character at the end of the pattern
	optionSeparator = ":" // character between option names
	begin = "[" // character following the prefix
	end = "]" // character before suffix
	argSeparator = ", " // character between option arguments
}

```

```JavaScript
const replace = Configure({
	globalOptions: [UPPER, RANGE]
	variables: [VAR],
	templateOptions: {
		prefix: "",
		begin: "__",
		end: "__",
		argSeparator: "|"
	}
})

replace("__VAR:UPPER:RANGE(0|2)__")
// Expected: "__VAR:UPPER:RANGE(0|2)__" -> "VA"
```
