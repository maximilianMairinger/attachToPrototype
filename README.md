# Attatch to prototype

Attatch functions as non enumerable properties to the prototype of any object.

> Please not that Attatch to prototype is currently under development and not yet suited for production

## Example

### Generic

```ts
import { constructAttatchToPrototype } from "attatch-to-prototype"

const attachToArray = constructAttatchToPrototype(Array.prototype/*, options*/)
attachToArray("removeByValue", function(value) {
  const index = this.indexOf(value)
  if (index === -1) return
  this.splice(index, 1)
})

const ar = ["a", "b", "c"]

ar.removeByValue("b")

console.log(ar) // ["a", "c"]

```
### Getter / Setter

#### Attach

```ts
attachToArray("last", {
  get() {
    return this[this.length-1]
  }
  set(to) {
    return this[this.length-1] = to
  }
})


let ar = [1, 2, 3]

ar.last      // return 3
ar.last = 0  // return 0

console.log(ar) // [1, 2, 0]
```


#### Apply

Just a different syntax to access getter / setter. Use Attach / apply depending on your coding conventions.

```ts
import { constructApplyToPrototype } from "attatch-to-prototype"

const attachToArray = constructApplyToPrototype(Array.prototype/*, options*/)
attachToArray("last", {
  get() {
    return this[this.length-1]
  }
  set(to) {
    return this[this.length-1] = to
  }
})


let ar = [1, 2, 3]

ar.last()   // return 3
ar.last(0)  // return 0

console.log(ar) // [1, 2, 0]
```

The [generic](#Generic) functionality is also available on apply

## Contribute

All feedback is appreciated. Create a pull request or write an issue.
