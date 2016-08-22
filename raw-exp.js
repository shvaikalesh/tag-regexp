"use strict"

const escape = string =>
    string.replace(/[|{}[\]()?+*.\\$^]/g, "\\$&")

const type = value =>
    toString.call(value).slice(8, -1)

const isIterable = value =>
    typeof value[Symbol.iterator] == "function"

const supports = flags =>
{
    try
    {
        new RegExp("", flags)
    }
    catch (error)
    {
        return false
    }

    return true
}

const string = value =>
{
    if (value == null) return ""

    switch (type(value))
    {
        case "String": break
        case "RegExp": return value.source

        default: if (isIterable(value))
            return Array.from(value, string).join("|")
    }

    return escape(`${value}`)
}

const tag = flags =>
{
    let remove = ""

    if (flags.includes("x"))
    {
        if (!supports("x"))
            flags =
            flags.replace("x", "")

        remove = /\s+|#.*$/gm
    }

    return (template, ...values) =>
    {
        let pattern = String.raw(template,
            ...values.map(string)
        )
        .replace(remove, "")

        return new RegExp(pattern, flags)
    }
}

module.exports = new Proxy(tag(""),
{
    get(r, key)
    {
        return !r.hasOwnProperty(key) && supports(key)
            ? r[key] = tag(key)
            : Reflect.get(...arguments)
    },
})
