const fs = require("fs")
const qrcode = require("qrcode")

const code = fs.readFileSync("code.js", "utf8")
const data = "data:text/html,<!DOCTYPE html><body></body><script>" + code + "</script>"

qrcode.toFile("qrcode.png", data)