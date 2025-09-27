import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { TideAstType, Person } from './generated/ast.js';
import type { TideServices } from './tide-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: TideServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.TideValidator;
    const checks: ValidationChecks<TideAstType> = {
        Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class TideValidator {

    checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
        if (person.name) {
            const firstChar = person.name.substring(0, 1);
            if (firstChar.toUpperCase() !== firstChar) {
                accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
            }
        }
    }

}
