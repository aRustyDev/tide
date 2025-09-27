import type { ValidationAcceptor, ValidationChecks } from 'langium';
import type { TideAstType, Model } from './generated/ast.js';
import type { TideServices } from './tide-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: TideServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.TideValidator;
    const checks: ValidationChecks<TideAstType> = {
        Model: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

// /**
//  * Implementation of custom validations.
//  */
// export class TideValidator {

//     checkPersonStartsWithCapital(model: Model, accept: ValidationAcceptor): void {
//         if (model.tide) {
//             const firstChar = model.var.substring(0, 1);
//             if (firstChar.toUpperCase() !== firstChar) {
//                 accept('warning', 'Person name should start with a capital.', { node: model, property: 'diagrams' });
//             }
//         }
//     }

// }
