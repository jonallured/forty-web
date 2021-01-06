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

export type SourceResult = Promise<{ source?: Source; error?: StripeError }>

export interface UpgradeFormProps {
  email: string
  fetcher: UpgradeFormFetcher
  honeybadger: { notify: (any) => void }
  stripePublicKey: string
}

export const UpgradeForm: React.FC<UpgradeFormProps> = (props) => {
  const { email } = props
  const stripePromise = loadStripe(props.stripePublicKey)
  const stripe = useStripe()
  const elements = useElements()

  const createSource = (): SourceResult => {
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
      <InnerForm {...props} createSource={createSource} disabled={!stripe}>
        <CardElement options={cardElementOptions} />
      </InnerForm>
    </Elements>
  )
}
