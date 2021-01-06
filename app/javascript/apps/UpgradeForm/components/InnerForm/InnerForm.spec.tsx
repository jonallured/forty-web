import React from "react"
import { mount } from "enzyme"
import { InnerForm } from "./"

describe("InnerForm", () => {
  it("renders or whatever", () => {
    const props = {}
    const wrapper = mount(<InnerForm {...props} />)
    expect(wrapper.find("form")).toHaveLength(1)
  })
})
