const clone = require("fast-copy")

export type OptionsValue = {
  writable?: boolean
} & OptionsGeneral


export type OptionsGeneral = {
  configurable?: boolean,
  enumerable?: boolean
}

export type OptionsGetterSetter = OptionsGeneral

export type Options = OptionsValue | OptionsGeneral


export interface ObGetter extends OptionsGetterSetter {
  get(): any
}

export interface ObSetter extends OptionsGetterSetter {
  set(...a: any[]): void
}

export type ObGetterSetterMust = ObGetter & ObSetter

export type ObGetterSetter = ObGetterSetterMust & ObGetter & ObSetter

export interface ObValue extends OptionsValue {
  value: any
}

export type Ob = ObValue | ObGetterSetter

const constAttachToPrototypes = (prototypes: any[]) => (name: string, ob: any) => {
  prototypes.forEach((prototype) => {
    Object.defineProperty(prototype, name, ob)
  })
}

const constAttachToPrototype = (prototype: any) => (name: string, ob: any) => {
  Object.defineProperty(prototype, name, ob)
}

const getAttach = (prototype: any | any[]) => prototype instanceof Array ? constAttachToPrototypes(prototype) : constAttachToPrototype(prototype)

function constructConstructToPrototype(callWhenGetterSetter?: (func, options) => void) {
  const hasCallWhenGetterSetter = callWhenGetterSetter !== undefined
  return function(prototype: any | any[], defaultOptions: Options = {enumerable: false, configurable: true}) {
    const getSetOptions = clone(defaultOptions) as ObGetterSetter
    delete (getSetOptions as OptionsValue).writable
    const valueOptions = clone(defaultOptions) as any as OptionsValue
    if (valueOptions.writable === undefined) valueOptions.writable = true

    const attach = getAttach(prototype)
    

    return function(name: string | string[], func: Function | Ob): typeof func {
      let ob: any
      if (typeof func === "function") {
        ob = clone(valueOptions)
        ob.value = func
      }
      else {
        ob = clone(getSetOptions)
        if (hasCallWhenGetterSetter && (func as any).value === undefined) {
          callWhenGetterSetter(func, ob)
        }
        else {
          for (const k in func) {
            ob[k] = func[k]
          }
        }
        
      }


      if (name instanceof Array) {
        for (let i = 0; i < name.length; i++) {
          attach(name[i], ob)
        }
      }
      else attach(name, ob)

      return func
    }
  }
}

export const constructAttachToPrototype = constructConstructToPrototype()
export const constructAttatchToPrototype = constructAttachToPrototype // legacy spelling error
export default constructAttachToPrototype


export const constructApplyToPrototype = constructConstructToPrototype((func, ob) => {
  ob.value = function(...values: any[]) {
    if (values.length !== 0 && !values.every(q => q === undefined)) {
      const r = (func as any).set.apply(this, values)
      return r === undefined ? this : r
    }
    else return (func as any).get.call(this)
  }
})
