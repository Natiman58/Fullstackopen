import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog"
import userEvent from '@testing-library/user-event'

test('renders content', () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'test author',
        url: 'test url',
        likes: 0,
        //user: "6592a629f2516a06c533083b"
    }

    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blog')

    // Test that the component renders title and author
    expect(div).toHaveTextContent('Component testing is done with react-testing-library')
    expect(div).toHaveTextContent('test author')

    // Test that the component doesnt render URL or likes by default
    expect(div).not.toHaveTextContent('test url')
    expect(div).not.toHaveTextContent('0')

})

test('clicking the show detail button displays the URL and likes', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'test author',
        url: 'test url',
        likes: 0
    }

    const mockHandler = jest.fn()

    render (<Blog blog={blog} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    console.log("clicked")

    // Test that the component renders URL and likes after clicking the button
    const div = screen.getByText('test url')
    expect(div).toBeDefined()

    const div2 = screen.getByText('0')
    expect(div2).toBeDefined()
})

test('clicking the like button twice calls event handler twice', async () => {
    const blog = {
        title: 'Component testing is done with react-testing-library',
        author: 'test author',
        url: 'test url',
        likes: 0
    }

    const mockHandler = jest.fn()

    render (<Blog blog={blog} updateBlog={mockHandler} />)

    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const button2 = screen.getByText('like')
    await user.click(button2)
    await user.click(button2)

    expect(mockHandler.mock.calls).toHaveLength(2)


})