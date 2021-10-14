import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Subject } from 'rxjs'
import { filter } from 'rxjs/operators'

const alertSubject = new Subject()
const defaultId = 'default-alert'

const propTypes = {
  id: PropTypes.string,
  fade: PropTypes.bool,
}

const defaultProps = {
  id: 'default-alert',
  fade: true,
}

function Alert({ id, fade }) {
  const history = useHistory()
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    // subscribe to new alert notifications
    const subscription = AlertService.onAlert(id).subscribe((alert) => {
      // clear alerts when an empty alert is received
      if (!alert.message) {
        setAlerts((alerts) => {
          // filter out alerts without 'keepAfterRouteChange' flag
          const filteredAlerts = alerts.filter((x) => x.keepAfterRouteChange)

          // remove 'keepAfterRouteChange' flag on the rest
          filteredAlerts.forEach((x) => delete x.keepAfterRouteChange)
          return filteredAlerts
        })
      } else {
        // add alert to array
        setAlerts((alerts) => [...alerts, alert])

        // auto close alert if required
        if (alert.autoClose) {
          setTimeout(() => removeAlert(alert), 3000)
        }
      }
    })

    // clear alerts on location change
    const historyUnlisten = history?.listen(() => {
      AlertService.clear(id)
    })

    // clean up function that runs when the component unmounts
    return () => {
      // unsubscribe & unlisten to avoid memory leaks
      subscription.unsubscribe()
      historyUnlisten
    }
  })

  function removeAlert(alert) {
    if (fade) {
      // fade out alert
      const alertWithFade = { ...alert, fade: true }
      setAlerts((alerts) =>
        alerts.map((x) => (x === alert ? alertWithFade : x))
      )

      // remove alert after faded out
      setTimeout(() => {
        setAlerts((alerts) => alerts.filter((x) => x !== alertWithFade))
      }, 250)
    } else {
      // remove alert
      setAlerts((alerts) => alerts.filter((x) => x !== alert))
    }
  }

  function cssClasses(alert) {
    if (!alert) return

    const classes = ['alert', 'alert-dismissible']

    const alertTypeClass = {
      [AlertType.Success]: 'alert-success',
      [AlertType.Error]: 'alert-danger',
      [AlertType.Info]: 'alert-info',
      [AlertType.Warning]: 'alert-warning',
    }

    classes.push(alertTypeClass[alert.type])

    if (alert.fade) {
      classes.push('fade')
    }

    return classes.join(' ')
  }

  if (!alerts.length) return null

  return (
    <div className="container">
      <div className="m-3">
        {alerts.map((alert, index) => (
          <div key={index} className={cssClasses(alert)} role="alert">
            <span dangerouslySetInnerHTML={{ __html: alert.message }}></span>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => removeAlert(alert)}
            ></button>
          </div>
        ))}
      </div>
    </div>
  )
}

const AlertService = {
  onAlert,
  success,
  error,
  info,
  warn,
  alert,
  clear,
}

const AlertType = {
  Success: 'Success',
  Error: 'Error',
  Info: 'Info',
  Warning: 'Warning',
}

// enable subscribing to alerts observable
function onAlert(id = defaultId) {
  return alertSubject.asObservable().pipe(filter((x) => x && x.id === id))
}

// convenience methods
function success(message, options) {
  showAlert({ ...options, type: AlertType.Success, message })
}

function error(message, options) {
  showAlert({ ...options, type: AlertType.Error, message })
}

function info(message, options) {
  showAlert({ ...options, type: AlertType.Info, message })
}

function warn(message, options) {
  showAlert({ ...options, type: AlertType.Warning, message })
}

// core alert method
function showAlert(alert) {
  alert.id = alert.id || defaultId
  alertSubject.next(alert)
}

// clear alerts
function clear(id = defaultId) {
  alertSubject.next({ id })
}

Alert.propTypes = propTypes
Alert.defaultProps = defaultProps

export { Alert, AlertService, AlertType }
