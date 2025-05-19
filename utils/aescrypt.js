// 前端对密码进行AES加密（AES/ECB/PKCS5Padding）
import CryptoJS from 'crypto-js';

const SECRET_KEY = CryptoJS.enc.Utf8.parse('4h7j2k5d1g3f4l6q');
const SECRET_IV = CryptoJS.enc.Utf8.parse('9e8r4j7k9l0i3h5w');
// 加密
export function aesEncrypt(word) {
	let stringify = word;
	if (typeof word === 'object') {
		stringify = JSON.stringify(word);
	}
	const srcs = CryptoJS.enc.Utf8.parse(stringify);
	// 加密模式设置为 ECB，补码方式设置为 Pkcs7（即 PKCS5Padding）
	const encrypted = CryptoJS.AES.encrypt(srcs, SECRET_KEY, {
		iv: SECRET_IV,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	});
	return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
}
// 解密
export function aesDecrypt(word) {
	try {
		let decrypt = CryptoJS.AES.decrypt(word.replace(/\s/g, ''), SECRET_KEY, {
			iv: SECRET_IV,
			mode: CryptoJS.mode.CBC,
			padding: CryptoJS.pad.Pkcs7,
		});
		return CryptoJS.enc.Utf8.stringify(decrypt);
	} catch (error) {
		console.log('error :>> ', error);
		return JSON.stringify(word);
	}
}

// sha256
export function SHA256(word) {
	return CryptoJS.SHA256(word).toString(CryptoJS.enc.Hex);
}

export function md5Hash(data) {
	return CryptoJS.MD5(data).toString();
}

export function getRandomString(length) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}