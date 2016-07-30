"use strict"

const string = value =>
{
    if (typeof value == "string")
        return value

    return value instanceof RegExp
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
