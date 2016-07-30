"use strict"

const escape = string =>
    string.replace(/[|{}[\]()?+*.\\$^]/g, "\\$&")

const isRegExp = value =>
    toString.call(value) == "[object RegExp]"

const string = value =>
{
    if (typeof value == "string")
        return escape(value)

    return isRegExp(value)
        ? value.source
        : Array.from(value, string).join("|")
}

const tag = flags => (template, ...values) =>
{
    let pattern = String.raw(template,
        ...values.map(string)
    )

    return new RegExp(pattern, flags)
}

module.exports = new Proxy(tag(),
{
    get(r, key)
    {
        return typeof key == "symbol" || key in r
            ? Reflect.get(...arguments)
            : tag(key)
    },
})
