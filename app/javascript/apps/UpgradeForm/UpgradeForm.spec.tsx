import React from "react"
import { act } from "react-dom/test-utils"
import { mount } from "enzyme"
// i'm not super clear about why this doesn't work...
// import { mockElement, mockElements, mockStripe } from "@stripe/react-stripe-js"

const defaultProps = {
  email: "user@example.com",
  fetcher: {},
  honeybadger: { notify: jest.fn() },
  stripePublicKey: "shhh",
}

export const mockElement = (): any => ({
  mount: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
  update: jest.fn(),
})

export const mockElements = (): any => {
  const elements = {}

  const create = jest.fn((type) => {
    elements[type] = mockElement()
    return elements[type]
  })

  const getElement = jest.fn((type) => {
    return elements[type] || null
  })

  return { create, getElement }
}

export const mockStripe = (): any => ({
  elements: jest.fn(() => mockElements()),
  createToken: jest.fn(),
  // createSource: jest.fn().mockResolvedValue({}),
  createSource: jest.fn().mockRejectedValue({}),
  createPaymentMethod: jest.fn(),
  confirmCardPayment: jest.fn(),
  confirmCardSetup: jest.fn(),
  paymentRequest: jest.fn(),
  _registerWrapper: jest.fn(),
})

jest.mock("@stripe/react-stripe-js", () => {
  const stripe = jest.requireActual("@stripe/react-stripe-js")

  return {
    ...stripe,
    Element: () => {
      return mockElement
    },
    useStripe: () => {
      return mockStripe()
    },
    useElements: () => {
      return mockElements()
    },
  }
})

import { UpgradeForm } from "./"
import { generalPaymentErrorMessage } from "./components/InnerForm"

describe("UpgradeForm", () => {
  it("renders or something", async () => {
    const props = {
      ...defaultProps,
    }
    const wrapper = mount(<UpgradeForm {...props} />)
    expect(wrapper.find("InnerForm")).toHaveLength(1)

    await act(async () => {
      const form = wrapper.find("form")
      const handleSubmit = form.prop("onSubmit")
      const event = { preventDefault: jest.fn() }

      handleSubmit(event)
    })

    wrapper.update()

    expect(wrapper.find("p.error")).toHaveLength(1)
    expect(wrapper.text()).toEqual(generalPaymentErrorMessage)
  })
})
