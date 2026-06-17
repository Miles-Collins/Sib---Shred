import React from 'react'
import { render, screen } from '@testing-library/react'

import { FeaturedMealsCarousel } from '../app/components/landing/FeaturedMealsCarousel'
import type { Meal } from '../app/components/landing/types'

const makeMeal = (i: number): Meal => ({
  slug: `meal-${i}`,
  name: `Meal ${i}`,
  description: 'Delicious',
  allergens: '',
  facilityNote: '',
  dietaryTags: [],
  calories: 0,
  protein: '',
  carbs: '',
  fat: '',
  sodium: '',
  ingredients: [],
  isGlutenFree: false,
  tag: 'Featured',
  price: '$10',
  image: '/img.jpg',
})

describe('FeaturedMealsCarousel', () => {
  beforeEach(() => {
    // ensure requestAnimationFrame available
    if (!globalThis.requestAnimationFrame) {
      Object.defineProperty(globalThis, 'requestAnimationFrame', {
        configurable: true,
        value: (cb: FrameRequestCallback) => window.setTimeout(() => cb(performance.now()), 0),
      })
    }
    // mock scrollWidth/scrollLeft computations if needed
  })

  it('renders controls and meal items', () => {
    const meals = [makeMeal(1), makeMeal(2), makeMeal(3)]
    render(<FeaturedMealsCarousel meals={meals} />)

    expect(screen.getAllByLabelText(/scroll featured meals left/i).length).toBeGreaterThan(0)
    expect(screen.getAllByLabelText(/scroll featured meals right/i).length).toBeGreaterThan(0)

    // Meal titles should be present in the DOM (may appear multiple times due to looping tracks)
    expect(screen.getAllByText('Meal 1').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Meal 2').length).toBeGreaterThan(0)
  })
})
