export function constructAttatchToPrototype(prototype: any) {
  let isFunc
  let f
  let n
  return function(name: string | string[], func: Function | any) {
    isFunc = typeof func === "function"
    f = func
    n = name
    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        appendToPrototype()
      }
    }
    else appendToPrototype()
  }

  function appendToPrototype() {
    let ob: any
    if (isFunc) {
      ob = {
        value: f,
        enumerable: false
      }
    }
    else {
      ob = f
      ob.enumerable = false
    }

    Object.defineProperty(prototype, n, ob)
  }
}

export default constructAttatchToPrototype

export function constructApplyToPrototype(prototype: any) {
  let isFunc
  let f
  let n
  return function(name: string | string[], func: Function | {get?: () => any, set?: (...to: any) => void}) {
    isFunc = typeof func === "function"
    f = func
    n = name
    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        appendToPrototype()
      }
    }
    else appendToPrototype()
  }

  function appendToPrototype() {
    let ob: any
    if (isFunc) {
      ob = {
        value: f,
        enumerable: false
      }
    }
    else {
      ob = {
        enumerable: false,
        value: function(...values: any[]) {
          if (values.length !== 0) f.set.apply(this, values)
          else return f.get.call(this)
        }
      }
    }

    Object.defineProperty(prototype, n, ob)
  }
}


