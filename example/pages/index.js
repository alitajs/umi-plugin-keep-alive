import { useState } from 'react'
import { KeepAlive } from 'umi'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div>
      <p>count: {count}</p>
      <button onClick={() => setCount(count => count + 1)}>add</button>
    </div>
  )
}

export default function() {
  const [show, setShow] = useState(true)

  return (
    <div>
      <h1>Page index</h1>
      {show && (
        <KeepAlive>
          <Counter />
        </KeepAlive>
      )}
      <button onClick={() => setShow(show => !show)}>toggle</button>
    </div>
  )
}
