import { Model } from 'sequelize';

/**
 * @tsoaModel
 */
export interface User extends Model {
    id?: number,
    name: string,
    account: string,
    password: string,
    avatar?: string,
    role: string,
    type: string,
    reset_token?: string
}