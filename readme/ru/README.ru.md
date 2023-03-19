# text-replace

## Навигация

1. ["Что это?"](#what-is-it)
1. ["Начало работы"](#getting-started)
   1. ["Установка"](#installing)
   2. ["Первая переменная"](#first-variable)
   3. ["Опции"](#options)
      1. ["Глобальные опции"](#global-options)
      2. ["Локальные опции"](#local-options)
      3. ["Приоритет опций"](#options-priority)
   4. ["Настройки шаблона"](#template-options)

## Что это?

<a name="what-is-it"></a>

text-replace - npm-пакет, позволяющий вам находить и заменять переменные на какие-либо значения.
Последние можно также изменять с помощью ваших собственных опций.

К слову, это мой первый более-менее готовый проект, и, по совместительству, первая библиотека. Рассчитываю на вашу помощь и поддержку!

## Начало работы

<a name="getting-started"></a>

### Установка

<a name="installing"></a>

```
...
```

### Первая переменная

<a name="first-variable"></a>

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

```
const replace = Configure({
  globalOptions: [],
  variables: [VAR]
})
```

**Функция Configure возвращает нам другую функцию replace, которая находит и заменяет все переданные переменные.**

Осталось лишь передать в функцию replace текст.
_Стоит обратить внимание на то, что переменные в тексте находятся по заданному шаблону:
$[НАЗВАНИЕ_ПЕРЕМЕННОЙ:ОПЦИЯ_1:ОПЦИЯ_2:...:ОПЦИЯ_N]. Ниже будет рассказано, как мы можем изменить данный шаблон.(См. ["Настройки шаблона"](#template-options))_

```JavaScript
replace("$[VAR]")
// Ожидаемый результат: "$[VAR]" -> "vaaar"
```

### Опции

<a name="options"></a>

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

<a name="global-options"></a>
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

<a name="local-options"></a>
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

<a name="options-priority"></a>

Как было сказано выше, локальные опции приоритетнее, нежели глобальные. Что это значит для нас?
Это значит, что мы можем создать две одинаковых опции с одним и тем же именем, но они будут делать совершенно разное.

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

### Настройки шаблона

<a name="template-options"></a>

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
