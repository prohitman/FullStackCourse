import { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Button, Card } from 'react-bootstrap'

const Togglable = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div className="mb-3">
      {!visible && (
        <Button onClick={toggleVisibility} variant="primary">
          {props.buttonLabel}
        </Button>
      )}
      {visible && (
        <Card className="p-3">
          {props.children}
          <div className="mt-3">
            <Button variant="secondary" onClick={toggleVisibility}>
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  )
})

Togglable.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
}

Togglable.displayName = 'Togglable'

export default Togglable
