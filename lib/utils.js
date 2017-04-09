export let diff = (min, sub) =>
{
    return [ ...min ]
        .filter(char => !sub.includes(char))
        .join("")
}

export let combos = chars =>
{
    let combos = []
    let split = (left, right) =>
    {
        for (let at = 0; at < right.length; at++)
        {
            let combo = left + right[at]
            combos.push(combo)

            split(combo, right.slice(at + 1))
        }
    }

    split("", chars)

    return combos
}
