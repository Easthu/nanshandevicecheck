import { jwtDecode } from 'jwt-decode';
import JSONbig from 'json-bigint';
import { aesEncrypt } from './utils/aescrypt.js';
/**
 *
 * @param {*} key 获取的key
 * @param {*} JWT JWT数据
 * @returns 根据传key获取到的value
 */
export function getObjectValueByJWTkey(
	key = 'account',
	JWT = localStorage.getItem('hqqMobileToken')
) {
	if (JWT) {
		try {
			const decoded = jwtDecode(JWT);
			let obj = JSONbig.parse(decoded.code, (keys, value) => {
				if (keys === 'id') {
					return value.toString(); // 将 BigInt 转换为字符串
				}
				return value;
			});
			console.log(obj[key]);
			return obj[key] || null;
		} catch (err) {
			console.log('err :>> ', err);
			return null;
		}
	}
	return null;
}


