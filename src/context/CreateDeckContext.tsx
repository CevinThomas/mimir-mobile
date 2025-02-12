import React, { createContext, useContext, useReducer } from 'react'

const CreateDeckContext = createContext()

const initialState = {
  currentCard: {
    title: '',
    description: '',
    explanation: '',
    choices: []
  },
  deckName: '',
  deckDescription: '',
  deckId: '',
  active: false,
  deckCards: []
}

const createDeckReducer = (state, action) => {
  switch (action.type) {
    case 'SET_DECK':
      return {
        ...state,
        deckName: action.response.name,
        deckDescription: action.response.description,
        deckId: action.response.id,
        deckCards: action.response.cards || [],
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
        deckCards: [...state.deckCards, action.card],
        currentCard: initialState.currentCard
      }

    case 'UPDATE_CARD':
      return {
        ...state,
        deckCards: state.deckCards.map((card) => (card.id === action.card.id ? action.card : card)),
        currentCard: initialState.currentCard
      }

    case 'DELETE_CARD':
      return {
        ...state,
        deckCards: state.deckCards.filter((card) => card.id !== state.currentCard.id)
      }

    case 'DELETE_CHOICE':
      return {
        ...state,
        currentCard: {
          ...state.currentCard,
          choices: state.currentCard.choices.filter((choice) => choice.id !== action.choice.id)
        }
      }

    case 'RESET':
      return initialState

    case 'ADD_CHOICE':
      return {
        ...state,
        currentCard: {
          ...state.currentCard,
          choices: [...state.currentCard.choices, action.choice]
        }
      }

    case 'UPDATE_CHOICE':
      return {
        ...state,
        currentCard: {
          ...state.currentCard,
          choices: state.currentCard.choices.map((choice) =>
            choice.id === action.choice.id ? action.choice : choice
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
