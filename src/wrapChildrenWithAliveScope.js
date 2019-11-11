import { AliveScope } from 'react-activation'

export default Component => ({ children, ...props }) => (
  <Component {...props}>
    <AliveScope>{children}</AliveScope>
  </Component>
)
