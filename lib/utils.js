export let diff = (min, sub) =>
{
    return [ ...min ]
        .filter(char => !sub.includes(char))
        .join("")
}

export let powerSet = iter =>
{
    let res = [ "" ]

    for (let item of iter)
        res.push(...res.map(pre => pre + item))

    return res
}
