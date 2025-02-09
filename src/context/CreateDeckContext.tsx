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
  deckCards: []
}

const createDeckReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_DECK_KEY':
      return { ...state, [action.key]: action.value }

    case 'CLEAR_CURRENT_CARD':
      return { ...state, currentCard: initialState.currentCard }

    case 'UPDATE_CURRENT_CARD':
      return { ...state, currentCard: { ...state.currentCard, [action.key]: action.value } }

    case 'ADD_CURRENT_CARD':
      return { ...state, currentCard: action.card }

    case 'ADD_CARD':
      return { ...state, deckCards: [...state.deckCards, state.currentCard] }

    case 'UPDATE_CARD':
      return {
        ...state,
        deckCards: state.deckCards.map((card, index) =>
          index === action.index ? { ...card, [action.key]: action.value } : card
        )
      }

    case 'DELETE_CARD':
      return {
        ...state,
        deckCards: state.deckCards.filter((card, index) => index !== action.index)
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
        deckCards: state.deckCards.map((card, index) =>
          index === action.index
            ? {
                ...card,
                choices: card.choices.map((choice, choiceIndex) =>
                  choiceIndex === action.choiceIndex
                    ? { ...choice, [action.key]: action.value }
                    : choice
                )
              }
            : card
        )
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
