import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { YouMightAlsoLikeCarousel } from '../app/components/product/YouMightAlsoLikeCarousel'
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
  tag: 'Tag',
  price: '$10',
  image: '/img.jpg',
})

describe('YouMightAlsoLikeCarousel', () => {
  it('renders suggestions and navigation buttons', async () => {
    const meals = [makeMeal(1), makeMeal(2), makeMeal(3)]
    render(<YouMightAlsoLikeCarousel currentMealSlug={meals[0].slug} meals={meals} />)

    // suggestions should show other meals
    expect(screen.getByText('Meal 2')).toBeInTheDocument()
    expect(screen.getByText('Meal 3')).toBeInTheDocument()

    const prev = screen.getByText('Prev')
    const next = screen.getByText('Next')
    expect(prev).toBeDisabled()
    expect(next).toBeEnabled()

    await userEvent.click(next)
    // after clicking next, prev should become enabled
    expect(prev).toBeEnabled()
  })
})
