import { useState } from 'react'
import { predictInactivity } from '../../../services/api/inactivityApi'

const initialCustomer = {
  frequency: '2', purchase_lines: '10', monetary: '500', average_line_value: '50',
  unique_products: '8', average_quantity: '2', recency_days: '45', average_order_value: '250',
}

export function useInactivityPrediction() {
  const [customer, setCustomer] = useState(initialCustomer)
  const [prediction, setPrediction] = useState(null)
  const [predictionError, setPredictionError] = useState('')
  const [predicting, setPredicting] = useState(false)

  async function handlePrediction(event) {
    event.preventDefault()
    setPredicting(true)
    setPrediction(null)
    setPredictionError('')
    try {
      const numericCustomer = Object.fromEntries(Object.entries(customer).map(([key, value]) => [key, Number(value)]))
      setPrediction(await predictInactivity(numericCustomer))
    } catch (err) {
      setPredictionError(err instanceof Error ? err.message : 'Prediction failed.')
    } finally {
      setPredicting(false)
    }
  }

  function resetForm() {
    setCustomer({ ...initialCustomer })
    setPrediction(null)
    setPredictionError('')
  }

  function updateCustomerField(key, value) {
    setCustomer((previous) => ({ ...previous, [key]: value }))
  }

  return { customer, updateCustomerField, prediction, predictionError, predicting, handlePrediction, resetForm }
}
