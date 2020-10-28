import clone from "tiny-clone"



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

export type ObGetterSetter = ObGetterSetterMust | ObGetter | ObSetter

export interface ObValue extends OptionsValue {
  value: any
}

export type Ob = ObValue | ObGetterSetter

const constructAttachToPrototypes = (prototypes: any[]) => (name: string, ob: any) => {
  prototypes.forEach((prototype) => {
    Object.defineProperty(prototype, name, ob)
  })
}

const constructAttachToPrototype = (prototype: any) => (name: string, ob: any) => {
  Object.defineProperty(prototype, name, ob)
}

const getAttatch = (prototype: any | any[]) => prototype instanceof Array ? constructAttachToPrototypes(prototype) : constructAttachToPrototype(prototype)

export function constructAttatchToPrototype(prototype: any | any[], defaultOptions: Options = {enumerable: false, configurable: true}) {
  const options = clone(defaultOptions)
  const attach = getAttatch(prototype)

  return function(name: string | string[], func: Function | Ob) {
    let ob: any
    if (typeof func === "function") {
      ob = clone(options)
      ob.value = func
    }
    else {
      ob = clone(options)
      for (const k in func) {
        ob[k] = func[k]
      }
    }


    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        attach(name[i], ob)
      }
    }
    else attach(name, ob)

    return ob.value
  }

}

export default constructAttatchToPrototype

export function constructApplyToPrototype(prototype: any, defaultOptions: Options = {enumerable: false, configurable: true}) {
  const options = clone(defaultOptions)
  const attach = getAttatch(prototype)

  return function(name: string | string[], func: Function | ObGetterSetter) {
    let ob: any
    if (typeof func === "function") {
      ob = clone(options)
      ob.value = func
    }
    else {
      ob = clone(options)
      ob.value = function(...values: any[]) {
        if (values.length !== 0 && !values.every(q => q === undefined)) (func as any).set.apply(this, values)
          else return (func as any).get.call(this)
          return this
      }
    }


    if (name instanceof Array) {
      for (let i = 0; i < name.length; i++) {
        attach(name[i], ob)
      }
    }
    else attach(name, ob)

    return ob.value
  }
}
