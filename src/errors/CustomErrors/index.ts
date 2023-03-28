import { ApplyOptionError } from "./ApplyOptionError";
import { BaseError } from "./BaseError";
import { BaseOptionError } from "./BaseOptionError";
import { BaseVariableError } from "./BaseVariableError";
import { GetValueError } from "./GetValueError";

import type { ApplyOptionErrorConstructor } from "./ApplyOptionError";
import type { BaseErrorConstructor } from "./BaseError";
import type { BaseOptionErrorConstructor, OptionErrorName } from "./BaseOptionError";
import type { BaseVariableErrorConstructor, VariableErrorName } from "./BaseVariableError";
import type { GetValueErrorConstructor } from "./GetValueError";

export { ApplyOptionError, BaseError, BaseOptionError, BaseVariableError, GetValueError };

export type {
	ApplyOptionErrorConstructor,
	BaseErrorConstructor,
	BaseOptionErrorConstructor,
	OptionErrorName,
	BaseVariableErrorConstructor,
	VariableErrorName,
	GetValueErrorConstructor,
};
