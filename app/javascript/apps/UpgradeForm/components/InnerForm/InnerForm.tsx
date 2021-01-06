import React, { useState } from "react"
import { UpgradeFormFetcher } from "../../UpgradeFormFetcher"
import { SourceResult } from "../../UpgradeForm"

const generalPaymentErrorMessage =
  "Processing payment information is currently not working, please try again later."

export interface InnerFormProps {
  createSource: () => SourceResult
  disabled: boolean
  fetcher: UpgradeFormFetcher
  honeybadger: { notify: (any) => void }
}

export const InnerForm: React.FC<InnerFormProps> = (props) => {
  const { createSource, disabled, fetcher, honeybadger } = props
  const [errorMessage, setErrorMessage] = useState("")

  const handleUpgradeResult = (result): void => {
    if (result.error) {
      setErrorMessage(result.error)
    } else {
      window.location.assign("/thanks")
    }
  }

  const handleUpgradeError = (error): void => {
    honeybadger.notify(error)
    setErrorMessage(generalPaymentErrorMessage)
  }

  const handleSourceResult = (result): void => {
    if (result.error) {
      honeybadger.notify(result)
      setErrorMessage(generalPaymentErrorMessage)
    } else {
      fetcher
        .createUpgrade(result.source.id)
        .then(handleUpgradeResult)
        .catch(handleUpgradeError)
    }
  }

  const handleSourceError = (error): void => {
    honeybadger.notify(error)
    setErrorMessage(generalPaymentErrorMessage)
  }

  const handleSubmit = (e): void => {
    e.preventDefault()
    setErrorMessage("")

    createSource().then(handleSourceResult).catch(handleSourceError)
  }

  const showError = errorMessage !== ""

  return (
    <form onSubmit={handleSubmit}>
      {showError && <p className="error">{errorMessage}</p>}
      {props.children}
      <input disabled={disabled} type="submit" value="Pay" />
    </form>
  )
}
