"use strict"

let mem = require("mem")

let escapeMeta = val => `${val}`.replace(/[|{}[\]()?+*.\\$^]/g, "\\$&")
let toStr = val =>
{
    if (val == null) return ""
    if (val[Symbol.match]) return val.source

    return typeof val != "string"
        && typeof val[Symbol.iterator] == "function"
        ? Array.from(val, toStr).join("|")
        : escapeMeta(val)
}

let dropNotEscaped = str => str[0] == "\\" ? str.slice(1) : ""
let dropComments = str => str.replace(/\\?#.*\r?\n|\s+/g, dropNotEscaped)
let extRaw = mem.call(raw => raw.map(dropComments))

let makeTag = flags =>
{
    let ext = flags.includes("x")
    if (ext) flags = flags.replace("x", "")

    return ({ raw }, ...vals) =>
    {
        if (ext) raw = extRaw(raw)

        let pattern = String.raw({ raw }, ...vals.map(toStr))

        return new RegExp(pattern, flags)
    }
}

let chainFlags = flags =>
{
    return mem.get(makeTag(flags), (fn, key, tag) =>
    {
        return typeof key == "symbol" || key in fn
            ? Reflect.get(fn, key, tag)
            : chainFlags(flags + key)
    })
}

module.exports = chainFlags("")
