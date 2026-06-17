import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'

vi.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

import { Header } from '../app/components/landing/Header'

describe('Header', () => {
  beforeEach(() => {
    // Mock site-settings fetch
    globalThis.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ settings: { brandName: 'Test Brand', brandSubtitle: 'Meal Prep', primaryNavLinks: [{ href: '/', label: 'Home' }] } }) }),
    ) as unknown as typeof fetch

    localStorage.clear()
  })

  it('renders brand and menu button and cart', async () => {
    render(<Header />)

    expect(await screen.findByText('Test Brand')).toBeInTheDocument()
    expect(screen.getByLabelText(/toggle navigation menu/i)).toBeInTheDocument()
    expect(screen.getAllByLabelText(/open cart/i).length).toBeGreaterThan(0)
  })

  it('toggles menu button aria-expanded', async () => {
    render(<Header />)
    const btn = screen.getByLabelText(/toggle navigation menu/i)
    expect(btn).toHaveAttribute('aria-expanded', 'false')
    await userEvent.click(btn)
    expect(btn).toHaveAttribute('aria-expanded', 'true')
  })
})
