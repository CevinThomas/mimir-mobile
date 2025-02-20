import React, { createContext, useContext, useReducer } from 'react'

const CreateDeckContext = createContext()

type Choice = {
  id?: string
  title: string
  correct: boolean
}

type Card = {
  id?: string
  title: string
  explanation: string
  choices: Choice[]
}

type Deck = {
  name: string
  description: string
  active: boolean
  id?: string
  cards: Card[]
}

type InitialState = Deck & {
  currentCard: Card
  name: string
  description: string
  id: string
  active: boolean
  cards: Card[]
}

const initialState: InitialState = {
  currentCard: {
    title: '',
    explanation: '',
    choices: [
      { title: '', correct: true },
      { title: '', correct: false },
      { title: '', correct: false },
      { title: '', correct: false }
    ]
  },
  name: '',
  description: '',
  id: '',
  active: false,
  cards: []
}

const createDeckReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DECK':
      return {
        ...state,
        name: action.response.name,
        description: action.response.description,
        id: action.response.id,
        cards: action.response.cards || [],
        active: action.response.active || false
      }
    case 'UPDATE_DECK_KEY':
      return { ...state, [action.key]: action.value }

    case 'CLEAR_CURRENT_CARD':
      return { ...state, currentCard: initialState.currentCard }

    case 'SET_CURRENT_CARD':
      return { ...state, currentCard: action.card }

    case 'UPDATE_CURRENT_CARD':
      return { ...state, currentCard: { ...state.currentCard, [action.key]: action.value } }

    case 'ADD_CARD':
      return {
        ...state,
        cards: [...state.cards, action.card],
        currentCard: initialState.currentCard
      }

    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map((card) => (card.id === action.card.id ? action.card : card)),
        currentCard: initialState.currentCard
      }

    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter((card) => card.id !== state.currentCard.id)
      }

    case 'RESET':
      return initialState

    case 'UPDATE_CHOICE':
      const choiceToUpdate = state.currentCard.choices[action.index]
      const updatedChoice = { ...choiceToUpdate, title: action.text }

      return {
        ...state,
        currentCard: {
          ...state.currentCard,
          choices: state.currentCard.choices.map((choice, index) =>
            index === action.index ? updatedChoice : choice
          )
        }
      }

    default:
      return state
  }
}

export const CreateDeckProvider = ({ children }) => {
  const [state, dispatch] = useReducer(createDeckReducer, initialState)

  return (
    <CreateDeckContext.Provider value={{ state, dispatch }}>{children}</CreateDeckContext.Provider>
  )
}

export const useCreateDeckContext = () => useContext(CreateDeckContext)
