import React from "react"
import { loadStripe, Source, StripeError } from "@stripe/stripe-js"
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js"
import { InnerForm } from "./components/InnerForm"
import { UpgradeFormFetcher } from "./UpgradeFormFetcher"

export interface UpgradeFormProps {
  email: string
  fetcher: UpgradeFormFetcher
  honeybadger: { notify: (any) => void }
  stripePublicKey: string
}

export const UpgradeForm: React.FC<UpgradeFormProps> = (props) => {
  const { email, fetcher, honeybadger, stripePublicKey } = props

  const stripePromise = loadStripe(stripePublicKey)
  const stripe = useStripe()
  const elements = useElements()

  const createSource = (): Promise<{
    source?: Source
    error?: StripeError
  }> => {
    const element = elements.getElement(CardElement)
    const sourceData = { type: "card", owner: { email } }

    return stripe.createSource(element, sourceData)
  }

  const cardStyles = {
    fontSize: "20px",
  }

  const cardElementOptions = {
    style: {
      base: cardStyles,
    },
    hideIcon: true,
  }

  return (
    <Elements stripe={stripePromise}>
      <InnerForm
        createSource={createSource}
        disabled={!stripe}
        fetcher={fetcher}
        honeybadger={honeybadger}
      >
        <CardElement options={cardElementOptions} />
      </InnerForm>
    </Elements>
  )
}
