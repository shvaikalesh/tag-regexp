import makeTag from "./make-tag"
import { diff, powerSet } from "./utils"

let allFlags = "gimsuxy"
let chainFlags = flags =>
{
    let tag = makeTag(flags)
    let props = diff(allFlags, flags)

    powerSet(props).forEach(prop =>
    {
        if (!prop) return

        Object.defineProperty(tag, prop,
        {
            get()
            {
                let value = chainFlags(flags + prop)
                Object.defineProperty(tag, prop, { value })

                return value
            },
            configurable: true,
        })
    })

    return tag
}

export default chainFlags("")
