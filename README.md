# react-immer-hook

Provides a hook for immerjs that supports patches

## Getting started

### Installation

`npm i immer react-immer-hook`

## Usage

```jsx
import useImmer from 'react-immer-hook'

function App() {
  const [value, produceValue, { undo, redo }] = useImmer('')
  return <>
    <input value={value} onChange={(e) => produceValue(() => e.target.value)} />
    <Button onClick={() => undo()}>Undo</Button>
    <Button onClick={() => redo()}>Redo</Button>
  </>
}

export default App
```
