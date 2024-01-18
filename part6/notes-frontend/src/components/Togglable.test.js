import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Togglable from "./Togglable";
import userEvent from "@testing-library/user-event";


describe("<Togglable />", () => {
    let container

    beforeEach(() => {
        container = render(
            <Togglable buttonLabel="show...">
                <div className="testDiv">
                    togglable content
                </div>
            </Togglable>
        ).container
    })

    test('renders its children', async() => {
        await screen.findAllByText('togglable content')
    })

    test('at start the children are not displayed', async() => {
        const div = container.querySelector('.togglableContnet')
        expect(div).toHaveStyle('display: none')
    })

    test('after clicking the button, children are displayed', async() => {
        const user = userEvent.setup()
        const button = screen.getByText('show...')
        await user.click(button)

        const div = container.querySelector('.togglableContnet')
        expect(div).not.toHaveStyle('display: none')
    })
})
