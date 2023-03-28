# text-replace

## Навигация

<a name="навигация"></a>

- [text-replace](#text-replace)
	- [Навигация](#навигация)
	- [Что это?](#что-это)
	- [Начало работы](#начало-работы)
		- [Установка](#установка)
		- [Первая переменная](#первая-переменная)
		- [Опции](#опции)
			- [Глобальные опции](#глобальные-опции)
			- [Локальные опции](#локальные-опции)
			- [Приоритет опций](#приоритет-опций)
			- [Необязательные параметры](#необязательные-параметры)
		- [Настройки шаблона](#настройки-шаблона)
		- [Обработка ошибок](#обработка-ошибок)

## Что это?

<a name="что-это"></a>

text-replace - npm-пакет, позволяющий вам находить и заменять переменные на какие-либо значения.
Последние можно также изменять с помощью ваших собственных опций.

К слову, это мой первый более-менее готовый проект, и, по совместительству, первая библиотека. Рассчитываю на вашу помощь и поддержку!

## Начало работы

<a name="начало-работы"></a>

### Установка

<a name="установка"></a>

```
npm install text-replace
```

### Первая переменная

<a name="первая-переменная"></a>

Создадим нашу первую переменную VAR со значеним "vaaar"!

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

Теперь добавим эту переменную в список всех доступных переменных

```JavaScript
const replace = Configure({
  globalOptions: [],
  variables: [VAR]
})
```

**Функция Configure возвращает нам другую функцию replace, которая находит и заменяет все переданные переменные.**

Осталось лишь передать в функцию replace текст.
*Стоит обратить внимание на то, что переменные в тексте находятся по заданному шаблону:
"$[НАЗВАНИЕ*ПЕРЕМЕННОЙ:ОПЦИЯ*1:ОПЦИЯ_2:...:ОПЦИЯ_N]". Ниже будет рассказано, как мы можем изменить данный шаблон.(См. ["Настройки шаблона"](#template-options))*

```JavaScript
replace("$[VAR]")
// Ожидаемый результат: "$[VAR]" -> "vaaar"
```

### Опции

<a name="опции"></a>

Для начала стоит сказать, что опций может быть сколько угодно!
Они могут быть названы как только угодно!
Опции могут даже полностью заменить исходное значение переменной!
**Последнее делать не рекомендуется. В примерах это делается исключительно для наглядности!**

Вы в этом плане никак не ограничены.

Классификация опций:

- По принадлежности:
  - Локальные (привязаны только к **ОДНОЙ** переменной. Не работают с другими переменными. Приоритет локальных опций выше глобальных)
  - Глобальные (работают с любыми переменными)
- По функциональности:
  - Без параметров
  - С параметрами

#### Глобальные опции

<a name="глобальные-опции"></a>

Вы можете сделать вашу опцию глобальной, если вам неважно, к какой переменной будет применена данная опция,
а сам функционал опции общий для любых строк.
Примеры:

- UPPER - делает все буквы строки большими
- RANGE(start, end) - возвращает диапозон строки от start до end невключительно

Глобальные функции передаются в параметр globalOptions функции Configure в виде массива.

Для того, чтобы избежать повторения, возьмём переменную VAR из предыдущего примера.
А чтобы нам создать новую опцию, необходимо импортировать класс Option.

TypeScript

```TypeScript
import { Option } from "text-replace";

const UPPER = new Option("UPPER", (value) => value.toUpperCase());

// Поддержка дженериков
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

Добавим две новые опции в параметр globalOptions

```JavaScript
const replace = Configure({
  globalOptions: [UPPER, RANGE],
  variables: [VAR]
})

replace("$[VAR:UPPER] $[VAR:RANGE(0, 2)]")
// Ожидаемый результат: "$[VAR:UPPER] $[VAR:RANGE(0, 2)]" -> "VAAAR VA"
```

#### Локальные опции

<a name="локальные-опции"></a>

Что, если мы хотим, чтобы какие-то опции работали лишь для одной переменной? Как это реализовать?

Для начала, давайте представим, что у нас есть собственный класс CurrentDate с методами getDay, getMonth, getYear.

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
date.getDay() // текущий день месяца
date.getMonth() // текущий месяц
date.getYear() // текущий год
```

Возможно, вы заметили свойство с пустым массивом options, когда мы создавали объект переменной.
Именно оно отвечает за то, какие опции будет привязаны к данной переменной.

Теперь создаём переменную CURRENT_DATE и сами опции для неё.

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
// Ожидаемый результат: (текущий день месяца) | (текущий месяц) | (текущий год) vaaar
```

Как мы видим, опция YEAR для переменной VAR была проигнорирована, т.к. не является глобальной и не привязана к переменной VAR.

Кстати говоря, если вы обратили внимание, значение переменной может быть не только строкой, но и функцией, возвращающей строку!
Возможно, вам это пригодится когда-нибудь.

#### Приоритет опций

<a name="приоритет-опций"></a>

Как было сказано выше, локальные опции приоритетнее, нежели глобальные. Что это значит для нас?
Это значит, что мы можем создать две опции с одним и тем же именем, но они будут делать совершенно разное.

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
// Ожидаемый результат: "$[VAR:OPTION] $[CURRENT_DATE:OPTION]" -> "local global"
```

#### Необязательные параметры

<a name="необязательные-параметры"></a>

Когда мы вызываем функцию или метод, иногда нам требуется пропустить параметр.
В данном пакете это также можно сделать!

Возьмём ту же опцию RANGE. Что, если мы хотим выбрать диапозон от 1 до самого конца?
Или же с самого начала до 5 индекса?

Это делается следующим образом:

```JavaScript
	replace("$[FILENAME:WITHOUT_EXT:RANGE(1, )]"); // Ожидаемый результат: pplication
	replace("$[FILENAME:RANGE(, 5)]"); // Ожидаемый результат: appli
```

Это работает с любым количеством параметров. И также будет работать, если вы захотите пропустить несколько параметров.
**Однако учтите, что в вашей опции должны быть предусмотрены подобные случаи.
Иначе, её поведение может быть непредсказуемым!**

### Настройки шаблона

<a name="настройки-шаблона"></a>

Представим, что вам вдруг захотелось поменять шаблон, используемый для поиска и замены переменных.

У функции Configure есть специальный параметр templateOptions!
В нём есть несколько опций для настройки шаблона.

```JavaScript

templateOptions: {
	prefix = "$" // символ, с которого начинается шаблон
	suffix = ""// символ, стоящий в конце шаблона
	optionSeparator = ":" // символ, стоящий между именами опций
	begin = "[" // символ, следующий после префикса
	end = "]" // символ, стоящий перед суффиксом
	argSeparator = ", " // символ, стоящий между аргументами опций
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
// Ожидаемый результат: "__VAR:UPPER:RANGE(0|2)__" -> "VA"
```

### Обработка ошибок

<a name="обработка-ошибок"></a>

Начиная с версии 1.1.0, у вас есть возможность создавать и обрабатывать собственные ошибки.

Создадим опцию REPEAT с двумя параметрами:

_times_ - количесво повторений,

_separator_ - разделитель между повторяющимися строками(по умолчанию равен пустой строке)

TypeScript:

```TypeScript
const REPEAT = new Option<[number | undefined, string | undefined]>("REPEAT", (value, args) => {
	if (!args) throw new Error("Требуется аргументы для опции REPEAT");
	const [times, separator = ""] = args;
	if (!times) throw new Error("Параметр times отсутствует");

	return new Array(times).fill(value).join(separator);
});
```

JavaScript:

```JavaScript
const REPEAT = new Option("REPEAT", (value, args) => {
	if (!args) throw new Error("Требуется аргументы для опции REPEAT");
	const [times, separator = ""] = args;
	if (!times) throw new Error("Параметр times отсутствует");

	return new Array(times).fill(value).join(separator);
});
```

CommonJS:

```JavaScript
const REPEAT = new Option("REPEAT", function (value, args) {
	if (!args) throw new Error("Требуются аргументы для опции REPEAT");
	const [times, separator = ""] = args;
	if (!times) throw new Error("Параметр times отсутствует");

	return new Array(times).fill(value).join(separator);
});
```

```JavaScript
const replace = Configure({
	globalOptions: [REPEAT],
	variables: [FILENAME]
});

replace("$[FILENAME:REPEAT]");
// Ожидаемый результат: "$[FILENAME:REPEAT] -> UnknownError: Error with message "Требуются аргументы для опции REPEAT"

replace("$[FILENAME:REPEAT(, |)]");
// Ожидаемый результат: "$[FILENAME:REPEAT(, |)]" -> UnknownError: Error with message "Параметр times отсутствует"
```

Если мы хотим кастомный вывод ошибки, то подобное можно провернуть следующим образом:

1.Создадим собственные классы ошибок.

TypeScript:

```TypeScript
import { BaseError } from "text-replace/errors";
import type { BaseErrorConstructor } from "text-replace/errors";
import type { ErrorHandler } from "text-replace/error-handlers"

type RepeatOptionErrorName = "ARGUMENTS_IS_MISSING" | "TIMES_PARAMETER_IS_MISSING";

// В параметр BaseErrorConstructor мы передаём все значения для свойства name
type BaseRepeatOptionErrorConstructor = BaseErrorConstructor<RepeatOptionErrorName>;

type ArgumentsIsMissingErrorConstructor = Omit<BaseRepeatOptionErrorConstructor, "name">;

type TimesParameterIsMissingErrorConstructor = ArgumentsIsMissingErrorConstructor;

// И здесь тоже
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
		super({ name: "ArgumentsIsMissingError", errorMessage });
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

2.Создадим обработчики для данных ошибок.

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

3.Изменим код опции REPEAT

TypeScript:

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

4.Создадим экземпляр класса ErrorHandle и добавим его в параметр функции Configure

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
// Ожидаемый результат: ArgumentsIsMissingError: Arguments is missing in REPEAT option

replace("$[FILENAME:REPEAT(, |)]");
// Ожидаемый результат: TimesParameterIsMissingError: Times parameter is missing in REPEAT option
```
