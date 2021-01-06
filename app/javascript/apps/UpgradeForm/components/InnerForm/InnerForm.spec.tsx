import React from "react"
import { act } from "react-dom/test-utils"
import { mount } from "enzyme"
import { InnerForm } from "./"

const defaultProps = {
  createSource: jest.fn(),
  disabled: false,
  fetcher: { createUpgrade: jest.fn() },
  honeybadger: { notify: jest.fn() },
}

describe("InnerForm", () => {
  describe("when stripe cannot be loaded", () => {
    it("renders with disabled submit", () => {
      const props = {
        ...defaultProps,
        disabled: true,
      }
      const wrapper = mount(<InnerForm {...props} />)
      expect(wrapper.find("input[disabled=true]")).toHaveLength(1)
    })
  })

  describe("when creating the source throws", () => {
    it("renders the generic error", () => {})
  })

  describe("when creating the source returns an error", () => {
    it("renders the generic error", () => {})
  })

  describe("when creating the source succeeds", () => {
    it("attemps to create the upgrade", async () => {
      const mockSourceSuccess = jest.fn().mockResolvedValue({})

      const props = {
        ...defaultProps,
        createSource: mockSourceSuccess,
      }
      const wrapper = mount(<InnerForm {...props} />)
      await act(async () => {
        wrapper.find("form").prop("onSubmit")({ preventDefault: jest.fn() })
      })

      expect(props.fetcher.createUpgrade).toHaveBeenCalled()
    })
  })

  describe("when creating the upgrade throws", () => {
    it("renders the generic error", () => {})
  })

  describe("when creating the upgrade returns a card error", () => {
    it("renders that card error", () => {})
  })

  describe("when creating the upgrade succeeds", () => {
    it("redirects to the thanks page", () => {})
  })
})
