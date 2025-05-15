import { Alert } from 'react-bootstrap'

const Notification = ({ message }) => {
  if (!message) return null
  return (
    <Alert variant="info" className="mt-3" role="alert">
      {message}
    </Alert>
  )
}

export default Notification
