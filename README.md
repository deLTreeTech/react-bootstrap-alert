# react-bootstrap-alert

A simple React component that handles display of bootstrap alert.

## How to use

To install, run:

- `npm install @deltreetech/react-bootstrap-alert`

You can now import from `@deltreetech/react-bootstrap-alert`:

```
import {Alert, AlertService} from '@deltreetech/react-bootstrap-alert'
...
```

## Available props

```
<Alert id="alert-container" />
```

## Usage

```
AlertService.success(message, option)
```

Example:

```
AlertService.success(message, {
id: "alert-container",
})
```

Below is the default option:

```
const options = {
id: 'default-alert',
fade: true,
showClose: true,
}
```
