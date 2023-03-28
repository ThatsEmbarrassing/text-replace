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
			- [Optional parameters](#optional-parameters)
		- [Template options](#template-options)
		- [Error handling](#error-handling)

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

#### Optional parameters

<a name="optional-parameters"></a>

When we call function or method, sometimes we need to skip a parameter.
In this package you can also do it!

Take the RANGE option. What if we want to take a diapason from 1 to the end?
Or from the beginning to 5 index?

It's done like that:

```JavaScript
	replace("$[FILENAME:WITHOUT_EXT:RANGE(1, )]"); // Expected: pplication
	replace("$[FILENAME:RANGE(, 5)]"); // Expected: appli
```

It works with any number of parameters. It will also work if you want to skip several parameters.
**However, keep in mind that your option must handle such situations.
Otherwise, its behavior can be unpredictable!**

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

### Error handling

<a name="error-handling"></a>

Starting with version 1.1.0, you have an ability to create and handle your own errors.

Let's create the option REPEAT with two parameters:

_times_ - count of repeatings,

_separator_ - separator between repeating strings(by default it equals the empty string)

TypeScript:

```TypeScript
const REPEAT = new Option<[number | undefined, string | undefined]>("REPEAT", (value, args) => {
	if (!args) throw new Error("Requires arguments to REPEAT option");
	const [times, separator = ""] = args;
	if (!times) throw new Error("Times parameter is missing");

	return new Array(times).fill(value).join(separator);
});
```

JavaScript:

```JavaScript
const REPEAT = new Option("REPEAT", (value, args) => {
	if (!args) throw new Error("Requires arguments to REPEAT option");
	const [times, separator = ""] = args;
	if (!times) throw new Error("Times parameter is missing");

	return new Array(times).fill(value).join(separator);
});
```

CommonJS:

```JavaScript
const REPEAT = new Option("REPEAT", function (value, args) {
	if (!args) throw new Error("Requires arguments to REPEAT option");
	const [times, separator = ""] = args;
	if (!times) throw new Error("Times parameter is missing");

	return new Array(times).fill(value).join(separator);
});
```

```JavaScript
const replace = Configure({
	globalOptions: [REPEAT],
	variables: [FILENAME]
});

replace("$[FILENAME:REPEAT]");
// Expected: "$[FILENAME:REPEAT] -> UnknownError: Error with message "Requires arguments to REPEAT option"

replace("$[FILENAME:REPEAT(, |)]");
// Expected: "$[FILENAME:REPEAT(, |)]" -> UnknownError: Error with message "Times parameter is missing"
```

If we want custom error output, then we can do this by following way:

1.Сreate our own error's classes.

TypeScript:

```TypeScript
import { BaseError } from "text-replace/errors";
import type { BaseErrorConstructor } from "text-replace/errors";
import type { ErrorHandler } from "text-replace/error-handlers"

type RepeatOptionErrorName = "ARGUMENTS_IS_MISSING" | "TIMES_PARAMETER_IS_MISSING";

// In the BaseErrorConstructor parameter we're all values to name propetry
type BaseRepeatOptionErrorConstructor = BaseErrorConstructor<RepeatOptionErrorName>;

type ArgumentsIsMissingErrorConstructor = Omit<BaseRepeatOptionErrorConstructor, "name">;

type TimesParameterIsMissingErrorConstructor = ArgumentsIsMissingErrorConstructor;

// And the same here
class BaseRepeatOptionError extends BaseError<RepeatOptionErrorName> {
	constructor(options: BaseRepeatOptionErrorConstructor) {
		super(options);
	}
}

class ArgumentsIsMissingError extends BaseRepeatOptionError {
	constructor({ errorMessage }: ArgumentsIsMissingErrorConstructor) {
		super({ name: "ArgumentsIsMissingError", errorMessage });
	}
}

class TimesParameterIsMissingError extends BaseRepeatOptionError {
	constructor({ errorMessage }: TimesParameterIsMissingErrorConstructor) {
		super({ name: "TimesParameterIsMissingError", errorMessage });
	}
}
```

JavaScript:

```JavaScript
import { BaseError } from "text-replace/errors";

class BaseRepeatOptionError extends BaseError {
	constructor(options: BaseRepeatOptionErrorConstructor) {
		super(options);
	}
}

class ArgumentsIsMissingError extends BaseRepeatOptionError {
	constructor({ errorMessage }) {
		super({ name: "ArgumentsIsMissingErrorG", errorMessage });
	}
}

class TimesParameterIsMissingError extends BaseRepeatOptionError {
	constructor({ errorMessage }) {
		super({ name: "TimesParameterIsMissingError", errorMessage });
	}
}
```

CommonJS:

```JavaScript
const { BaseError } = require("text-replace/errors");

class BaseRepeatOptionError extends BaseError {
	constructor(options: BaseRepeatOptionErrorConstructor) {
		super(options);
	}
}

class ArgumentsIsMissingError extends BaseRepeatOptionError {
	constructor({ errorMessage }) {
		super({ name: "ArgumentsIsMissingError", errorMessage });
	}
}

class TimesParameterIsMissingError extends BaseRepeatOptionError {
	constructor({ errorMessage }) {
		super({ name: "TimesParameterIsMissingError", errorMessage });
	}
}
```

2.Сreate the handlers to these errors.

TypeScript:

```TypeScript
class ArgumentsIsMissingErrorHandler implements ErrorHandler {
	handle(err: BaseError): string {
		return `${err.name}: Arguments is missing in REPEAT option`;
	}
}

class TimesParameterIsMissingErrorHandler implements ErrorHandler {
	handle(err: BaseError): string {
		return `${err.name}: Times parameter is missing in REPEAT option`;
	}
}
```

JavaScript:

```JavaScript
class ArgumentsIsMissingErrorHandler {
	handle(err) {
		return `${err.name}: Arguments is missing in REPEAT option`;
	}
}

class TimesParameterIsMissingErrorHandler {
	handle(err) {
		return `${err.name}: Times parameter is missing in REPEAT option`;
	}
}
```

CommonJS:

```JavaScript
class ArgumentsIsMissingErrorHandler {
	handle(err) {
		return `${err.name}: Arguments is missing in REPEAT option`;
	}
}

class TimesParameterIsMissingErrorHandler {
	handle(err) {
		return `${err.name}: Times parameter is missing in REPEAT option`;
	}
}
```

3.Сhange REPEAT option's code

```TypeScript
const REPEAT = new Option<[number | undefined, string | undefined]>("REPEAT", (value, args) => {
	if (!args) throw new ArgumentsIsMissingError();
	const [times, separator = ""] = args;
	if (!times) throw new TimesParameterIsMissingError();

	return new Array(times).fill(value).join(separator);
});
```

JavaScript:

```JavaScript
const REPEAT = new Option("REPEAT", (value, args) => {
	if (!args) throw new ArgumentsIsMissingError();
	const [times, separator = ""] = args;
	if (!times) throw new TimesParameterIsMissingError();

	return new Array(times).fill(value).join(separator);
});
```

CommonJS:

```JavaScript
const REPEAT = new Option("REPEAT", function (value, args) {
	if (!args) throw new ArgumentsIsMissingError();
	const [times, separator = ""] = args;
	if (!times) throw new TimesParameterIsMissingError();

	return new Array(times).fill(value).join(separator);
});
```

4.Сreate instance of ErrorHandle class and add it to the Configure funciton's parameter

```JavaScript
import { ErrorHandle } from "text-replace/error-handlers"

const errorHandle = new ErrorHandle();

errorHandle.use("ArgumentsIsMissingError", new ArgumentsIsMissingErrorHandler());
errorHandle.use("TimesParameterIsMissingError", new TimesParameterIsMissingErrorHandler())

const replace = Configure({
	globalOptions: [REPEAT],
	variables: [FILENAME],
	errorHandle
});

replace("$[FILENAME:REPEAT]");
// Expected: ArgumentsIsMissingError: Arguments is missing in REPEAT option

replace("$[FILENAME:REPEAT(, |)]");
// Expected: TimesParameterIsMissingError: Times parameter is missing in REPEAT option
```
