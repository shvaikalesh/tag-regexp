import mem from "mem"

let keepEscaped = str => str.startsWith("\\") ? str.slice(1) : ""
let dropComments = str => str.replace(/\\?#.*$|\s+/gm, keepEscaped)
let processExt = mem(raw => raw.map(dropComments))

let escapeMeta = str => str.replace(/[|{}[\]()?+*.\\$^]/g, "\\$&")
let toString = val =>
{
    if (val == null) return ""
    if (val[Symbol.match]) return val.source

    return typeof val != "string"
        && typeof val[Symbol.iterator] == "function"
        ? Array.from(val, toString).join("|")
        : escapeMeta(`${val}`)
}

export default mem(flags =>
{
    let ext = flags.includes("x")
    if (ext) flags = flags.replace("x", "")

    return ({ raw }, ...vals) =>
    {
        if (ext) raw = processExt(raw)

        let pattern = String.raw({ raw }, ...vals.map(toString))

        return new RegExp(pattern, flags)
    }
})
