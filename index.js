/**
 * 设备指纹相关方法公开
 */

import { aesEncrypt, SHA256, md5Hash, getRandomString } from './utils/aescrypt.js';
import { getObjectValueByJWTkey } from './utils/JWT.js';
// 获取用户代理字符串
const userAgent = navigator.userAgent;

// 获取屏幕分辨率
const screenResolution = `${window.screen.width}x${window.screen.height}`;

// 获取浏览器语言
const language = navigator.language;

// 获取时区
const timezone = new Date().getTimezoneOffset();

// 获取浏览器插件列表
const plugins = Array.from(navigator.plugins)
    .map((plugin) => plugin.name)
    .join(',');

// 获取字体列表
const getFonts = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const fonts = [];
    const testString = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const baseFonts = ['monospace', 'sans-serif', 'serif'];
    const testSize = 72;

    baseFonts.forEach((font) => {
        ctx.font = `${testSize}px ${font}`;
        const metrics = ctx.measureText(testString);
        fonts.push(metrics.width);
    });

    return fonts.join(',');
};

const fonts = getFonts();

// 获取Canvas指纹
const getCanvasFingerprint = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.textBaseline = 'top';
    ctx.font = '18px';
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.fillText('Cwm fjordbank glyphs vext quiz xxl, 😃', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.3)';
    ctx.fillText('Cwm fjordbank glyphs vext quiz xxl, 😃', 4, 17);

    return md5Hash(canvas.toDataURL());
};

let canvasFingerprint = getCanvasFingerprint();
// 收集所有特征
// userAgent, //获取用户代理字符串
// screenResolution, //获取屏幕分辨率
// language, //获取浏览器语言
// timezone, //获取时区
// plugins, //plugins
// fonts, //获取字体列表
// canvasFingerprint, //Canvas指纹

/*
 请求头传入参数描述：
// 登录时用户设备信息
User-Agent-Enc-Header
// 下单时设备指纹
X-DF-Header
// 请求头随机值
X-RA-Header
// 请求头时间戳
X-TS-Header
// 下单认证字段凭证
Access-Certificate-Headers
*/

//设备信息
let userAgentInfo =
    userAgent + screenResolution + language + timezone + plugins + fonts + canvasFingerprint;

//用户id
let userId = getObjectValueByJWTkey('id');

function getDeviceInfo() {
    //设备信息
    let deviceHeaders = {};
    //请求头添加

    deviceHeaders['X-TS-Header'] = new Date().getTime();
    deviceHeaders['X-RA-Header'] = getRandomString(15);

    deviceHeaders['User-Agent-Enc-Header'] = aesEncrypt(
        userAgentInfo + 'xxlis' + deviceHeaders['X-TS-Header']
    );
    deviceHeaders['Access-Certificate-Headers'] = userId
        ? md5Hash(
            userId +
            deviceHeaders['X-TS-Header'] +
            deviceHeaders['X-RA-Header'] +
            'nstop@s2fMt4Go'
        )
        : '';
    deviceHeaders['X-DF-Header'] = SHA256(userAgentInfo);
    deviceHeaders['IS-OPEN-CHECK'] = getMobileTypeConfigList().isDeviceCheck;
    return deviceHeaders;
}
export { getDeviceInfo };
