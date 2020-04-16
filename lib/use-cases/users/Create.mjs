import {
    Exception as X
} from '../../../packages.mjs';

import Base         from '../Base.mjs';
import { dumpUser } from '../utils/dumps.mjs';
import User         from '../../domain-model/User.mjs';
import DMX          from '../../domain-model/X.mjs';
import StoredTriggerableAction, { TYPES as ActionTypes } from '../../domain-model/StoredTriggerableAction.mjs';

export default class UsersCreate extends Base {
    static validationRules = {
        data : [ 'required', { 'nested_object' : {
            email           : [ 'required', 'email', 'to_lc' ],
            password        : [ 'required', 'string' ],
            confirmPassword : [ 'required', { 'equal_to_field': [ 'password' ] } ],
            lang            : [ 'string' ],
            agreeWithTerms  : [ 'required', { 'is': true } ]
        } } ]
    };

    async execute({ data }) {
        try {
            const user = await User.create(data);

            const action = await StoredTriggerableAction.create({
                type    : ActionTypes.ACTIVATE_USER,
                payload : { userId: user.id }
            });

            await this.notificator.notify('ACTIVATE_USER', data.email, {
                ...user,
                actionId : action.id
            });

            return { data: dumpUser(user) };
        } catch (x) {
            if (x instanceof DMX.NotUnique) {
                throw new X({
                    code   : 'NOT_UNIQUE',
                    fields : { [x.field]: 'NOT_UNIQUE' }
                });
            }
            throw x;
        }
    }
}
