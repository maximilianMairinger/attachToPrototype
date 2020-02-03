export function constructAttatchToPrototype(prototype: any) {
  return function(name: string | string[], func: Function) {
    const isFunc = typeof func === "function"
    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        appendToPrototype(name[i], func, isFunc)
      }
    }
    else appendToPrototype(name, func, isFunc)
  }

  function appendToPrototype(name: string, func: Function, isFunc: boolean) {
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
