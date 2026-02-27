import util from "util"

export function depth(params) {
    console.info(util.inspect(params, { depth: 5 }))
}