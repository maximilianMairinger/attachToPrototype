export function constructAttatchToPrototype(prototype: any) {
  return function(name: string | string[], func: Function | any) {
    const isFunc = typeof func === "function"
    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        appendToPrototype(name[i], func, isFunc)
      }
    }
    else appendToPrototype(name, func, isFunc)
  }

  function appendToPrototype(name: string, func: Function | any, isFunc: boolean) {
    let ob: any
    if (isFunc) {
      ob = {
        value: func,
        enumerable: false
      }
    }
    else {
      ob = func
      ob.enumerable = false
    }

    Object.defineProperty(prototype, name, ob)
  }
}

export default constructAttatchToPrototype

export function constructApplyToPrototype(prototype: any) {
  return function(name: string | string[], func: Function | {get: () => any, set: (...to: any) => void}) {
    const isFunc = typeof func === "function"
    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        appendToPrototype(name[i], func, isFunc)
      }
    }
    else appendToPrototype(name, func, isFunc)
  }

  function appendToPrototype(name: string, func: Function | {get: () => any, set: (...to: any) => void}, isFunc: boolean) {
    let ob: any
    if (isFunc) {
      ob = {
        value: func,
        enumerable: false
      }
    }
    else {
      ob = {
        enumerable: false,
        value: function(...values: any[]) {
          if (values.length !== 0) (func as any).set.apply(this, values)
          else return (func as any).get.call(this)
          return this
        }
      }
    }

    Object.defineProperty(prototype, name, ob)
  }
}
