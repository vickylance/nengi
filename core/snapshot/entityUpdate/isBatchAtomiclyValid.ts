import calculateValue from './calculateValue';
import Binary from '../../binary/Binary';

function isBatchAtomiclyValid(diffs, schema) {

    if (!schema.hasOptimizations) {
        return false
    }

    let valid = true
    let batchContainsChanges = false

    diffs.forEach(diff => {
        const prop = schema.keys[diff.key]
        const opt = schema.batch.properties[prop]
        if (opt) {
            const binaryType = Binary[opt.type]
            const value = calculateValue(diff.was, diff.is, opt.delta)
            if (opt.delta) {
                if (value !== 0) {
                    batchContainsChanges = true
                }
            } else {
                if (diff.was !== diff.is) {
                    batchContainsChanges = true
                }
            }
            if (!binaryType.boundsCheck(value)) {
                valid = false
            }
        }
    })

    return valid && batchContainsChanges
}

export default isBatchAtomiclyValid;