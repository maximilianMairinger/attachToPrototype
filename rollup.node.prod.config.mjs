import { merge } from "webpack-merge"
import commonMod from "./rollup.node.common.config.mjs"


export default merge(commonMod, {
  input: 'app/src/attatchToPrototype.ts',
  output: {
    file: 'app/dist/cjs/attatchToPrototype.js',
    format: 'cjs'
  },
})