const HEX_REG = /^#?([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/ //匹配#000-#fff表示法的颜色
const RGBA_REG = /^[rR][gG][Bb][Aa]?[(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[)]{1}$/ //匹配rgba()表示法的颜色

const isHEX = val => HEX_REG.test(val)

const isRGBA = val => RGBA_REG.test(val)

export { isHEX, isRGBA }
