// is there a way to refactor this component to be unaware of stripe! like
// using children and passed in functions, could i separate the business logic
// here? that way i could stop struggling to test this codepath and rely on the
// contract between the parent and child. huge if true.
import React, { useState } from "react"
import { UpgradeFormFetcher } from "../../UpgradeFormFetcher"
import { Source, StripeError } from "@stripe/stripe-js"

export interface Something {
  stripeSourceId?: string
  errorType?: string
}

export const generalPaymentErrorMessage =
  "Processing payment information is currently not working, please try again later."

export interface InnerFormProps {
  createSource: () => Promise<{ source?: Source; error?: StripeError }>
  disabled: boolean
  fetcher: UpgradeFormFetcher
  honeybadger: { notify: (any) => void }
}

export const InnerForm: React.FC<InnerFormProps> = (props) => {
  const { createSource, disabled, honeybadger, fetcher } = props
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
