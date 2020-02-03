import {constructApplyToPrototype} from "./../../app/src/attatchToPrototype"

let me = constructApplyToPrototype(Array.prototype)


me("ok", {get: function() {
  return this.length
}})

let w = [2,3]
debugger
//@ts-ignore
console.log(w.ok())


