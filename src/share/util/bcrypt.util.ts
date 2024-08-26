import * as bcrypt from 'bcrypt';
import { commonConst } from '../common/app.const';

export const encryptPassword = (password: string) => {
	return bcrypt.hashSync(password, commonConst.BCRYPT_HASH_ROUND);
};

export const isPasswordMatch = (password: string, hash: string) => {
	return bcrypt.compareSync(password, hash);
};
