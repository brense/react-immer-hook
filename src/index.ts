import { produce, applyPatches, enablePatches, Patch, freeze } from 'immer'
import { Objectish } from 'immer/dist/internal'
import { useCallback, useRef, useState } from 'react'
enablePatches()

function useImmer<T = Objectish>(initialState: T) {
  const [state, setState] = useState(freeze(initialState, true))
  const changes = useRef<Array<{ patches: Patch[], inversePatches: Patch[] }>>([])
  const inverseChanges = useRef<Array<{ patches: Patch[], inversePatches: Patch[] }>>([])
  const produceWithPatches = useCallback((updater: (draft: T) => void) => {
    setState(produce(
      state,
      updater,
      (patches, inversePatches) => {
        changes.current.push({ patches, inversePatches })
        inverseChanges.current = []
      }
    ))
  }, [state])
  const undo = useCallback(() => {
    const change = changes.current.pop()
    if (change) {
      inverseChanges.current.push(change)
      setState(applyPatches(state, change.inversePatches))
    }
  }, [state])
  const redo = useCallback(() => {
    const change = inverseChanges.current.pop()
    if (change) {
      changes.current.push(change)
      setState(applyPatches(state, change.patches))
    }
  }, [state])
  return [state, produceWithPatches, { undo, redo }] as [T, typeof produceWithPatches, { undo: typeof undo, redo: typeof redo }]
}

export default useImmer
